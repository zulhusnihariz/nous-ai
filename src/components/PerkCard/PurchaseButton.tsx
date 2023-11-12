import useIsWhitelisted from './hook/useIsWhitelist'
import usePurchasePerk from './hook/usePurchasePerk'
import DropdownOwnedToken from 'components/DropdownOwnedToken'

interface Prop {
  perkId: String
  mintPrice: String
}

const PurchaseButton = (prop: Prop) => {
  const { purchasePerk, isLoading, error } = usePurchasePerk({
    perkId: prop.perkId,
    mintPrice: prop.mintPrice,
  })

  const { isWhitelistedForPerk } = useIsWhitelisted({
    perkId: prop.perkId,
  })

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
        <DropdownOwnedToken />
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
