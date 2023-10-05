import { useBoundStore } from 'store'
import EncryptKnowledgeModal from 'components/Modal/EncryptKnowledge'
import NftMetadataModal from 'components/Modal/NftMetadata'

const PageAdmin = () => {
  const { setModalState } = useBoundStore()

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="text-center w-full mx-auto mb-0 mt-8 max-w-md space-y-4">
        <button
          className="border border-gray-200 p-3"
          onClick={() => {
            setModalState({ nftMetadata: { isOpen: true } })
          }}
        >
          Nft Metadata
        </button>
        <button
          className="border border-gray-200 p-3"
          onClick={() => {
            setModalState({ encryptKnowledge: { isOpen: true } })
          }}
        >
          Encrypt Knowledge
        </button>

        <NftMetadataModal tokenAddress={''} chainId={''} tokenId={''} />
        <EncryptKnowledgeModal tokenAddress={''} chainId={''} tokenId={''} />
      </div>
    </div>
  )
}

export default PageAdmin
