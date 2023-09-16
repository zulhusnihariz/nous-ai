interface ChatProp {
  img: String
  text: String
  name: String
}

const ChatBubble = (prop: ChatProp) => {
  return (
    <>
      <div className="flex p-2 my-2">
        <img alt="avatar" src={prop.img as string} className="h-10 w-10 rounded-full object-cover" />
        <div className="ml-4">
          <h5 className="capitalize font-bold text-sm">{prop.name}</h5>
          <p className="font-thin text-sm">{prop.text as string}</p>
        </div>
      </div>
    </>
  )
}

export default ChatBubble
