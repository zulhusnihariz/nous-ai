import { useRef, useEffect, useState } from 'react'
import { SubmitChat } from './Icons/icons'

interface ChatSubmitProp {
  onSendChat: (message: string) => void
  disable: boolean
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
    <div className="relative bg-[#313138] py-6">
      <div className="relative sm:w-full md:w-3/4 lg:w-1/2 mx-auto px-4 flex items-center">
        <textarea
          id="message"
          ref={textAreaRef}
          value={message}
          onChange={e => {
            setMessage(e.target.value)
            handleResize()
          }}
          placeholder={prop.disable ? 'Processing...' : 'Type a message'}
          className="w-full py-3 px-3 text-black rounded-md border-gray-200  shadow-sm text-xs sm:text-sm bg-white"
          rows={2}
          disabled={prop.disable}
        />
        <span className="absolute inset-y-0 end-0 grid w-20 place-content-center">
          <button
            type="button"
            className="rounded-full border border-indigo-600 bg-indigo-600 p-3 text-white hover:bg-indigo-300 hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
            onClick={onSubmit}
            disabled={prop.disable}
          >
            <SubmitChat />
          </button>
        </span>
      </div>
    </div>
  )
}

export default ChatSubmit
