import BotCard from 'components/BotCard'
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
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
            {bots &&
              bots.map((bot, index) => {
                return (
                  <div key={index} className="text-[8px] sm:text-sm border border-transparent rounded-lg">
                    <BotCard dataKey={bot.dataKey} nft={bot} />
                  </div>
                )
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
