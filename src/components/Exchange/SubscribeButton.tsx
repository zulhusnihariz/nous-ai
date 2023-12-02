import GenericButton from 'components/Button/GenericButton'
import TypographyNormal from 'components/Typography/Normal'
import SubscribePrice from './SubscribePrice'
import QuantityInput from 'components/QuantityInput'
import { useEffect, useState } from 'react'
import { Nft } from 'lib'
import { NousNft } from 'lib/NousNft'
import useSubscription from './hooks/useSubscription'
import useGetBuyPrice from './hooks/useGetBuyPrice'
import { useBoundStore } from 'store'

interface Prop {
  tokenId: string
  userKeyCount: number
}

const SubscribeButton = (prop: Prop) => {
  const [subscribeCount, setSubscribeCount] = useState(0)

  const { setModalState } = useBoundStore()

  const { buyPrice } = useGetBuyPrice({
    tokenId: prop.tokenId,
    amount: subscribeCount,
  })

  const onClickSubscribe = () => {
    setModalState({
      subscribe: { isOpen: true, tokenId: prop.tokenId, amount: subscribeCount },
    })
  }

  useEffect(() => {
    if (prop.tokenId) {
      setSubscribeCount(0)
    }
  }, [prop.tokenId])

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-col text-center justify-center gap-1">
        <TypographyNormal classNames="text-green-400 text-md font-semibold tracking-wider uppercase">
          <SubscribePrice count={buyPrice} /> ETH
        </TypographyNormal>
      </div>
      <div>
        <QuantityInput input={subscribeCount} setInput={setSubscribeCount} />
      </div>
      <GenericButton name="Subscribe" onClick={onClickSubscribe} />
    </div>
  )
}

export default SubscribeButton
