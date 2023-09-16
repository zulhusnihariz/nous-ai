interface ChatProp {
  img: String
  text: String
  name: String
}

const ChatBubble = (prop: ChatProp) => {
  const textWithBreaks = prop.text.replace(/\n/g, '<br />')

  return (
    <>
      <div className="flex p-2 my-2">
        {prop.img.length > 0 && (
          <img alt="avatar" src={prop.img as string} className="h-10 w-10 rounded-full object-cover" />
        )}
        {prop.img.length <= 0 && <span className="h-10 w-10 rounded-full bg-red-100"></span>}
        <div className="ml-4">
          <h5 className="capitalize font-bold text-sm">{prop.name}</h5>
          <div dangerouslySetInnerHTML={{ __html: textWithBreaks }}></div>
        </div>
      </div>
    </>
  )
}

export default ChatBubble
