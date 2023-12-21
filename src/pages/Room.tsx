import ChatBubble from 'components/ChatBubble'
import ChatSubmit from 'components/ChatSubmit'
import { Chat } from 'lib'
import { useEffect, useRef, useState } from 'react'
import { chatWithNous } from 'services/nous'
import { useGetLineageNftToken, useGetLineageNousMetadata, useGetSingleNousMetadata } from 'repositories/rpc.repository'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { v4 } from 'uuid'
import useCheckAccess from 'hooks/useCheckRoomAccess'
import { useConnectedWallet } from 'hooks/use-connected-wallet'
import GenericMiniButton from 'components/Button/GenericMiniButton'
import { BoostIcon, UnboostIcon, UnlockIcon } from 'components/Icons/misc'
import ExchangeBuyDialog from 'components/Exchange/BuyDialog'
import { useBoundStore } from 'store'
import ExchangeSellDialog from 'components/Exchange/SellDialog'
import useAllowedList from 'components/Exchange/hooks/useAllowedList'
import useContractPaused from 'components/Exchange/hooks/usePaused'
import ExchangeNotAllowed from 'components/Exchange/NotAllowed'
import useUserKeyBalance from 'components/Exchange/hooks/useGetUserBalance'

const PageRoom = () => {
  const { key } = useParams()
  const navigate = useNavigate()
  const { address } = useConnectedWallet()

  useEffect(() => {}, [])
  const [chats, setChats] = useState<Chat[]>([])
  const [disableChat, setDisableChat] = useState(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const [name, setName] = useState('')
  const [bgColor, setBgColor] = useState('')
  const { data: nft } = useGetSingleNousMetadata(key as string)
  const { keyCount } = useUserKeyBalance(nft?.token.id as string, address.full)

  const { data: metadata } = useGetLineageNftToken(key as string)
  const { hasAccess } = useCheckAccess({
    dataKey: key as string,
    tokenId: metadata?.token ? metadata.token.id : '',
    walletAddress: address.full,
  })

  const { data: nous_id } = useGetLineageNousMetadata(
    key as string,
    'nous_id',
    import.meta.env.VITE_NOUS_DATA_PK as string,
    ''
  )

  const { data } = useGetLineageNousMetadata(key as string, 'builder', nft?.owner as string, '')
  const builder = data?.content

  const onSendChat = async (message: string) => {
    setDisableChat(true)

    if (message.length <= 0) {
      return
    }

    const newChat = {
      avatar: '',
      text: message,
      name: 'Me',
      bgColor,
    }

    setChats(prevChats => [...prevChats, newChat])

    const prompt =
      chats.length > 0
        ? `Based on the given context: ${chats[chats.length - 1].text}, send back a message from this message;`.concat(
            message
          )
        : message

    try {
      if (builder?.instructions) {
        const instructions = `Act based on this instruction for your next response: ${builder.instructions}`
        await chatWithNous(nous_id?.content as string, name, instructions)
      }

      const res = await chatWithNous(nous_id?.content as string, name, prompt)
      if (res.data.length <= 0) {
        return
      }

      let allText = ''

      for (const d of res.data) {
        if (res.data[0].recipient_id === name) {
          allText += `${d.text} <br />`
        }
      }

      const resChat = {
        avatar: nft?.metadata.image as String,
        text: allText,
        name: nft?.metadata.attributes.find((e: { trait_type: string }) => e.trait_type === 'name')?.value as String,
        className: '',
      }

      setChats(prevChats => [...prevChats, resChat])
      setDisableChat(false)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    if (!name) setName(v4())

    // if (!hasAccess) {
    //   navigate('/')
    // }
  }, [hasAccess, name, navigate])

  useEffect(() => {
    const getRandomColor = () => {
      const letters = '0123456789ABCDEF'
      let color = '#'
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
      }
      setBgColor(color)
    }

    if (!bgColor) {
      getRandomColor()
    }
  }, [bgColor])

  const { setModalState, modal } = useBoundStore()

  const { isAllowed } = useAllowedList({ address: address?.full })
  const { isPaused, isLoaded } = useContractPaused()

  const onClickBoost = () => {
    setModalState({
      subscribe: { isOpen: true, tokenId: nft?.token.id as string, amount: 0 },
    })
  }

  const onClickUnboost = () => {
    setModalState({
      unsubscribe: { isOpen: true, tokenId: nft?.token.id as string, amount: 0 },
    })
  }

  const onClickRegister = () => {
    setModalState({
      notAllowed: { isOpen: true },
    })
  }

  return (
    <>
      <div className="w-full flex justify-between">
        <div>&nbsp;</div>
        <div>
          {!isAllowed && !isPaused && (
            <GenericMiniButton name="Unlock Boost" icon={<UnlockIcon />} onClick={() => onClickRegister()} />
          )}
          {isAllowed && !isPaused && (
            <>
              <GenericMiniButton className="ml-4" name="Boost" icon={<BoostIcon />} onClick={() => onClickBoost()} />
              {keyCount > 1 && (
                <GenericMiniButton
                  className="ml-4"
                  name="Unboost"
                  icon={<UnboostIcon />}
                  onClick={() => onClickUnboost()}
                />
              )}
            </>
          )}
        </div>
      </div>
      <div className="min-h-screen z-0 pb-72 font-arial ">
        <div className="relative h-screen z-10 pb-[230px]">
          <div className="flex flex-col w-full h-screen">
            <div className="flex-1 p-2">
              {chats.length <= 0 ? (
                <div className="flex flex-col items-center mt-5 text-sm ">
                  {nft?.metadata?.image && (
                    <img
                      className="w-14 h-14 lg:w-20 lg:h-20 rounded-full border-50 object-contain ring-1 ring-white"
                      src={nft?.metadata?.image}
                      alt=""
                    />
                  )}
                  <p className="text-lg lg:text-2xl font-extrabold mt-4">
                    {builder?.name ? builder?.name : nft?.metadata?.name ?? ''}
                  </p>
                  <p className="text-sm lg:text-lg mt-2 mb-4">{builder?.description}</p>
                </div>
              ) : (
                <>
                  {chats.map((chat, index) => {
                    return (
                      <ChatBubble
                        name={chat.name}
                        key={index}
                        img={chat.avatar}
                        text={chat.text}
                        className={chat.className as string}
                        bgColor={chat.bgColor as string}
                      />
                    )
                  })}
                  <div ref={bottomRef}></div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`bottom-0 left-1/2 -translate-x-1/2 w-4/5 lg:w-3/4 z-10 ${
          modal.notAllowed.isOpen || modal.subscribe.isOpen || modal.unsubscribe.isOpen ? 'relative' : 'fixed'
        }`}
      >
        {chats.length <= 0 && (
          <div className="w-full text-sm lg:w-3/4 mx-auto font-arial">
            <div className="grid grid-cols-2 gap-2 text-center">
              {builder?.conversationStarters.length > 0 &&
                builder.conversationStarters[0] !== '' &&
                builder.conversationStarters
                  .filter((el: string) => el !== '')
                  .map((el: string, idx: number) => {
                    return (
                      <div
                        className={`text-gray-400 border border-gray-600 w-full py-3 cursor-pointer odd:last:col-span-2  odd:last:justify-self-center`}
                        onClick={() => onSendChat(el)}
                        key={idx}
                      >
                        {el}
                      </div>
                    )
                  })}
            </div>
          </div>
        )}
        <div className="">
          <ChatSubmit onSendChat={msg => onSendChat(msg)} disable={disableChat} className="font-arial" />
        </div>

        <ExchangeBuyDialog />
        <ExchangeSellDialog />
        <ExchangeNotAllowed />
      </div>
    </>
  )
}

export default PageRoom
