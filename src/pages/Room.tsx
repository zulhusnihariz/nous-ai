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
        className: 'bg-[#1C1C1C] rounded-md border-[1px] border-[#333335]',
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

  return (
    <>
      <div className="min-h-screen z-0 pb-72">
        <div className="relative h-screen z-10 pb-[230px]">
          <button className="mt-4 mx-2 py-2 px-4 bg-gray-600 border-white border-[1px] text-sm">
            <Link to="/inventory">Back to NFT</Link>
          </button>
          <div className="flex flex-col w-full h-screen">
            <div className="flex-1 p-2">
              {chats.length <= 0 ? (
                <div className="flex flex-col items-center mt-5 text-sm ">
                  {nft?.metadata?.image && (
                    <img
                      className="w-14 h-14 lg:w-24 lg:h-24 rounded-full border-50 object-contain"
                      src={nft?.metadata?.image}
                      alt=""
                    />
                  )}
                  <p className="text-lg lg:text-2xl font-extrabold mt-4">
                    {builder?.name ? builder?.name : nft?.metadata?.name ?? ''}
                  </p>
                  <p className="text-sm lg:text-lg mt-2 mb-4">{builder?.description}</p>

                  <div className="grid lg:grid-cols-2 gap-2 grid-flow-row">
                    {builder?.conversationStarters.length > 0 &&
                      builder.conversationStarters[0] !== '' &&
                      builder.conversationStarters
                        .filter((el: string) => el !== '')
                        .map((el: string, idx: number) => {
                          return (
                            <div
                              className={`bg-red-500 w-full max-w-[300px] p-4 py-2 cursor-pointer rounded-md  odd:last:col-span-2  odd:last:justify-self-center`}
                              onClick={() => onSendChat(el)}
                              key={idx}
                            >
                              {el}
                            </div>
                          )
                        })}
                  </div>
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
      <div className="fixed bottom-0 left-0 w-full z-10">
        <div className="py-6">
          <ChatSubmit boxWidth="small" onSendChat={msg => onSendChat(msg)} disable={disableChat} />
        </div>
      </div>
    </>
  )
}

export default PageRoom
