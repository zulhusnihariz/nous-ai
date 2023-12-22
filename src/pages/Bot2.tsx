import { useEffect, useState } from 'react'
import { v4 } from 'uuid'
import { DisplayAnswer } from './PageSearch'
import { AnswerIcon, StackIcon } from 'components/Icons/icons'
import { chatWithNous } from 'services/nous'
import ChatSubmit from 'components/ChatSubmit'
import { useGetSingleNousMetadata } from 'repositories/rpc.repository'
import { formatDataKey } from 'utils'
import Newsfeed from 'components/News/Newsfeed'
import { News } from 'lib'
import NewsBox from 'components/News/Box'
import NewsGlossary from 'components/News/Glossary'

interface FAQ {
  question: string
  answers: string[]
  refetch: boolean
}

const PageBot2 = () => {
  const [faqs, setFAQs] = useState<FAQ[]>([])
  const [disableChat, setDisableChat] = useState(false)
  const [key, setDataKey] = useState('')
  const [readingNews, setReadingNews] = useState<News>()
  const { data: nft } = useGetSingleNousMetadata(key)
  const [refetch, setRefetch] = useState(false)
  const [newsSummary, setNewsSummary] = useState('')
  const [nousId] = useState('2592')

  const [session, setSession] = useState(v4())
  useEffect(() => {
    if (!key) {
      const data_key = formatDataKey(
        import.meta.env.VITE_DEFAULT_CHAIN_ID as string,
        import.meta.env.VITE_NOUS_AI_NFT as string,
        '2'
      )

      setDataKey(data_key)
    }
  }, [key])

  const chatQuestion = (question: string) => {
    if (!question) return

    setDisableChat(true)

    const newFAQ = {
      question,
      answers: [],
      refetch: false,
    }

    setFAQs(prev => [...prev, newFAQ])
  }

  // Ask nous
  const askBot = async (fq: FAQ) => {
    try {
      const res = await chatWithNous(nousId, session, fq.question)
      if (res.data.length <= 0) {
        return
      }

      const newAnswers: string[] = []

      for (const d of res.data) {
        if (d.recipient_id === session) {
          const strings = d.text.split('\n')
          for (const s of strings) {
            newAnswers.push(s as string)
          }
          setNewsSummary(d.text as string)
        }
      }

      setFAQs(prev =>
        prev.map(faq => {
          if (faq.question === fq.question && faq.answers.length === 0) {
            return { ...faq, answers: newAnswers }
          }
          return faq
        })
      )

      setRefetch(fq.refetch)
      setDisableChat(false)

      setFAQs(prev =>
        prev.map(faq => {
          if (faq.question === fq.question) {
            return { ...faq }
          }
          return faq
        })
      )

      if (readingNews?.content === '') {
        const content = newAnswers.join(' ')

        setReadingNews(prev => {
          console.log('prev,', prev)
          if (prev) return { ...prev, content }
        })
      }
    } catch (e) {
      console.log(e)
      setDisableChat(false)
    }
  }

  useEffect(() => {
    if (session && faqs.length > 0) {
      faqs.forEach(faq => {
        if (faq.answers.length <= 0) {
          askBot(faq).catch(console.log)
        }
      })
    }
  }, [faqs, session])

  const onHandleNewsClick = (feed: News) => {
    setSession(v4())
    setFAQs([
      {
        question: `Summarized and compact the context below \n ${feed.content}`,
        answers: [],
        refetch: true,
      },
    ])
    setReadingNews(feed)
  }

  const onHandleRelatedArticlesClick = (title: string) => {
    chatQuestion(title)
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8 pb-[130px]">
      {nousId && (
        <>
          <div className="">
            <Newsfeed onClick={onHandleNewsClick} />
          </div>
          <div className="lg:col-span-2 px-2">
            {faqs
              .slice(1)
              .reverse()
              .map((faq, index) => (
                <>
                  <div key={index}>
                    <h1 className="text-xl font-bold text-yellow-400">{faq.question}</h1>
                    <div className="mt-2">
                      <DisplayAnswer answers={faq.answers} />
                    </div>
                  </div>
                  <hr className="h-px my-8 bg-gray-700 border-0 dark:bg-gray-700" />
                </>
              ))}
            <NewsBox readingNews={readingNews} />
          </div>
          <div className="">
            <NewsGlossary
              nousId={nousId as String}
              readingNews={readingNews}
              session={session}
              refetch={refetch}
              doneRefetch={() => setRefetch(false)}
              summary={newsSummary}
              chatQuestion={chatQuestion}
              onHandleRelatedArticlesClick={onHandleRelatedArticlesClick}
            />
          </div>
        </>
      )}
      <div className="fixed bottom-0 left-0 w-full">
        <div className="relative py-6">
          <ChatSubmit onSendChat={msg => chatQuestion(msg)} disable={disableChat} />
        </div>
      </div>
    </div>
  )
}

export default PageBot2
