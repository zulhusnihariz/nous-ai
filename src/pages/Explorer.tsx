import CustomChatCard from 'components/CustomChatCard'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { useGetAllBots } from 'repositories/rpc.repository'

export const CustomChatCardSkeleton = () => {
  return (
    <div
      role="status"
      className="w-full px-4 py-2 border border-gray-200 rounded shadow animate-pulse md:p-4 dark:border-gray-700"
    >
      <div className="flex items-center">
        <svg
          className="w-10 h-10 me-3 text-gray-200 dark:text-gray-700"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
        </svg>
        <div>
          <div className="h-3.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2 mt-1"></div>
          <div className="w-72 h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2"></div>
          <div className="w-32  h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>

          <div className=" h-1.5 w-24  bg-gray-200 rounded-full dark:bg-gray-700 mt-4"></div>
        </div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  )
}

const PageExplorer = () => {
  const { data, fetchNextPage, isLoading } = useGetAllBots(10)

  const { ref, inView } = useInView()
  const bots = data?.pages?.flatMap(group => group.data)

  useEffect(() => {
    if (inView) fetchNextPage()
  }, [inView, fetchNextPage])

  return (
    <>
      <div className="w-full px-6 font-arial">
        <div className="w-full text-center py-6">
          <Link to="/mint" className="underline font-bold">
            Mint
          </Link>
          new Nous Pysche NFT to create custom knowledge.
          <Link
            to=""
            className="underline text-gray-300"
            onClick={() => {
              window.open('https://nous-psyche.notion.site/Glossary-64da36bc10314f619259c8585b1cd44d', '_blank')
            }}
          >
            Learn more
          </Link>
        </div>
        <div className="h-32 rounded-lg w-full">
          <h1 className="text-3xl font-bold mb-3">Explore Nous Psyche</h1>
          {isLoading ? (
            <>
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
                <CustomChatCardSkeleton />
                <CustomChatCardSkeleton />
                <CustomChatCardSkeleton />
                <CustomChatCardSkeleton />
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
              {bots &&
                bots.map((bot, index) => {
                  if (bot.builder?.name) {
                    return (
                      <div key={index} className="text-[8px] sm:text-sm border border-transparent rounded-lg">
                        <CustomChatCard dataKey={bot.dataKey} nft={bot} />
                      </div>
                    )
                  }
                })}
              <p ref={ref} className="mt-72 opacity-0">
                Observe this
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default PageExplorer
