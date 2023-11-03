import BotCard from 'components/BotCard'

const PageCommunity = () => {
  const bots = Array.from(Array(10).keys())

  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
        <div className="h-32 rounded-lg lg:col-span-2">
          <div className="rounded-lg border border-gray-700 bg-orange-300 text-black p-4">
            <div className="text-lg font-bold">Community bots</div>

            <div className="grid grid-cols-3 gap-3">
              {bots.map(bot => {
                return <BotCard name={`${bot}`} />
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PageCommunity
