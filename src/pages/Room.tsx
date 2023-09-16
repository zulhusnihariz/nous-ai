import ChatBubble from 'components/ChatBubble'
import ChatSubmit from 'components/ChatSubmit'
import { SubmitChat } from 'components/Icons/icons'
import { Chat } from 'lib'
import { useEffect, useRef, useState } from 'react'

const sample = [
  {
    avatar:
      'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80',
    text: 'hello',
    name: 'Arjuna',
  },
  {
    avatar:
      'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80',
    text: 'ayam goreng',
    name: 'Arjuna',
  },
]

const PageRoom = () => {
  const [chats, setChats] = useState<Chat[]>(sample)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const onSendChat = (message: string) => {
    if (message.length <= 0) {
      return
    }

    const newChat = {
      avatar:
        'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80',
      text: message,
      name: '0x3zero',
    }

    setChats([...chats, newChat])
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="flex justify-center h-screen">
      <div className="flex flex-col w-full h-screen bg-white/10">
        <div>
          <header className="bg-white/10">
            <div className="px-4 py-2">
              <div className="">
                <div className="flex justify-between">
                  <div className="relative flex items-center"></div>
                </div>
              </div>
            </div>
          </header>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {chats.map((chat, index) => {
            return <ChatBubble name={chat.name} key={index} img={chat.avatar} text={chat.text} />
          })}
          <div ref={bottomRef}></div>
        </div>
        <div className="relative p-2">
          <div className="">
            <label htmlFor="Search" className="sr-only">
              {' '}
              Search{' '}
            </label>

            <ChatSubmit onSendChat={msg => onSendChat(msg)} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageRoom
