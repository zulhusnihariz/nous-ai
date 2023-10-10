import ChainName from 'components/ChainName'
import ShareDialog from 'components/ShareDialog'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { convertSnakeToCamelCase, formatDataKey } from 'utils'
import { Metadata } from 'lib'
import { useApi } from 'hooks/use-api'
import { ChatIcon, DatabaseIcon } from 'components/Icons/icons'
import { useLitProtocol } from 'hooks/use-lit-protocol'
import ViewKnowledgeModal from 'components/Modal/ViewKnowledge'
import { useBoundStore } from 'store'
import { AccessControlConditions } from '@lit-protocol/types'

const PageNft = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { rpc } = useApi()
  const { setModalState } = useBoundStore()

  const { nft } = location.state || {}

  const [nftKey, setNftKey] = useState('')
  // versions
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  useEffect(() => {
    const loadVersion = async () => {
      const nftKey = formatDataKey(nft.chain_id as String, nft.address as String, nft.token_id as String)

      const response = await rpc.getMetadataUseKeyByBlock(nftKey, import.meta.env.VITE_META_CONTRACT_ID as String, '')

      const metadatas = response.data.result.metadatas as Metadata[]

      const uniqueVersions: String[] = []
      metadatas.map(item => {
        if (!uniqueVersions.includes(item.version)) {
          uniqueVersions.push(item.version)
        }
      })

      setIsDataLoaded(true)
    }

    if (!nft) {
      navigate('/inventory')
    }

    if (nft && !isDataLoaded && !nftKey) {
      loadVersion()
    }
  }, [nft, navigate, isDataLoaded, nftKey, rpc])

  const [shareDialogState, setShareDialogState] = useState({
    chainId: '',
    tokenAddress: '',
    tokenId: '',
    version: '',
    opened: false,
  })

  const { decrypt } = useLitProtocol()

  // init
  useEffect(() => {
    const init = () => {
      const key = formatDataKey(nft.chain_id, nft.token_address, nft.token_id)
      setNftKey(key)
    }

    if (nft && !nftKey) {
      init()
    }
  }, [nft, nftKey])

  const goToChatroom = () => {
    if (!nftKey) return
    navigate(`/room/${nftKey}`)
  }

  const goToKnowledge = async () => {
    if (!nft?.lit_protocol) return
    const { encrypted_string, encrypted_symmetric_key, access_control_conditions } = nft.lit_protocol
    const accessControlConditions = convertSnakeToCamelCase(access_control_conditions) as AccessControlConditions

    const decrypted = await decrypt({
      accessControlConditions,
      encryptedString: encrypted_string,
      encryptedSymmetricKey: encrypted_symmetric_key,
    })
    if (decrypted) {
      setModalState({ viewKnowledge: { isOpen: true, url: decrypted } })
    }
  }

  return (
    <>
      {nft && (
        <div className="flex justify-center">
          <div className="block w-3/4">
            <div className="bg-[#181818] rounded p-4">
              <div className="flex">
                <div className="flex-auto w-1/4">
                  <img src={nft.metadata.image} className="rounded-lg bg-white w-full h-full" />
                </div>
                <div className="flex-auto w-3/4 px-5">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">{nft.metadata.name}</span>
                  </div>
                  <div>
                    <div className="flex justify-between text-gray-400 text-sm my-2">
                      <div className="">
                        Address: {nft.address} <span className="mx-3">&#8226;</span> #{nft.token_id}
                        <span className="mx-3">&#8226;</span> <ChainName chainId="56" />
                      </div>
                    </div>
                    <p className="">{nft.metadata.description}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 bg-[#181818] rounded p-4">
              <div className="text-2xl font-semibold mb-4">Tools</div>
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-4">
                <button
                  className="bg-red-900 rounded-lg px-4 py-2 text-white w-full flex items-center justify-center cursor-pointer hover:border hover:border-white"
                  onClick={() => goToChatroom()}
                >
                  <div className="block text-left">
                    <ChatIcon />
                    <div className="text-sm mt-1">Chat</div>
                  </div>
                </button>
                <button
                  className="bg-red-900 rounded-lg px-4 py-2 text-white w-full flex items-center justify-center text-center cursor-pointer hover:border hover:border-white"
                  onClick={() => goToKnowledge()}
                >
                  <div>
                    <DatabaseIcon />
                    <div className="text-sm mt-1">Knowledge</div>
                  </div>
                </button>
              </div>
            </div>

            <ViewKnowledgeModal />

            {shareDialogState.opened && (
              <ShareDialog
                chainId={shareDialogState.chainId}
                tokenAddress={shareDialogState.tokenAddress}
                tokenId={shareDialogState.tokenId}
                version={shareDialogState.version}
                onHandleCloseClicked={() =>
                  setShareDialogState({
                    chainId: '',
                    tokenAddress: '',
                    tokenId: '',
                    version: '',
                    opened: false,
                  })
                }
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default PageNft
