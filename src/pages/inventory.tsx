import { PlusIcon } from 'components/Icons/icons'
import { useConnectedWallet } from 'hooks/use-connected-wallet'
import { useNavigate } from 'react-router-dom'
import { useGetNftByWalletAddress } from 'repositories/moralis.repository'
import { useGetOwnedNousMetadatas } from 'repositories/rpc.repository'
import RPC from 'utils/ethers'

const contractABI = [
  {
    inputs: [],
    name: 'mintPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'mint',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
]

const PageInventory = () => {
  const navigate = useNavigate()
  const { address } = useConnectedWallet()
  const { data: owned } = useGetNftByWalletAddress({ address: address?.full, chain: 'mumbai' })
  const { data: nfts } = useGetOwnedNousMetadatas(address.full, owned?.map(el => `${el.token_id}`) ?? [])

  const handleOnMintClicked = async () => {
    const mintPrice = await getMintPrice()
    const rpc = new RPC(window?.ethereum as any)

    await rpc.callContractMethod({
      contractABI,
      contractAddress: import.meta.env.VITE_NOUS_AI_UTILITY,
      method: 'mint',
      data: [],
      options: {
        value: mintPrice,
      },
    })
  }

  const getMintPrice = async () => {
    const rpc = new RPC(window?.ethereum as any)

    const mintPrice = await rpc.readContractData({
      contractABI,
      contractAddress: import.meta.env.VITE_NOUS_AI_UTILITY,
      method: 'mintPrice',
      data: [],
    })

    return mintPrice
  }

  return (
    <div className="flex justify-center">
      <div className="block w-3/4">
        <div className="bg-[#181818] rounded p-4">
          <div className="bg-[#181818] rounded p-4">
            <div className="text-2xl font-semibold mb-4">My Nous</div>
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-4">
              <div className="text-sm border border-transparent hover:text-black p-2 rounded-lg cursor-pointer">
                <div
                  onClick={() => handleOnMintClicked()}
                  className="rounded-lg w-full gap-2 text-white bg-black/20 border-2 border border-gray-800 text-black flex justify-center items-center h-48 hover:scale-105 transition duration-500"
                >
                  <div>
                    <PlusIcon />
                  </div>
                </div>
              </div>
              {nfts?.map((nft, index) => (
                <div
                  key={index}
                  className="text-sm border border-transparent hover:bg-gray-100 hover:text-black p-2 rounded-lg cursor-pointer"
                  onClick={() => navigate(`/nft`, { state: { nft } })}
                >
                  {nft.metadata && (
                    <>
                      <img
                        className="rounded-lg w-full bg-white object-cover h-48 hover:scale-105 transition duration-500"
                        src={nft.metadata.image}
                        alt={nft.metadata.name}
                      />
                      <div className="font-semibold mt-2 truncate">{nft.metadata.name}</div>
                      <div className="">Polygon</div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageInventory
