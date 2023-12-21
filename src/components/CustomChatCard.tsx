import { Nft } from 'lib'
import { NousNft } from 'lib/NousNft'
import { useNavigate } from 'react-router-dom'

interface Prop {
  dataKey: string
  nft: Nft & NousNft
}

const CustomChatCard = ({ dataKey, nft }: Prop) => {
  const navigate = useNavigate()

  const goToChat = () => {
    navigate(`/room/${dataKey}`)
  }

  return (
    <>
      <article
        className=" p-2 sm:p-6 lg:p-2 font-arial cursor-pointer bg-gray-600/50 hover:bg-blue-600/80 hover:border-1 hover:border-slate-800 rounded-sm hover:backdrop-blur"
        onClick={goToChat}
      >
        <div className="flex items-start sm:gap-8">
          <div className={`group relative block overflow-hidden h-24 w-24 ring-1 ring-white`}>
            {nft.achievement?.badge && (
              <img
                className={`absolute end-1.5 top-2 sm:end-3 sm:top-3 w-3 h-3 md:w-8 md:h-8 z-10 bg-white rounded-full p-0.5`}
                src={nft.achievement?.badge}
              />
            )}
            <img className="object-contain h-full" src={nft.metadata.image} />
          </div>

          <div>
            <h3 className="font-bold sm:text-xl text-gray-100">{nft.builder?.name}</h3>

            <p className="mt-1 text-md text-gray-400 line-clamp-2 h-12">{nft.builder?.description}</p>

            <div className="mt-1 sm:flex sm:items-center sm:gap-2">
              <p className="text-xs font-medium text-gray-400">
                By <span className="text-gray-400">Nous Psyche #{nft.token_id}</span>
              </p>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}

export default CustomChatCard
