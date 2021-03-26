import { useEffect, useState } from 'react'
import firebase from 'firebase/app'
import useAuthentication from '../../hooks/authentication'
import { Question } from '../../models/Question'
import Layout from '../../components/Layout'

const { user } = useAuthentication()

useEffect(() => {
  if (!process.browser) {
    return
  }
  if (user === null) {
    return
  }

  async function loadQuestions() {
    const snapshot = await firebase
      .firestore()
      .collection('questions')
      .where('receiverUid', '==', user.uid)
      .get()

    if (snapshot.empty) {
      return
    }

    const gotQuestions = snapshot.docs.map((doc) => {
      const question = doc.data() as Question
      question.id = doc.id
      return question
    })
    setQuestions(gotQuestions)
  }

  loadQuestions()
}, [process.browser, user])

export default function QuestionsReceived() {
  const [questions, setQuestions] = useState<Question[]>([])

  return (
    <Layout>
      <div>{questions.length}</div>
    </Layout>
  )
}