import { collection, getDocs } from 'firebase/firestore'
import { useFirestore } from 'vuefire'

export default defineEventHandler(async (event) => {
  const db = useFirestore()
  const todosRef = collection(db, 'todos')
  
  try {
    const res = await getDocs(todosRef);
    const data = res.docs.map(doc => ({ ...doc.data(), ...{id: doc.id} }) )

    return { data }

  } catch(error) {
    return { error }
  }
})