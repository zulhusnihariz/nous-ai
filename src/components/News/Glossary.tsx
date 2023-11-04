import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { StackIcon } from 'components/Icons/icons'
import { News } from 'lib'
import { useEffect, useState } from 'react'
import { chatWithNous } from 'services/nous'

interface Prop {
  nousId: String
  readingNews?: News
  session: String
  refetch: boolean
  doneRefetch: () => void
  summary: String
  chatQuestion: (prompt: string) => void
}

const NewsGlossary = (prop: Prop) => {
  const [relatedArticles, setRelatedArticles] = useState([])
  const [properNouns, setProperNouns] = useState([])

  useEffect(() => {
    const getProperNouns = async () => {
      const question = `
      Based on ${prop.summary},
      Provide a short description not more than 15 words for all proper nouns in the text; and a follow up link to learn more about it.
      Format your answer as array of json containing fields: name, description and url.
      Ensure that there is no duplicate for the nouns and the url that you provided.
      `
      try {
        const res = await chatWithNous(prop.nousId as string, prop.session as string, question)
        const stringified = res.data[0].text
        const parsed = JSON.parse(stringified)

        return parsed
      } catch (e) {
        console.log(e)
      }
    }

    const getRelatedArticles = async () => {
      const question = `
      Based on ${prop.summary},
      List related articles that are within the same context with the question. 
      Format your answer as array of json containing the fields: title and url.
      `

      try {
        const res = await chatWithNous(prop.nousId as string, prop.session as string, question)
        const stringified = res.data[0].text
        const parsed = JSON.parse(stringified)

        return parsed
      } catch (e) {
        console.log(e)
      }
    }

    const fetchNewData = async () => {
      const [articles, nouns] = await Promise.all([getRelatedArticles(), getProperNouns()])

      setRelatedArticles(articles)
      setProperNouns(nouns)
    }

    if (prop.summary && prop.refetch) {
      setRelatedArticles([])
      setProperNouns([])
      fetchNewData()
        .then(() => prop.doneRefetch())
        .catch(console.log)
    }
  }, [prop, prop.nousId, prop.readingNews, prop.session])

  return (
    <>
      <div className="">
        <div className="text-md pb-4">
          <div className="col-span-2 mr-2">
            {properNouns && properNouns.length > 0 && (
              <>
                <h3 className="font-semibold text-xl items-center flex gap-2 rounded-md pb-3">
                  <StackIcon />
                  Glossary
                </h3>
                <div className="text-md pb-4">
                  {properNouns.map((noun, index) => (
                    <div
                      key={index}
                      onClick={e => {
                        e.stopPropagation()
                        prop.chatQuestion(`What is ${(noun as any).name}`)
                      }}
                      className="text-md border-b border-b-gray-600 py-2 cursor-pointer hover:text-yellow-400"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-400 00">{(noun as any).name} </span>
                        {(noun as any).url && (
                          <a
                            href={(noun as any).url}
                            target="_blank"
                            onClick={event => {
                              event.stopPropagation()
                            }}
                          >
                            <ArrowTopRightOnSquareIcon className="h-4 w-4 text-blue-500 hover:text-blue-800" />
                          </a>
                        )}
                      </div>
                      <span className="text-gray-500">{(noun as any).description}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            <div className={`${properNouns && properNouns.length > 0 ? 'col-span-4' : 'col-span-full'}`}>
              {relatedArticles && relatedArticles.length > 0 && (
                <div className="">
                  <h3 className="font-semibold text-xl items-center flex gap-2 rounded-md py-3">
                    <StackIcon />
                    Related Articles
                  </h3>
                  <div className="text-md pb-4">
                    <div className="flex flex-col gap-4">
                      {relatedArticles.map((article, index) => (
                        <div
                          key={index}
                          className="text-md  hover:text-yellow-400 text-gray-500 cursor-pointer"
                          onClick={() => {
                            window.open((article as any).url)
                          }}
                        >
                          {(article as any).title}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NewsGlossary
