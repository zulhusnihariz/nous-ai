import { NftMetadata } from 'lib'
import { useNavigate } from 'react-router-dom'

interface Prop {
  metadata: NftMetadata
}

const BotCard = ({ metadata }: Prop) => {
  const navigate = useNavigate()

  return (
    <div>
      <img className="rounded-lg w-full bg-white object-cover h-48" src={metadata.image} alt={metadata.name} />
      <div className="mt-2 truncate">{metadata.name}</div>
    </div>
  )
}

export default BotCard
