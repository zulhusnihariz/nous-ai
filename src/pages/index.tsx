import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PageIndex = () => {
  const navigate = useNavigate()


  const [inputValue, setInputValue] = useState<string>('')

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('Enter key pressed. Input value:', inputValue)
      navigate('/search')
    }
  }

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <section className="">
        <h3 className=" w-full p-5 text-center font-extrabold text-2xl">
          Welcome to <span className="text-red-700">Nous Psyche</span>
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

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            
            Don't know what to ask? Try asking this:
          </p>

          <div className="flex gap-2 flex-wrap px-7 md:p-3">
            <button
              onClick={() => {
                console.log('yes')
                navigate('/search')
              }}
              className=" text-sm hover:bg-[#181818] hover:text-white text-gray-400 rounded-md p-2"
            >
              What is Nous
            </button>
            <button
              onClick={() => {
                console.log('yes')
                navigate('/search')
              }}
              className=" text-sm hover:bg-[#181818] hover:text-white text-gray-400 rounded-md p-2"
            >
              Center a div
            </button>
            <button
              onClick={() => {
                console.log('yes')
                navigate('/search')
              }}
              className=" text-sm hover:bg-[#181818] hover:text-white text-gray-400 rounded-md p-2"
            >
              Nft Chatbot Concept
            </button>
            <button
              onClick={() => {
                console.log('yes')
                navigate('/search')
              }}
              className=" text-sm hover:bg-[#181818] hover:text-white text-gray-400 rounded-md p-2"
            >
              Nous Job
            </button>
          </div>
        </section>
      </div>
      
    </div>
  )
}

export default PageIndex
