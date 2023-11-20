import ShareDialog from 'components/ShareDialog'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { formatDataKey } from 'utils'
import { useApi } from 'hooks/use-api'
import { VerifiedNousIcon } from 'components/Icons/icons'
import ViewKnowledgeModal from 'components/Modal/ViewKnowledge'
import { useBoundStore, useNousStore } from 'store'
import ApiKeyModal from 'components/Modal/ApiKeyModal'
import { useConnectedWallet } from 'hooks/use-connected-wallet'
import EncryptKnowledgeModal from 'components/Modal/EncryptKnowledge'
import { useGetLineageNousMetadata } from 'repositories/rpc.repository'
import useCheckAccess from 'hooks/useCheckRoomAccess'
import { useGetPerkByTokenId } from 'repositories/perk.repository'
import Avatar from 'components/Avatar'
import PerkCardNft from 'components/PerkCard/PerkCardNft'
import GenericButton from 'components/Button/GenericButton'

const PageNft = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { rpc } = useApi()
  const { setModalState } = useBoundStore()
  const { address } = useConnectedWallet()
  const { setOwnedPerks } = useNousStore()

  const { nft } = location.state || {}

  const [nftKey, setNftKey] = useState('')
  // versions
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  const { data: perks } = useGetPerkByTokenId(nft.token.id as number)
  const { data: bot_level } = useGetLineageNousMetadata(
    nftKey,
    'bot_level',
    import.meta.env.VITE_NOUS_DATA_PK as string,
    ''
  )

  const { data: nous_id } = useGetLineageNousMetadata(
    nftKey,
    'nous_id',
    import.meta.env.VITE_NOUS_DATA_PK as string,
    ''
  )

  const { data: badge } = useGetLineageNousMetadata(nftKey, 'badge', import.meta.env.VITE_NOUS_DATA_PK as string, '')
  const { data: nouskb } = useGetLineageNousMetadata(nftKey, 'nous_kb', import.meta.env.VITE_NOUS_DATA_PK as string, '')
  const { data: access } = useGetLineageNousMetadata(nftKey, 'access', import.meta.env.VITE_NOUS_DATA_PK as string, '')

  const { hasAccess } = useCheckAccess({
    dataKey: nftKey,
    tokenId: nft?.token ? nft.token.id : '',
    walletAddress: address.full,
  })

  useEffect(() => {
    if (!nft || !nft.token) {
      navigate('/inventory')
    } else {
      setIsDataLoaded(true)
    }
  }, [nft, navigate, isDataLoaded, nftKey, rpc])

  const [shareDialogState, setShareDialogState] = useState({
    chainId: '',
    tokenAddress: '',
    tokenId: '',
    version: '',
    opened: false,
  })

  // init
  useEffect(() => {
    const init = () => {
      const key = formatDataKey(nft.chain_id, nft.token_address, nft.token_id)
      setNftKey(key)
    }

    if (nft && !nftKey) {
      init()
    }

    if (perks) {
      setOwnedPerks(perks)
    }
  }, [nft, nftKey, perks, setOwnedPerks])

  const goToChatroom = () => {
    if (!nftKey) return
    navigate(`/room/${nftKey}`)
  }

  const goToPerk = () => {
    if (!nftKey) return
    navigate(`/perks`)
  }

  const goToKnowledge = () => {
    setModalState({
      encryptKnowledge: {
        isOpen: true,
        token_id: `${nft.token_id}`,
        chain_id: import.meta.env.VITE_DEFAULT_CHAIN_ID,
        token_address: import.meta.env.VITE_NOUS_AI_NFT,
        version: '',
        knowledge: [],
      },
    })
  }

  return (
    <>
      {nft && (
        <div className="flex justify-center">
          <div className="block w-3/4">
            <div className="bg-[#181818] rounded p-4">
              <div className="flex">
                <div className="flex-auto w-1/4">
                  <Avatar imgMain={nft.metadata.image} imgBadge={badge?.content.src} badgeSize="12" />
                </div>
                <div className="flex-auto w-3/4 px-5">
                  <div className="">
                    <div className="text-2xl font-bold">{nft.metadata.name}</div>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {bot_level && bot_level.content?.level >= 0 && (
                        <div className="bg-yellow-300 text-black rounded-md p-2">
                          <div className="text-xs text-yellow-800 uppercase">Level</div>
                          <div className="uppercase font-semibold">Level {bot_level.content?.level}</div>
                        </div>
                      )}
                      {!bot_level && (
                        <div className="bg-yellow-300 text-black rounded-md p-2">
                          <div className="text-xs text-yellow-800 uppercase">Level</div>
                          <div className="uppercase font-semibold">Not Activated</div>
                        </div>
                      )}
                      {nous_id && nous_id?.content && (
                        <div className="bg-slate-700 text-black rounded-md p-2">
                          <div className="text-xs text-slate-400 uppercase">Bot</div>
                          <div className="text-gray-300 flex items-center gap-2 uppercase font-semibold">
                            <VerifiedNousIcon /> Nous Activated
                          </div>
                        </div>
                      )}
                      {nouskb && (
                        <div className="bg-slate-700 text-black rounded-md p-2">
                          <div className="text-xs text-slate-400 uppercase">Knowledge Size</div>
                          <div className="text-gray-300 uppercase font-semibold">{nouskb.content.size_in_mb} MB</div>
                        </div>
                      )}
                      {access && (
                        <div className="bg-slate-700 text-black rounded-md p-2">
                          <div className="text-xs text-slate-400 uppercase">Access</div>
                          <div className="text-gray-300 uppercase font-semibold">{access.content}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-gray-400 text-sm my-2"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 bg-[#181818] rounded p-4">
              <div className="text-2xl font-semibold mb-4">Tools</div>
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-4">
                {nous_id && <GenericButton name="Chat" onClick={goToChatroom} />}

                <GenericButton name="Shop Perk" onClick={goToPerk} />

                {bot_level && bot_level.content?.level > 0 && (
                  <GenericButton name="Knowledge" onClick={() => goToKnowledge()} />
                )}
              </div>
            </div>

            <div className="mt-5 bg-[#181818] rounded p-4">
              <div className="text-2xl font-semibold mb-4">Purchased Perks</div>
              <div className="grid gap-4 sm:grid-cols-4">
                {perks?.map((perk, index) => <PerkCardNft key={index} perk={perk} tokenId={nft.token_id} />)}
              </div>
              {perks && !perks.length && (
                <div className="text-center">
                  <div>You have not purchase any perks</div>
                  <GenericButton name="Shop Perk" onClick={goToPerk} className="mt-3" />
                </div>
              )}
            </div>

            <ViewKnowledgeModal />
            <ApiKeyModal />

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
      <EncryptKnowledgeModal />
    </>
  )
}

export default PageNft
