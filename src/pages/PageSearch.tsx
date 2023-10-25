import { useLocation } from 'react-router-dom'
import { AnswerIcon, CopyIcon, ModuleIcon, StackIcon, SubmitChat } from 'components/Icons/icons'
import { useEffect, useState } from 'react'
import { v4 } from 'uuid'
import { chatWithNous } from 'services/nous'
import ChatSubmit from 'components/ChatSubmit'
import Typewriter from 'components/Typewriter'

const quickLinks = ['What is Nous Pysche?', 'What is the mission of Nous Psyche?', 'Benefits of Nous Psyche']

interface FAQ {
  question: string
  answers: string[]
}

const DisplayAnswer = (prop: { answers: string[] }) => {
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState(0)

  if (prop.answers.length <= 0) {
    return (
      <div role="status" className="max-w-sm animate-pulse">
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
        <span className="sr-only">Loading...</span>
      </div>
    )
  } else {
    return (
      <div className="text-md pb-4 text-md">
        {prop.answers.slice(0, currentAnswerIndex + 1).map((answer, idx) => (
          <p className="mb-5" key={idx}>
            {idx === currentAnswerIndex ? (
              <Typewriter
                text={answer}
                onComplete={() => {
                  if (currentAnswerIndex < prop.answers.length - 1) {
                    setCurrentAnswerIndex(prevIdx => prevIdx + 1)
                  }
                }}
              />
            ) : (
              answer
            )}
          </p>
        ))}
      </div>
    )
  }
}

const PageSearch = () => {
  const [links, setLinks] = useState<String[]>([])
  const [faqs, setFAQs] = useState<FAQ[]>([])
  const [session, setSession] = useState('')
  const [disableChat, setDisableChat] = useState(false)
  const [nousId, setNousId] = useState('nouspsyche-mesolitica-com-354-rasa')

  const location = useLocation()
  const { initialQ } = location.state || {}

  const chatQuestion = (question: string) => {
    if (!question || !session) return

    setDisableChat(true)

    const newFAQ = {
      question,
      answers: [],
    }
    setFAQs(prev => [...prev, newFAQ])
  }

  const askBot = async (question: string) => {
    try {
      const res = await chatWithNous(nousId, session, question)
      if (res.data.length <= 0) {
        return
      }

      const newAnswers: string[] = []

      for (const d of res.data) {
        if (res.data[0].recipient_id === session) {
          newAnswers.push(d.text as string)
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
    } catch (e) {
      console.log(e)
      setDisableChat(false)
    }
  }

  useEffect(() => {
    const chatbotInHook = (question: string) => {
      if (!question || !session) return

      const newFAQ = {
        question,
        answers: [],
      }
      setFAQs(prev => [...prev, newFAQ])
    }

    setLinks(quickLinks)
    if (!session) setSession(v4())
    if (initialQ && faqs.length <= 0 && nousId && session) {
      chatbotInHook(initialQ as string)
    }
  }, [faqs.length, initialQ, nousId, session])

  useEffect(() => {
    faqs.forEach(faq => {
      if (faq.answers.length <= 0) {
        askBot(faq.question).catch(console.log)
      }
    })
  }, [faqs])

  return (
    <div className="flex mx-auto w-3/4 justify-center overflow-auto">
      <main className="w-full h-screen">
        {faqs.map((faq, index) => (
          <>
            <div key={index}>
              <h1 className="text-3xl">{faq.question}</h1>
              <div className="mt-4">
                <h3 className="font-semibold text-xl items-center flex gap-2 rounded-md py-3">
                  <AnswerIcon />
                  Answers
                </h3>
                <DisplayAnswer answers={faq.answers} />
              </div>
            </div>
            <div className="flex my-3">
              {/* <button>
                <CopyIcon classes={'text-gray-400'} />
              </button> */}
            </div>
            <hr className="h-px mb-8 bg-gray-700 border-0 dark:bg-gray-700" />
          </>
        ))}

        <section className="pb-60">
          <div className="">
            <h3 className="font-semibold text-xl items-center flex gap-2 rounded-md py-3">
              <StackIcon />
              Related
            </h3>
            <div className="text-md pb-4 flex gap-2">
              {links.map((link, index) => (
                <button
                  key={index}
                  onClick={() => {
                    // goToSearch(link)
                  }}
                  className=" text-sm hover:bg-[#181818] hover:text-white text-gray-400 bg-white/10 rounded-md p-2"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
        </section>

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

export default PageSearch
