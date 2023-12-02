import GenericButton from './Button/GenericButton'
import { DownArrow, UpArrow } from './Icons/misc'

interface Prop {
  targetRef: any
}

const ScrollController = ({ targetRef }: Prop) => {
  const scrollUp = () => {
    if (targetRef.current) {
      targetRef.current.scrollBy({ top: -100, behavior: 'smooth' })
    }
  }

  // Function to scroll down
  const scrollDown = () => {
    if (targetRef.current) {
      targetRef.current.scrollBy({ top: 100, behavior: 'smooth' })
    }
  }

  return (
    <>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col">
        <GenericButton icon={<UpArrow />} onClick={scrollUp} />
        <GenericButton icon={<DownArrow />} onClick={scrollDown} />
      </div>
    </>
  )
}

export default ScrollController
