import { useBoundStore } from 'store'
import EncryptKnowledgeModal from 'components/Modal/EncryptKnowledge'
import NftMetadataModal from 'components/Modal/NftMetadata'
import { useGetMetadatas } from 'repositories/rpc.repository'
import { LitProtocolEncryption } from 'services/rpc'
import { v4 } from 'uuid'
import NousMetadataModal from 'components/Modal/NousMetadata'

const PageAdmin = () => {
  const { setModalState } = useBoundStore()
  const { data: metadatas } = useGetMetadatas()
  // TODO: fetch nft from smart contract
  let nft = [{ tokenId: 1 }, { tokenId: 2 }]

  const openNftMetadataModal = (tokenId: string) => {
    const token = metadatas?.[tokenId]?.token
    const nft = metadatas?.[tokenId]?.nft

    setModalState({
      nftMetadata: {
        isOpen: true,
        token_id: `${tokenId}`,
        chain_id: token?.chain ?? import.meta.env.VITE_DEFAULT_LINEAGE_CHAIN,
        token_address: token?.address ?? import.meta.env.VITE_NOUS_AI_NFT,
        version: nft?.version ?? v4(),
        metadata: nft,
      },
    })
  }

  const openEncryptKnowledgeModal = (tokenId: string) => {
    const token = metadatas?.[tokenId]?.token
    const lit_protocol = metadatas?.[tokenId]?.lit_protocol

    setModalState({
      encryptKnowledge: {
        isOpen: true,
        token_id: `${tokenId}`,
        chain_id: token?.chain ?? import.meta.env.VITE_DEFAULT_LINEAGE_CHAIN,
        token_address: token?.address ?? import.meta.env.VITE_NOUS_AI_NFT,
        version: lit_protocol?.version ?? v4(),
        encryption: lit_protocol as LitProtocolEncryption,
      },
    })
  }

  const openNousMetadataModal = (tokenId: string) => {
    const token = metadatas?.[tokenId]?.token
    const nous = metadatas?.[tokenId]?.nous

    setModalState({
      nousMetadata: {
        isOpen: true,
        token_id: `${tokenId}`,
        chain_id: token?.chain ?? import.meta.env.VITE_DEFAULT_LINEAGE_CHAIN,
        token_address: token?.address ?? import.meta.env.VITE_NOUS_AI_NFT,
        version: nous?.version ?? v4(),
        metadata: nous,
      },
    })
  }

  return (
    <div className="h-screen w-full flex justify-center items-start">
      <table className="table-auto min-w-full divide-y-2 divide-gray-200 bg-gray-800 text-sm">
        <thead className="bg-gray-600 w-full text-white">
          <tr>
            <th className="whitespace-nowrap px-4 py-2 font-semibold text-lg text-center">Token ID</th>
            <th className="whitespace-nowrap px-4 py-2 font-semibold text-lg text-center">Name</th>
            <th className="whitespace-nowrap px-4 py-2 font-semibold text-lg text-center">Nft Metadata</th>
            <th className="whitespace-nowrap px-4 py-2 font-semibold text-lg text-center">Encryption</th>
            <th className="whitespace-nowrap px-4 py-2 font-semibold text-lg text-center">Nous Metadata</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {nft?.map((el, index) => {
            return (
              <tr key={index}>
                <td className="whitespace-nowrap px-4 py-2 text-white text-lg text-left">
                  <div>
                    <div className="text-center font-semibold">{el.tokenId}</div>
                  </div>
                </td>

                <td className="whitespace-nowrap px-4 py-2 text-white text-lg text-left">
                  <div>
                    <div className="text-center font-semibold">
                      {metadatas?.[el.tokenId]?.nft.attributes.find(el => el.trait_type === 'name')?.value ?? '-'}
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-white text-center">
                  <button className="border border-gray-200 p-3" onClick={() => openNftMetadataModal(`${el.tokenId}`)}>
                    +
                  </button>
                </td>

                <td className="whitespace-nowrap px-4 py-2 text-white text-center">
                  <button
                    className="border border-gray-200 p-3"
                    onClick={() => openEncryptKnowledgeModal(`${el.tokenId}`)}
                  >
                    +
                  </button>
                </td>

                <td className="whitespace-nowrap px-4 py-2 text-white text-center">
                  <button className="border border-gray-200 p-3" onClick={() => openNousMetadataModal(`${el.tokenId}`)}>
                    +
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <NftMetadataModal />
      <EncryptKnowledgeModal />
      <NousMetadataModal />
    </div>
  )
}

export default PageAdmin
