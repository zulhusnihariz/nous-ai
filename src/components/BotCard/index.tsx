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
        <button className="absolute end-4 top-4 z-10 rounded-full bg-white p-1.5 text-gray-900 transition hover:text-gray-900/75">
          <span className="sr-only">Opensea</span>

          <OpenseaIcon enabled={false} />
        </button>

        <img
          src={metadata.image}
          alt={metadata.name}
          className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="relative border border-gray-100 bg-white px-6 py-4">
          <span className="flex items-center justify-between">
            <h3 className="text-md font-medium text-gray-900 truncate">{metadata.name}</h3>
            <span className="whitespace-nowrap bg-green-400 px-3 py-1.5 text-xs font-medium">Public</span>
          </span>

          <form className="mt-4">
            {metadata.animation_url && (
              <a
                href={metadata.animation_url}
                target="_blank"
                className="block w-full rounded bg-yellow-400 text-yellow-800 text-center p-4 text-sm font-medium transition hover:scale-105"
              >
                ACCESS DAPP
              </a>
            )}
            {!metadata.animation_url && (
              <button className="block w-full rounded bg-gray-400 p-4 text-sm font-medium">Disabled</button>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default BotCard
