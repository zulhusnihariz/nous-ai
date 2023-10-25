import { useNavigate } from 'react-router-dom'
import { SubmitChat } from 'components/Icons/icons'

const PageSearch = () => {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col justify-center bg-[#212129] overflow-auto">
      <main className="w-full h-screen">
        <div className="flex justify-start p-1">
          {/* Button Back */}
          <button
            onClick={() => {
              navigate('/')
            }}
          >
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
                d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <h3 className="text-xl font-bold p-4">What is Nous Psyche</h3>
        </div>

        {/* Sources Section */}
        <section className="p-6">
          <div className="font-bold p-2 flex gap-1">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                />
              </svg>
            </span>
            Sources
          </div>
          <div className="grid grid-cols-3 md:grid-cols-5 py-2 md:w-3/4 gap-3">
            <div className="border p-2 rounded-sm text-sm bg-[#393947] hover:bg-[#212129]">
              <a
                href="https://heroicons.com/"
                target="_blank"
                rel="noopener noreferrer"
                className=" flex flex-col justify-between items-start gap-5"
              >
                <p className="font-medium">HeroIcons</p>
                <button className="font-semibold">HeroIcons . 2</button>
              </a>
            </div>
            <div className="border p-2 rounded-sm text-sm bg-[#393947] hover:bg-[#212129]">
              <a
                href="https://heroicons.com/"
                target="_blank"
                rel="noopener noreferrer"
                className=" flex flex-col justify-between items-start gap-5"
              >
                <p className="font-medium">HeroIcons</p>
                <button className="font-semibold">HeroIcons . 3</button>
              </a>
            </div>
            <div className="border p-2 rounded-sm text-sm bg-[#393947] hover:bg-[#212129]">
              <a
                href="https://heroicons.com/"
                target="_blank"
                rel="noopener noreferrer"
                className=" flex flex-col justify-between items-start gap-5"
              >
                <p className="font-medium">HeroIcons</p>
                <button className="font-semibold">HeroIcons . 4</button>
              </a>
            </div>
            <div className="border p-2 rounded-sm text-sm bg-[#393947] hover:bg-[#212129]">
              <a
                href="https://heroicons.com/"
                target="_blank"
                rel="noopener noreferrer"
                className=" flex flex-col justify-between items-start gap-5"
              >
                <p className="font-medium">HeroIcons</p>
                <button className="font-semibold">HeroIcons . 5</button>
              </a>
            </div>
            <div className="border p-2 rounded-sm text-sm bg-[#393947] hover:bg-[#212129]">
              <a
                href="https://heroicons.com/"
                target="_blank"
                rel="noopener noreferrer"
                className=" flex flex-col justify-between items-start gap-5"
              >
                <p className="font-medium">HeroIcons</p>
                <button className="font-semibold">HeroIcons . 6</button>
              </a>
            </div>
          </div>
        </section>

        {/* Chat Section */}
        <section className=" pb-40">

          {/* Bot */}
          <div className="p-6 bg-[#393947]">
            <div className="font-bold p-2 flex gap-1 rounded-md ">
              <span>
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
                    d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                  />
                </svg>
              </span>
              Answers
            </div>
            <div className="px-6 text-md pb-4 ">
              I'm baby copper mug put a bird on it man braid YOLO, chartreuse umami keffiyeh cliche vape waistcoat
              truffaut enamel pin pork belly cronut occupy. Knausgaard literally whatever, cold-pressed pinterest
              affogato freegan organic mumblecore skateboard post-ironic celiac single-origin coffee wayfarers. Crucifix
              irony actually food truck fingerstache whatever retro 90's vegan migas palo santo. Photo booth chia
              polaroid try-hard mlkshk grailed food truck, ugh +1 franzen edison bulb farm-to-table. Wolf XOXO celiac,
              plaid jean shorts deep v shaman pok pok try-hard bushwick keffiyeh post-ironic. Dummy text? More like
              dummy thicc text, amirite?
            </div>
          </div>
          
          {/* Guest */}
          <div className="flex flex-col w-full p-6">
            <div className="flex items-center gap-2 p-2">
              <img
                alt="avatar"
                src="https://images.pexels.com/photos/1000366/pexels-photo-1000366.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                className="h-8 w-8 md:h-10 md:w-10 rounded-md object-cover border-[1px] border-[#333335]"
              />
              <h5 className="capitalize font-bold">Guest</h5>
            </div>
            <div className=" px-6 text-md pb-4">
              I'm baby copper mug put a bird on it man braid YOLO, chartreuse umami keffiyeh cliche vape waistcoat
              truffaut enamel pin pork belly cronut occupy. Knausgaard literally whatever, cold-pressed pinterest
              affogato freegan organic mumblecore skateboard post-ironic celiac single-origin coffee wayfarers. Crucifix
              irony actually food truck fingerstache whatever retro 90's vegan migas palo santo. Photo booth chia
              polaroid try-hard mlkshk grailed food truck, ugh +1 franzen edison bulb farm-to-table. Wolf XOXO celiac,
              plaid jean shorts deep v shaman pok pok try-hard bushwick keffiyeh post-ironic. Dummy text? More like
              dummy thicc text, amirite?
            </div>
          </div>
        </section>

        {/* Input Section */}
        <div className="absolute bottom-0 left-0 w-full">
          <div className="relative py-6">
            <div className="relative sm:w-full md:w-3/4 lg:w-1/2 mx-auto px-4 flex items-center">
              <label htmlFor="Input" className="sr-only">
               Input
              </label>
              <textarea
                id="message"
                className=" placeholder:text-base md:placeholder:text-sm opacity-75 w-full py-3 px-3 text-black rounded-md border-gray-200  shadow-sm text-xs sm:text-sm bg-white"
                placeholder="I'll clarify anything more that you confused about"
                rows={2}
              />
              <span className="absolute inset-y-0 end-0 grid w-20 place-content-center">
                <button
                  type="button"
                  className="rounded-full border border-indigo-600 bg-indigo-600 p-3 text-white hover:bg-indigo-300 hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
                >
                  <SubmitChat />
                </button>
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PageSearch
