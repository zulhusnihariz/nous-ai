import { useGetLatestCryptoNews } from 'repositories/newsdata.repository'
import { StackIcon } from '../Icons/icons'
import { News } from 'lib'

interface Prop {
  onClick: (feed: News) => void
}

const Newsfeed = (prop: Prop) => {
  const { data: feeds } = useGetLatestCryptoNews()
  return (
    <div>
      <div className="">
        <h3 className="font-semibold text-xl items-center flex gap-2 rounded-md pb-3">
          <StackIcon />
          Latest News
        </h3>
        <div className="text-md pb-4">
          <div className="flex flex-col gap-4">
            {feeds &&
              feeds.map((feed, index) => (
                <div
                  key={index}
                  className="text-md  hover:text-yellow-400 text-gray-500 cursor-pointer"
                  onClick={() => {
                    prop.onClick(feed)
                  }}
                >
                  {feed.title}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Newsfeed
