import { useBoundStore, useNousStore } from 'store'
import useIsWhitelisted from './hook/useIsWhitelist'
import usePurchasePerk from './hook/usePurchasePerk'
import { Perk } from 'lib/Perk'

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

  const onHandlePurchase = async () => {
    try {
      await purchasePerk()
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="w-full">
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
          className="rounded-md bg-green-500 px-5 py-3 text-center text-sm font-semibold text-white"
          onClick={onHandlePurchase}
        >
          Proceed
        </button>
      </div>
    </div>
  )
}

export default PurchaseButton
