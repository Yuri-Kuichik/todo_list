import { updateDoc, doc } from 'firebase/firestore'
import { useFirestore } from 'vuefire'

export default defineEventHandler(async (event) => {
  // const id = parseInt(event.context.params.id)

  const body = await readBody(event)

  const db = useFirestore()
  const todoDocRef = doc(db, "todos", body.id)

  try {
    const res = await updateDoc(todoDocRef, body );

    return { data: body}
  } catch(error) {
    return { error }
  }

})