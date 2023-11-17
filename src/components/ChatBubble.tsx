interface ChatProp {
  img: String
  text: String
  name: String
  className?: string
  bgColor?: string
}

const ChatBubble = (prop: ChatProp) => {
  const textWithBreaks = prop.text.replace(/\n/g, '<br />')

  return (
    <>
      <div className={`z-10 flex p-2 my-2 mx-1 md:mx-16 lg:mx-40 ${prop.className}`}>
        {prop.img.length > 0 && (
          <img
            alt="avatar"
            src={prop.img as string}
            className="h-8 w-8 md:h-10 md:w-10 rounded-md object-cover border-[1px] border-[#333335]"
          />
        )}
        {prop.img.length <= 0 && (
          <span className="h-8 w-8 md:h-10 md:w-10 rounded-md" style={{ backgroundColor: prop.bgColor }}></span>
        )}
        <div className="ml-4 mr-2 text-sm">
          <h5 className="capitalize font-bold text-sm md:pb-1">{prop.name}</h5>
          <div dangerouslySetInnerHTML={{ __html: textWithBreaks }}></div>
        </div>
      </div>
    </>
  )
}

export default ChatBubble
