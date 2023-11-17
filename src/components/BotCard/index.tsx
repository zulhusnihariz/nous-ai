import { OpenseaIcon } from 'components/Icons/socials'
import { NftMetadata } from 'lib'
import { useNavigate } from 'react-router-dom'

interface Prop {
  dataKey: string
  metadata: NftMetadata
}

const BotCard = ({ metadata, dataKey }: Prop) => {
  const navigate = useNavigate()

  const goToRoom = () => {
    navigate(`/room/${dataKey}`)
  }

  return (
    <div>
      <div className="group relative block overflow-hidden rounded-lg">
        <button className="absolute end-4 top-4 z-10 rounded-full bg-white text-gray-900 transition hover:text-gray-900/75">
          <span className="sr-only">Opensea</span>

          <OpenseaIcon enabled={false} />
        </button>

        <h3 className="absolute end-4 bottom-4 z-10 text-md font-medium text-gray-300 truncate">{metadata.name}</h3>

        <img
          src={metadata.image}
          alt={metadata.name}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
    </div>
  )
}

export default BotCard
