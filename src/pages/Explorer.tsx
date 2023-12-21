import BotCard from 'components/BotCard'
import CustomChatCard from 'components/CustomChatCard'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { useGetAllBots } from 'repositories/rpc.repository'

const PageExplorer = () => {
  const { data, fetchNextPage } = useGetAllBots(20)

  const { ref, inView } = useInView()
  const bots = data?.pages?.flatMap(group => group.data)

  useEffect(() => {
    if (inView) fetchNextPage()
  }, [inView, fetchNextPage])

  return (
    <>
      <div className="w-full px-6">
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
