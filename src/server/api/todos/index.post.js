import { collection, addDoc } from 'firebase/firestore'
import { useFirestore } from 'vuefire'

export default defineEventHandler(async (event) => {
  const db = useFirestore()
  const todosRef = collection(db, 'todos')

  const body = await readBody(event)
  const data = {
    text: body.text,
    completed: false
  }

  try {
    const res = await addDoc(todosRef, data);

    return { data: {...data, ...{ id: res.id }} }
  } catch(error) {
    return { error }
  }

})