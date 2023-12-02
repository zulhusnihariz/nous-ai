import GenericButton from 'components/Button/GenericButton'
import TypographyNormal from 'components/Typography/Normal'
import { useBoundStore } from 'store'

interface Prop {
  tokenId: string
}

const SubscribeFirstButton = (prop: Prop) => {
  const { setModalState } = useBoundStore()

  const onClickSubscribe = () => {
    setModalState({
      subscribe: { isOpen: true, tokenId: prop.tokenId, amount: 1 },
    })
  }

  return (
    <div className="flex flex-col items-center gap-2 mt-2">
      <GenericButton name="Subscribe" onClick={onClickSubscribe} />
    </div>
  )
}

export default SubscribeFirstButton
