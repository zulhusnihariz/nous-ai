import { useRef, useEffect, useState } from 'react'
import { SubmitChat } from './Icons/icons'

interface ChatSubmitProp {
  onSendChat: (message: string) => void
}

const ChatSubmit = (prop: ChatSubmitProp) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const [message, setMessage] = useState('')

  const handleResize = () => {
    const textArea = textAreaRef.current
    if (textArea) {
      textArea.style.height = 'auto'
      textArea.style.height = textArea.scrollHeight + 'px'
    }
  }

  useEffect(() => {
    handleResize()
  }, [])

  const onSubmit = () => {
    prop.onSendChat(message)
    setMessage('')
    const textArea = textAreaRef.current
    if (textArea) {
      textArea.style.height = 'auto'
    }
  }

  return (
    <div className="relative sm:w-full md:w-1/2 mx-auto">
      <textarea
        id="message"
        ref={textAreaRef}
        value={message}
        onChange={e => {
          setMessage(e.target.value)
          handleResize()
        }}
        placeholder="Type a message"
        className="w-full p-3 text-black rounded-md border-gray-200 py-2.5 pe-10 shadow-sm sm:text-sm"
        rows={1}
      />
      <span className="absolute inset-y-0 end-0 grid w-20 place-content-center">
        <button
          type="button"
          className="rounded-full border border-indigo-600 bg-indigo-600 p-3 text-white hover:bg-indigo-300 hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
          onClick={onSubmit}
        >
          <SubmitChat />
        </button>
      </span>
    </div>
  )
}

export default ChatSubmit
