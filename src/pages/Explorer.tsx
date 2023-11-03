import BotCard from 'components/BotCard'
import { useNavigate } from 'react-router-dom'
import { useGetAllBots } from 'repositories/rpc.repository'

const PageExplorer = () => {
  const { data: bots } = useGetAllBots()

  const navigate = useNavigate()

  const goToRoom = (bot: any) => {
    if (bot.metadata.animation_url) {
      navigate(`/container/${bot.dataKey}`)
    } else {
      navigate(`/room/${bot.dataKey}`)
    }
  }

  return (
    <>
      <div className="w-full">
        <div className="h-32 rounded-lg w-full">
          <div className="grid grid-cols-5 gap-3">
            {bots &&
              bots.map((bot, index) => {
                return (
                  <div
                    key={index}
                    className="text-sm border border-transparent hover:bg-gray-100/10 hover:text-white p-2 rounded-lg cursor-pointer"
                    onClick={() => goToRoom(bot)}
                  >
                    <BotCard metadata={bot.metadata} />
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
