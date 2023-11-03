import { useEffect, useState } from 'react'
import { v4 } from 'uuid'
import { DisplayAnswer } from './PageSearch'
import { AcademicCapIcon, AnswerIcon, StackIcon } from 'components/Icons/icons'
import { chatWithNous } from 'services/nous'
import ChatSubmit from 'components/ChatSubmit'

interface FAQ {
  question: string
  answers: string[]
  properNouns: { name: string; description: string; url: string }[]
  relatedArticles: { title: string; url: string }[]
}

const PageBot = () => {
  const [faqs, setFAQs] = useState<FAQ[]>([])
  const [disableChat, setDisableChat] = useState(false)
  const [nousId] = useState('nouspsyche-mesolitica-com-354-rasa')

  const chatQuestion = (question: string) => {
    if (!question) return

    setDisableChat(true)

    const newFAQ = {
      question,
      answers: [],
      properNouns: [],
      relatedArticles: [],
    }

    setFAQs(prev => [...prev, newFAQ])
  }

  // Ask nous
  const askBot = async (question: string) => {
    let session = v4()

    try {
      const res = await chatWithNous(nousId, session, question)
      if (res.data.length <= 0) {
        return
      }

      const newAnswers: string[] = []
      let chatContext = ''

      for (const d of res.data) {
        if (d.recipient_id === session) {
          const strings = d.text.split('\n')
          for (const s of strings) {
            newAnswers.push(s as string)
            chatContext += s
          }
        }
      }

      setFAQs(prev =>
        prev.map(faq => {
          if (faq.question === question && faq.answers.length === 0) {
            return { ...faq, answers: newAnswers }
          }
          return faq
        })
      )

      setDisableChat(false)

      let properNouns = await getProperNouns(session)
      let relatedArticles = await getRelatedArticles(session)

      setFAQs(prev =>
        prev.map(faq => {
          if (faq.question === question) {
            return { ...faq, properNouns: properNouns ?? [], relatedArticles: relatedArticles ?? [] }
          }
          return faq
        })
      )
    } catch (e) {
      console.log(e)
      setDisableChat(false)
    }
  }

  const getProperNouns = async (session: string) => {
    let question = `
    Based on the your first answer for this session, 
    I want you to provide a short and concise description for all proper noun in the answers; and a follow up link to learn more about it.
    Please respond to this question strictly if your first answer is related to at least one of these topics: nft, web3, crypto news, and technologies. 
    Return and empty array if your first answer is not related to previous specificied topics or if there are no relevant proper nouns. 
    Else, format your answer as array of json containing fields: name, description and url.
    Please ensure that there is no duplicate for the nouns and the url that you provided. 
    `
    try {
      const res = await chatWithNous(nousId, session, question)
      let stringified = res.data[0].text
      let parsed = JSON.parse(stringified)

      return parsed
    } catch (e) {
      console.log(e)
    }
  }

  const getRelatedArticles = async (session: string) => {
    let question = `
    Based on the your first answer for this session, 
    I want you to include links to related articles that are within the same topic with the answer. 
    Please respond to this question strictly if your first answer is related to at least one of these topic: nft, web3, crypto news, and technologies.
    Return an empty array if your first answer is not related to previous specificied topics or there are no relevant related articles.
    Else, format your answer as array of json containing the fields: title & url.
    `

    try {
      const res = await chatWithNous(nousId, session, question)
      let stringified = res.data[0].text
      let parsed = JSON.parse(stringified)

      return parsed
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    faqs.forEach(faq => {
      if (faq.answers.length <= 0) {
        askBot(faq.question).catch(console.log)
      }
    })
  }, [faqs])

  return (
    <div className="flex mx-auto w-4/5 md:w-3/4 justify-center overflow-auto scrollbar-hide">
      <main className="w-full h-screen">
        {faqs.map((faq, index) => (
          <div key={index}>
            <div>
              <h1 className="text-3xl">{faq.question}</h1>

              <div className="grid grid-cols-6 gap-2 mt-4">
                <div className={`${faq.properNouns.length > 0 ? 'col-span-4' : 'col-span-full'}`}>
                  <h3 className="font-semibold text-xl items-center flex gap-2 rounded-md py-3">
                    <AnswerIcon />
                    Answers
                  </h3>
                  <DisplayAnswer answers={faq.answers} />

                  {faq.relatedArticles.length > 0 && (
                    <div className="">
                      <h3 className="font-semibold text-xl items-center flex gap-2 rounded-md py-3">
                        <StackIcon />
                        Related Articles
                      </h3>
                      <div className="text-md pb-4">
                        {faq.relatedArticles.map((article, index) => (
                          <ol className="list-decimal">
                            <li
                              key={index}
                              className="text-md  hover:text-yellow-400 text-gray-500 cursor-pointer"
                              onClick={() => {
                                window.open(article.url)
                              }}
                            >
                              {article.title}
                            </li>
                          </ol>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="col-span-2 mr-2">
                  {faq.properNouns.length > 0 && (
                    <>
                      <h3 className="font-semibold text-xl items-center flex gap-2 rounded-md py-3">
                        <AcademicCapIcon />
                        Learn More
                      </h3>
                      <div className="text-md pb-4">
                        {faq.properNouns.map((noun, index) => (
                          <div
                            key={index}
                            onClick={() => {
                              window.open(noun.url)
                            }}
                            className="text-md border-b border-b-gray-600 py-2 cursor-pointer"
                          >
                            <span className="font-bold text-gray-400">{noun.name} </span>
                            <br />

                            <span className="text-gray-500 hover:text-yellow-400">{noun.description}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex my-3">
              {/* <button>
                <CopyIcon classes={'text-gray-400'} />
              </button> */}
            </div>
            <hr className="h-px mb-8 bg-gray-700 border-0 dark:bg-gray-700" />
          </div>
        ))}

        <section className="pb-60"></section>

        {/* Input Section */}
        <div className="absolute bottom-0 left-0 w-full">
          <div className="relative py-6">
            <ChatSubmit onSendChat={msg => chatQuestion(msg)} disable={disableChat} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default PageBot
