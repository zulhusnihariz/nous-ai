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
          <img className={`absolute end-3 top-3 w-${prop.badgeSize} h-${prop.badgeSize} z-10`} src={prop.imgBadge} />
        )}
        <img className="" src={prop.imgMain} />
      </div>
    </>
  )
}

export default Avatar
