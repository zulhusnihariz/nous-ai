import { News } from 'lib'
import DOMPurify from 'dompurify'

interface Prop {
  readingNews?: News
}

const NewsBox = (prop: Prop) => {
  const sanitizedData = () => ({
    __html: DOMPurify.sanitize(prop.readingNews?.content as string),
  })

  return (
    <div className="w-full">
      {prop.readingNews && (
        <div>
          <h3 className="font-bold text-2xl text-orange-400">{prop.readingNews?.title}</h3>
          <a className="text-sm text-blue-300 hover:underline" href={prop.readingNews?.url as string} target="_blank">
            {prop.readingNews?.url}
          </a>
          <div className="mt-2 display-content" dangerouslySetInnerHTML={sanitizedData()}></div>
        </div>
      )}
    </div>
  )
}

export default NewsBox
