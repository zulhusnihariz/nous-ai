import ChatBubble from 'components/ChatBubble'
import ChatSubmit from 'components/ChatSubmit'
import { Chat } from 'lib'
import { useEffect, useRef, useState } from 'react'
import { chatWithNous } from 'services/nous'
import { useGetSingleNousMetadata } from 'repositories/rpc.repository'
import { useParams } from 'react-router-dom'
import { v4 } from 'uuid'

const EmbedRoom = () => {
  const { key } = useParams()
  const [chats, setChats] = useState<Chat[]>([])
  const [disableChat, setDisableChat] = useState(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const [name, setName] = useState('')
  const [bgColor, setBgColor] = useState('')

  const { data: nft } = useGetSingleNousMetadata(key as string)

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

    if (nft) {
      onSendChat('What knowledge do you have?')
    }
  }, [bgColor])

  const onSendChat = async (message: string) => {
    setDisableChat(true)

    if (message.length <= 0) {
      return
    }

    const newChat = {
      avatar: '',
      text: message,
      name: 'Me',
      className: '',
      bgColor,
    }

    setChats(prevChats => [...prevChats, newChat])
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }

    try {
      const res = await chatWithNous(nft?.nous.id as string, name, message)
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
        isBot: true,
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

  useEffect(() => {
    if (!name) setName(v4())
  }, [])

  return (
    <div className="flex justify-center h-screen">
      <div className="flex flex-col w-full h-screen bg-[#212129]">
        <div className="w-full bg-purple-300 p-2 flex text-black items-center gap-3">
          {/* <img className="rounded-full border-[1px] border-black w-14 h-14" src={nft?.metadata.image} /> */}
          <div className="font-semibold cursor-pointer">Find us on Nous Psyche</div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 text-satoshi">
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
        </div>
        <div className="relative">
          <div className="">
            <label htmlFor="Search" className="sr-only">
              Search
            </label>

            <ChatSubmit onSendChat={msg => onSendChat(msg)} disable={disableChat} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmbedRoom
