interface Prop {
  imgMain: string
  imgBadge: string
  className?: string
  badgeSize: string
}
const Avatar = (prop: Prop) => {
  return (
    <>
      <div className={`group relative block overflow-hidden ${prop.className} ring ring-white`}>
        {prop.imgBadge && (
          <img
            className={`absolute end-1.5 top-2 sm:end-3 sm:top-3 w-${prop.badgeSize} h-${prop.badgeSize} md:w-10 md:h-10 z-10 bg-white rounded-full p-0.5`}
            src={prop.imgBadge}
          />
        )}
        <img className="object-contain h-full" src={prop.imgMain} />
      </div>
    </>
  )
}

export default Avatar
