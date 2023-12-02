import { useBoundStore, useNousStore } from 'store'
import useIsWhitelisted from './hook/useIsWhitelist'
import usePurchasePerk from './hook/usePurchasePerk'
import { Perk } from 'lib/Perk'
import { useAlertMessage } from 'hooks/use-alert-message'
import GenericButton from 'components/Button/GenericButton'
import TypographyNormal from 'components/Typography/Normal'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { RQ_KEY } from 'repositories'
interface Prop {
  perk: Perk
  mintPrice: String
}

const PurchaseButton = (prop: Prop) => {
  const { purchasePerk, isLoading, error } = usePurchasePerk({
    perk: prop.perk,
    mintPrice: prop.mintPrice,
  })

  const { isWhitelistedForPerk } = useIsWhitelisted({
    perkId: prop.perk.id,
  })

  const { setModalState } = useBoundStore()
  const { showSuccess } = useAlertMessage()

  const onHandlePurchase = async () => {
    if (isLoading) {
      return
    }
    try {
      await purchasePerk()
      setModalState({
        alert: { isOpen: true, state: 'success', message: `Purchase Perk ver. ${prop.perk.id} success` },
      })
    } catch (e) {
      setModalState({
        alert: { isOpen: true, state: 'failed', message: `Purchase Perk ver. ${prop.perk.id} failed: ${error}` },
      })
      console.log(error)
    }
  }

  return (
    <div className="">
      <GenericButton name={(!isLoading ? `Purchase` : `Processing`) as string} onClick={onHandlePurchase} />
    </div>
  )
}

export default PurchaseButton
