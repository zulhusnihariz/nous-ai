import ChatBubble from 'components/ChatBubble'
import ChatSubmit from 'components/ChatSubmit'
import { Chat } from 'lib'
import { useRef, useState } from 'react'
import { chatWithNous } from 'services/nous'
import top from 'assets/img/top.svg'
import avatar from 'assets/img/avatar.jpeg'

const PageRoom = () => {
  const [chats, setChats] = useState<Chat[]>([])
  const [disableChat, setDisableChat] = useState(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const onSendChat = async (message: string) => {
    setDisableChat(true)

    if (message.length <= 0) {
      return
    }

    const newChat = {
      avatar: '',
      text: message,
      name: '0x3zero',
    }

    setChats(prevChats => [...prevChats, newChat])
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }

    try {
      const res = await chatWithNous(import.meta.env.VITE_NOUS_ID as string, '0x3zero', message)
      if (res.data.length <= 0) {
        return
      }

      let allText = ''

      for (const d of res.data) {
        if (res.data[0].recipient_id === '0x3zero') {
          allText += `${d.text} <br /><br />`
        }
      }


      const resChat = {
        avatar:
          'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80',
        text: allText,
        name: 'Arjuna',
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
    <div className="flex justify-center h-screen">
      <div className="flex flex-col w-full h-screen bg-[#212129]">
        <div>
        {/*   <header className="bg-white/10">
            <div className="px-4 py-2">
              <div className="">
                <div className="flex justify-between">
                  <div className="relative flex items-center"></div>
                </div>
              </div>
            </div>
          </header> */}
          <header>
            <div className='relative flex justify-center pb-6 md:pb-0'>
                <div className='relative md:-translate-y-8 z-10 overflow-hidden'>
                  <img className="scale-125 border-b-4 md:border-b-0 md:scale-90" src={top} />
                </div>
                <div className="absolute z-30 w-14 h-14 md:w-20 md:h-20 top-4 flex justify-center gap-x-4">             
                  <img className="rounded-full border-[1px]" src={avatar} />
                </div>
            </div>
          </header>
        </div>
        <div className="flex-1 overflow-y-auto p-2 text-satoshi">
          {chats.map((chat, index) => {
            return <ChatBubble name={chat.name} key={index} img={chat.avatar} text={chat.text} className={chat.className} />
          })}
          <div ref={bottomRef}></div>
        </div>
        <div className="relative">
          <div className="">
            <label htmlFor="Search" className="sr-only">
              {' '}
              Search{' '}
            </label>

            <ChatSubmit onSendChat={msg => onSendChat(msg)} disable={disableChat} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageRoom
