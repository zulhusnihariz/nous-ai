import { ExclamationIcon } from 'components/Icons/icons'
import TypographyNormal from 'components/Typography/Normal'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const quickLinks = [
  'What is Nous Psyche?',
  'Who is Mesolitica?',
  'What is Nous Psyche bot?',
  'Tell me about Nous Psyche NFT',
  'Share me your roadmap?',
  'What is your mission?',
  'Benefits of holding Nous Psyche',
  'How to mint',
  'How you plan to make chatbot free forever?',
]

const PageIndex = () => {
  const navigate = useNavigate()

  const [inputValue, setInputValue] = useState<string>('')

  const handleKeyUp = (e: { key: string }) => {
    if (e.key === 'Enter') {
      goToSearch(inputValue)
    }
  }

  const goToSearch = (text: string) => {
    navigate(`/search`, { state: { initialQ: text } })
  }

  return (
    <div className="h-full w-4/5 mx-auto flex flex-col justify-center items-center">
      <section className="">
        <h3 className=" w-full p-5 text-center font-semibold text-4xl">
          <TypographyNormal>
            Welcome to <span className="text-yellow-500">Nous Psyche</span>
          </TypographyNormal>
        </h3>
      </section>
      <div className="w-full h-[600px]">
        {/* Search Section */}
        <section className="flex flex-col justify-center items-center h-1/4">
          <div className="w-full flex justify-center items-center">
            <input
              type="text"
              placeholder="Ask anything..."
              className="border border-gray-300 bg-[#181818] placeholder:text-gray-300 placeholder:italic w-3/4 md:w-1/2 rounded-md p-2 outline-none focus:outline-white focus:border-none"
              onKeyUp={handleKeyUp}
              onChange={e => setInputValue(e.target.value)}
            />
          </div>
        </section>
        {/* FAQ Section */}
        <section className=" flex flex-col items-center justify-center">
          <p className="flex gap-2 justify-center p-1 w-3/4 font-medium">
            <ExclamationIcon />
            <TypographyNormal>Don't know what to ask? Try asking this:</TypographyNormal>
          </p>

          <div className={`grid grid-cols-2  sm:flex sm:gap-2 sm:flex-wrap px-7 md:p-3 justify-center `}>
            {quickLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => {
                  goToSearch(link)
                }}
                className={`bg-black text-sm hover:bg-black/50 hover:text-white text-gray-200 rounded-md p-2 ${
                  quickLinks.length % 2 !== 0 && ' last:col-span-2'
                }`}
              >
                {link}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default PageIndex
