import BotCard from 'components/BotCard'
import { useGetAllBots } from 'repositories/rpc.repository'

const PageExplorer = () => {
  const { data: bots } = useGetAllBots(50, 0)

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
          </div>
        </div>
      </div>
    </>
  )
}

export default PageExplorer
