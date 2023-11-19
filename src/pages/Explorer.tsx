import BotCard from 'components/BotCard'
import { useGetAllBots } from 'repositories/rpc.repository'

const PageExplorer = () => {
  const { data: bots } = useGetAllBots()

  return (
    <>
      <div className="w-full">
        <div className="h-32 rounded-lg w-full">
          <div className="grid grid-cols-6 gap-2">
            {bots &&
              bots.map((bot, index) => {
                return (
                  <div key={index} className="text-sm border border-transparent rounded-lg">
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
