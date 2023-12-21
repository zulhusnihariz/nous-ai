import { useRef, useEffect, useState } from 'react'
import { SubmitChat } from './Icons/icons'
import GenericButton from './Button/GenericButton'

interface ChatSubmitProp {
  onSendChat: (message: string) => void
  disable: boolean
  className?: string
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

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        setMessage(prevMessage => prevMessage + '\n')
      } else {
        onSubmit()
      }
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
    <div className="relative pb-6 md:pt-6">
      <div className={`relative sm:w-full md:w-3/4 mx-auto px-4 w-full ${prop.className}`}>
        <div className="bg-blue-800 text-white p-1 text-xs border-blue-600 border invisible md:visible">
          Press ENTER to submit
        </div>
        <textarea
          id="message"
          ref={textAreaRef}
          value={message}
          onChange={e => {
            setMessage(e.target.value)
            handleResize()
          }}
          onKeyUp={handleKeyUp}
          placeholder={prop.disable ? 'Processing...' : 'Type a message'}
          className="w-full py-3 px-3 text-white border-blue-500 border  shadow-sm text-xs sm:text-sm bg-blue-800 focus:outline-none focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
          rows={1}
          disabled={prop.disable}
        />
        <span className="absolute -bottom-4 inset-y-0 end-0 grid w-20 place-content-center visible md:invisible">
          <button
            type="button"
            className="rounded-full border ring-1 ring-white border-black bg-indigo-400 p-2 text-black hover:bg-indigo-300 hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
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
