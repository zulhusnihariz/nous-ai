import { useNavigate } from 'react-router-dom'

interface Prop {
  name: string
}

const BotCard = ({ name }: Prop) => {
  const navigate = useNavigate()

  return (
    <div
      className="border-black border-2 rounded-lg p-6 flex items-center justify-between mt-4  bg-white/40 cursor-pointer"
      onClick={() => navigate(`/community/bot/${name}`)}
    >
      <div>
        <p className="text-lg font-semibold">Bot #{name}</p>
      </div>
    </div>
  )
}

export default BotCard
