import { useBoundStore, useNousStore } from 'store'
import useIsWhitelisted from './hook/useIsWhitelist'
import usePurchasePerk from './hook/usePurchasePerk'
import { Perk } from 'lib/Perk'
import { useAlertMessage } from 'hooks/use-alert-message'

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

  const { selectedNous } = useNousStore()
  const { setModalState } = useBoundStore()
  const { showSuccess } = useAlertMessage()

  const onHandlePurchase = async () => {
    if (isLoading) {
      return
    }
    try {
      await purchasePerk()
      setModalState({ purchasePerk: { isOpen: false, perk: undefined } })
    } catch (e) {
      console.log(error)
    }
  }

  return (
    <div className="w-full">
      {error && <div className="text-xs text-red-500 py-2">{error}</div>}
      <div className="flex items-center justify-end gap-2">
        <img
          src={selectedNous?.metadata.image}
          className="text-center w-10 h-10 rounded-md ring ring-green-300"
          onClick={e => {
            e.stopPropagation()
            setModalState({ selectNous: { isOpen: true } })
          }}
        />
        <button
          className={`rounded-md px-5 py-3 text-center text-sm font-semibold text-white ${
            !isLoading ? 'bg-green-500' : ''
          }`}
          onClick={onHandlePurchase}
        >
          {!isLoading && <span>Proceed</span>}
          {isLoading && <span>Processing...</span>}
        </button>
      </div>
    </div>
  )
}

export default PurchaseButton
