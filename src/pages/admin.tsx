import { useBoundStore } from 'store'
import EncryptKnowledgeModal from 'components/Modal/EncryptKnowledge'
import NftMetadataModal from 'components/Modal/NftMetadata'
import { useGetNousMetadatas } from 'repositories/rpc.repository'
import { LitProtocolEncryption } from 'services/rpc'
import NousMetadataModal from 'components/Modal/NousMetadata'
import { useAlertMessage } from 'hooks/use-alert-message'
import { useConnectedWallet } from 'hooks/use-connected-wallet'

const PageAdmin = () => {
  const { showError } = useAlertMessage()
  const { address } = useConnectedWallet()

  const { setModalState } = useBoundStore()
  const { data: nfts } = useGetNousMetadatas(address.full, 0)

  const openNftMetadataModal = (tokenId: string, index: number) => {
    if (!address?.full) {
      showError('Connect your wallet to proceed')
      return
    }

    if (!nfts?.[index]) return

    const token = nfts[index]?.token
    const metadata = nfts[index]?.metadata

    setModalState({
      nftMetadata: {
        isOpen: true,
        token_id: `${tokenId}`,
        chain_id: token?.chain ?? import.meta.env.VITE_DEFAULT_LINEAGE_CHAIN,
        token_address: token?.address ?? import.meta.env.VITE_NOUS_AI_NFT,
        version: metadata?.version ?? '',
        metadata,
      },
    })
  }

  const openEncryptKnowledgeModal = (tokenId: string, index: number) => {
    if (!address?.full) {
      showError('Connect your wallet to proceed')
      return
    }

    if (!nfts?.[index]) return

    const token = nfts[index]?.token
    const lit_protocol = nfts[index]?.lit_protocol

    setModalState({
      encryptKnowledge: {
        isOpen: true,
        token_id: `${tokenId}`,
        chain_id: token?.chain ?? import.meta.env.VITE_DEFAULT_LINEAGE_CHAIN,
        token_address: token?.address ?? import.meta.env.VITE_NOUS_AI_NFT,
        version: lit_protocol?.version ?? '',
        encryption: lit_protocol as LitProtocolEncryption,
      },
    })
  }

  const openNousMetadataModal = (tokenId: string, index: number) => {
    if (!address?.full) {
      showError('Connect your wallet to proceed')
      return
    }

    if (!nfts?.[index]) return

    const token = nfts[index]?.token
    const nous = nfts[index]?.nous

    setModalState({
      nousMetadata: {
        isOpen: true,
        token_id: `${tokenId}`,
        chain_id: token?.chain ?? import.meta.env.VITE_DEFAULT_LINEAGE_CHAIN,
        token_address: token?.address ?? import.meta.env.VITE_NOUS_AI_NFT,
        version: nous?.version ?? '',
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
          {nfts?.map((nft, index) => {
            if (nft) {
              return (
                <tr key={index}>
                  <td className="whitespace-nowrap px-4 py-2 text-white text-lg text-left">
                    <div>
                      <div className="text-center font-semibold">{nft.token_id}</div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-4 py-2 text-white text-lg text-left">
                    <div>
                      <div className="text-center font-semibold">
                        {nft.metadata &&
                          nft.metadata.attributes &&
                          (nft.metadata?.attributes.find(el => el.trait_type === 'name')?.value ?? '-')}
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-white text-center">
                    <button
                      className={`border p-3 ${
                        nft.metadata.description.length > 0 ? 'bg-green-200 text-green-700' : 'border-gray-200'
                      }`}
                      onClick={() => openNftMetadataModal(`${nft.token_id}`, index)}
                    >
                      +
                    </button>
                  </td>

                  <td className="whitespace-nowrap px-4 py-2 text-white text-center">
                    <button
                      className={`border p-3 ${
                        nft.lit_protocol.encrypted_string ? 'bg-green-200 text-green-700' : 'border-gray-200'
                      }`}
                      onClick={() => openEncryptKnowledgeModal(`${nft.token_id}`, index)}
                    >
                      +
                    </button>
                  </td>

                  <td className="whitespace-nowrap px-4 py-2 text-white text-center">
                    <button
                      className="border border-gray-200 p-3"
                      onClick={() => openNousMetadataModal(`${nft.token_id}`, index)}
                    >
                      +
                    </button>
                  </td>
                </tr>
              )
            }
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
