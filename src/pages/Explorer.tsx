import CustomChatCard from 'components/CustomChatCard'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { useGetAllBots } from 'repositories/rpc.repository'

const PageExplorer = () => {
  const { data, fetchNextPage } = useGetAllBots(10)

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
            <p ref={ref} className="opacity-0">
              Observe this
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default PageExplorer
