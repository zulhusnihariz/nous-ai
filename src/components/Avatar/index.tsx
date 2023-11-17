interface Prop {
  imgMain: string
  imgBadge: string
}
const Avatar = (prop: Prop) => {
  return (
    <>
      <div className="group relative block overflow-hidden">
        {prop.imgBadge && <img className="absolute end-3 top-3 h-12 w-12 z-10" src={prop.imgBadge} />}
        <img className="rounded-md" src={prop.imgMain} />
      </div>
    </>
  )
}

export default Avatar
