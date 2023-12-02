import GenericButton from 'components/Button/GenericButton'
import TypographyNormal from 'components/Typography/Normal'
import SubscribePrice from './SubscribePrice'
import { useEffect, useState } from 'react'
import QuantityInput from 'components/QuantityInput'
import { Nft } from 'lib'
import { NousNft } from 'lib/NousNft'
import useGetSellPrice from './hooks/useGetSellPrice'
import useSubscription from './hooks/useSubscription'
import { useBoundStore } from 'store'

interface Prop {
  nft: Nft & NousNft
  userKeyCount: number
}

const UnsubscribeButton = (prop: Prop) => {
  const [subscribeCount, setSubscribeCount] = useState(prop.userKeyCount)

  const { setModalState } = useBoundStore()
  const { sellPrice } = useGetSellPrice({ tokenId: prop.nft.token_id as string, amount: subscribeCount })

  const onClickUnsubscribe = () => {
    setModalState({
      unsubscribe: { isOpen: true, tokenId: prop.nft.token_id as string, amount: subscribeCount },
    })
  }

  useEffect(() => {
    if (prop.nft.token_id) {
      setSubscribeCount(prop.userKeyCount ?? 0)
    }
  }, [prop.userKeyCount, prop.nft.token_id])

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-col text-center justify-center gap-1">
        <TypographyNormal classNames="text-red-400 text-md font-semibold tracking-wider uppercase">
          <SubscribePrice count={sellPrice} /> ETH
        </TypographyNormal>
      </div>
      <div>
        <QuantityInput input={subscribeCount} setInput={setSubscribeCount} max={prop.userKeyCount} />
      </div>
      <GenericButton name="Unsubscribe" onClick={onClickUnsubscribe} />
    </div>
  )
}

export default UnsubscribeButton
