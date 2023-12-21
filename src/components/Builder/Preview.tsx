import ChatSubmit from 'components/ChatSubmit'
import { Chat, Nft } from 'lib'
import { useRef, useState } from 'react'
import { useGetLineageNousMetadata } from 'repositories/rpc.repository'
import { chatWithNous } from 'services/nous'

const ChatBubble = (prop: { text: String; className: string; img: String; bgColor: string; name: String }) => {
  const textWithBreaks = prop.text.replace(/\n/g, '<br />')

  return (
    <>
      <div className={`z-99 flex p-2 my-2 ${prop.className} `}>
        {prop.img.length > 0 && (
          <img
            alt="avatar"
            src={prop.img as string}
            className="h-8 w-8 md:h-10 md:w-10 rounded-md object-cover border-[1px] border-[#333335]"
          />
        )}
        {prop.img.length <= 0 && (
          <span className="h-8 w-8 md:h-10 md:w-10 rounded-md" style={{ backgroundColor: prop.bgColor }}></span>
        )}
        <div className="text-left ml-4 mr-2 text-sm">
          <h5 className=" capitalize font-bold text-sm md:pb-1">{prop.name}</h5>
          <div dangerouslySetInnerHTML={{ __html: textWithBreaks }}></div>
        </div>
      </div>
    </>
  )
}

const BuilderPreview = (prop: { nft: Nft }) => {
  const [bgColor, setBgColor] = useState('')
  const [name, setName] = useState('Me')

  const [chats, setChats] = useState<Chat[]>([])

  const bottomRef = useRef<HTMLDivElement | null>(null)
  const [disableChat, setDisableChat] = useState(false)
  const builder = prop.nft.builder!

  const { data: nous_id } = useGetLineageNousMetadata(
    prop.nft?.dataKey,
    'nous_id',
    import.meta.env.VITE_NOUS_DATA_PK as string,
    ''
  )

  const onSendChat = async (message: string) => {
    setDisableChat(true)

    if (message.length <= 0) {
      return
    }

    const newChat = {
      avatar: '',
      text: message,
      name,
      bgColor,
      className: 'lg:mx-0 w-full',
    }

    setChats(prevChats => [...prevChats, newChat])

    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

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
        avatar: prop.nft?.metadata.image as String,
        text: allText,
        name: prop.nft?.metadata.attributes.find((e: { trait_type: string }) => e.trait_type === 'name')
          ?.value as String,
        className: 'bg-[#1C1C1C] rounded-md border-[1px] border-[#333335]',
      }

      setChats(prevChats => [...prevChats, resChat])
      setDisableChat(false)
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <div className="m-4 p-4 w-full text-center transform ring ring-white bg-blue-600/80 backdrop-blur text-white h-full lg:h-[600px]">
        <h1 className="font-extrabold text-xl">PREVIEW</h1>

        <div className="row-span-8 h-[400px] overflow-y-auto">
          {chats.length <= 0 ? (
            <div className="flex flex-col items-center mt-5 text-sm ">
              {prop.nft?.metadata?.image && (
                <img
                  className="w-14 h-14 lg:w-24 lg:h-24 rounded-full border-50 object-contain"
                  src={prop.nft?.metadata?.image}
                  alt=""
                />
              )}
              <p className="text-lg lg:text-2xl font-extrabold">
                {builder?.name ? builder?.name : prop.nft?.metadata?.name ?? ''}
              </p>
              <p className="text-sm lg:text-lg mt-2 mb-4">{builder.description}</p>

              <div className="grid lg:grid-cols-2 gap-2 grid-flow-row">
                {builder.conversationStarters.length > 0 &&
                  builder.conversationStarters[0] !== '' &&
                  builder.conversationStarters
                    .filter(el => el !== '')
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

        <div className="w-full row-span-2">
          <ChatSubmit onSendChat={msg => onSendChat(msg)} disable={false} />
        </div>
      </div>
    </>
  )
}

export default BuilderPreview
