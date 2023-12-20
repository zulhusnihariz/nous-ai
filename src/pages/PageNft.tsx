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
import { useGetLineageNousMetadata, useGetOwnedNousMetadatas } from 'repositories/rpc.repository'
import useCheckAccess from 'hooks/useCheckRoomAccess'
import { useGetPerkByTokenId } from 'repositories/perk.repository'
import Avatar from 'components/Avatar'
import PerkCardNft from 'components/PerkCard/PerkCardNft'
import GenericButton from 'components/Button/GenericButton'
import TypographyNormal from 'components/Typography/Normal'
import useReferralCode from 'components/Exchange/hooks/useReferralCode'
import ExchangeAssignRefCodeButton from 'components/Exchange/AssignCodeButton'
import useClipboard from 'hooks/useClipboard'
import ReferralBox from 'components/Exchange/Referral'

const PageNft = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { rpc } = useApi()
  const { setModalState } = useBoundStore()
  const { address } = useConnectedWallet()
  const { setOwnedPerks } = useNousStore()
  const copyToClipboard = useClipboard()

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

  const { data } = useGetOwnedNousMetadatas(address.full)
  const owned = data?.pages?.flatMap(group => group.data)
  const { refCode } = useReferralCode()

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

  const goToQuest = () => {
    if (!nftKey) return
    navigate(`/quests`)
  }

  const goToBuilder = () => {
    if (!nftKey) return
    navigate(`/builder`)
  }

  const goToKnowledge = () => {
    const owned_nft = owned?.find(owned_nft => (owned_nft.token_id = nft.token_id))

    if (owned_nft) {
      const metadata = {
        ...owned_nft.metadata,
        name: owned_nft.metadata?.attributes?.find(attributes => attributes.trait_type === 'name')?.value ?? '',
      }

      setModalState({
        encryptKnowledge: {
          isOpen: true,
          token_id: `${nft.token_id}`,
          chain_id: import.meta.env.VITE_DEFAULT_CHAIN_ID,
          token_address: import.meta.env.VITE_NOUS_AI_NFT,
          version: '',
          knowledge: owned_nft?.knowledge ?? [],
        },
        nftMetadata: {
          isOpen: false,
          metadata: metadata,
        },
        nousMetadata: {
          isOpen: false,
          metadata: owned_nft?.nous ?? { id: '', version: '' },
        },
      })
    }
  }

  const handleCopyRefCode = async (text: string) => {
    await copyToClipboard(text)
  }

  return (
    <>
      {nft && (
        <div className="flex justify-center mb-10">
          <div className="block w-[90%] md:w-3/4">
            <div className="bg-blue-600/80 ring ring-white border border-blue-600 backdrop-blur p-4">
              <div className="flex">
                <div className="flex-auto w-1/4">
                  <Avatar imgMain={nft.metadata.image} imgBadge={badge?.content.src} badgeSize="12" />
                </div>
                <div className="flex-auto w-3/4 px-5">
                  <div className="">
                    <div className="text-lg md:text-2xl font-bold">{nft.metadata.name}</div>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                      {bot_level && bot_level.content?.level >= 0 && (
                        <div className="bg-yellow-300 text-black ring-1 ring-yellow-600 p-2">
                          <div className="text-xs text-yellow-800 uppercase">Level</div>
                          <div className="uppercase font-semibold">Level {bot_level.content?.level}</div>
                        </div>
                      )}
                      {!bot_level && (
                        <div className="bg-yellow-300 text-black ring-1 ring-yellow-600 p-2">
                          <div className="text-xs text-yellow-800 uppercase">Level</div>
                          <div className="uppercase font-semibold text-xs">Not Activated</div>
                        </div>
                      )}
                      {nous_id && nous_id?.content && (
                        <div className="bg-slate-700 text-black ring-1 ring-black p-2">
                          <div className="text-xs text-slate-400 uppercase">Bot</div>
                          <div className="text-gray-300 flex items-center gap-2 uppercase font-semibold">
                            <VerifiedNousIcon /> Nous Activated
                          </div>
                        </div>
                      )}
                      {nouskb && (
                        <div className="bg-slate-700 text-black ring-1 ring-black p-2">
                          <div className="text-xs text-slate-400 uppercase">Knowledge Size</div>
                          <div className="text-gray-300 uppercase font-semibold">{nouskb.content.size_in_mb} MB</div>
                        </div>
                      )}
                      {access && (
                        <div className="bg-slate-700 text-black ring-1 ring-black p-2">
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
            <div className="mt-5 p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ring ring-white/90 from-green-500 to-green-600">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-md tracking-wider font-semibold mb-2">
                    <TypographyNormal classNames="uppercase text-yellow-400">Referral Code</TypographyNormal>
                  </div>
                  {refCode && (
                    <span onClick={() => handleCopyRefCode(refCode)}>
                      <TypographyNormal classNames="text-sm text-white cursor-pointer">{refCode}</TypographyNormal>
                    </span>
                  )}
                </div>
                {!refCode && <ExchangeAssignRefCodeButton />}
                <GenericButton
                  className="ml-4"
                  name="Referral"
                  onClick={() => setModalState({ referral: { isOpen: true } })}
                />
              </div>
            </div>

            <div className="mt-5 bg-blue-600/80 ring ring-white border border-blue-600 backdrop-blur p-4">
              <div className="text-lg md:text-2xl font-semibold mb-4">Tools</div>
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-4">
                {nous_id && <GenericButton name="Chat" onClick={goToChatroom} />}

                <GenericButton name="Shop Perk" onClick={goToPerk} />
                <GenericButton name="Quests" onClick={goToQuest} />

                {bot_level && bot_level.content?.level > 0 && (
                  <GenericButton name="Knowledge" onClick={() => goToKnowledge()} />
                )}

                <GenericButton name="Builder" onClick={() => goToBuilder()} />
              </div>
            </div>

            <div className="mt-5 bg-[#181818] rounded pt-4 pb-8 px-4">
              <div className="text-lg md:text-2xl font-semibold mb-4">Purchased Perks</div>
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
      <ReferralBox />
    </>
  )
}

export default PageNft
