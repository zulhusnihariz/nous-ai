import { Dialog } from '@headlessui/react'
import { useBoundStore, useNousStore } from 'store'
import PurchaseButton from './PurchaseButton'
import { useEffect, useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import EquipButton from './EquipButton'

const PurchaseModal = () => {
  const [isOwned, setIsOwned] = useState(false)
  const { modal, setModalState } = useBoundStore()
  const { selectedNous, ownedPerks } = useNousStore()

  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    if (selectedNous) {
      setShowButton(true)
    } else {
      setShowButton(false)
    }

    if (ownedPerks.length > 0 && modal.purchasePerk.perk) {
      const isPerkIncluded = ownedPerks.some(perk => {
        return perk.id.toString() === modal.purchasePerk.perk?.id
      })
      setIsOwned(isPerkIncluded)
    }
  }, [modal.purchasePerk.perk, modal.purchasePerk.perk?.id, ownedPerks, selectedNous])

  return (
    <>
      <Dialog
        open={modal.purchasePerk.isOpen}
        onClose={() => setModalState({ purchasePerk: { isOpen: false, perk: undefined } })}
      >
        <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
        <div className="fixed left-1/2 md:w-2/4 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-slate-900 text-white h-full w-full">
          <Dialog.Panel className="h-full">
            <img className="rounded-t-md h-2/5 w-full object-contain" src={modal.purchasePerk.perk?.banner as string} />
            <div className="flex flex-col justify-center p-4">
              <h3 className="font-semibold text-2xl">{modal.purchasePerk.perk?.title}</h3>
              <Markdown className="mt-1 text-sm text-gray-400" remarkPlugins={[remarkGfm]}>
                {modal.purchasePerk.perk?.longDescription}
              </Markdown>
            </div>
            <div className="w-full pl-9 flex justify-between gap-2 fixed bottom-5 right-5">
              <button
                onClick={() => setModalState({ purchasePerk: { isOpen: false, perk: undefined } })}
                className="mt-2 inline-block w-full rounded-md bg-gray-50 px-5 py-3 text-center text-sm font-semibold text-gray-500 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
              <div className="flex gap-5">
                {showButton && modal.purchasePerk.perk && modal.purchasePerk.perk.forSale && !isOwned && (
                  <PurchaseButton mintPrice={modal.purchasePerk.perk?.price} perk={modal.purchasePerk.perk} />
                )}
                {showButton && modal.purchasePerk.perk && isOwned && (
                  <EquipButton perkId={modal.purchasePerk.perk.id as string} />
                )}
                {showButton &&
                  modal.purchasePerk.perk &&
                  modal.purchasePerk.perk.forSale &&
                  modal.purchasePerk.perk.isRepurchaseable && (
                    <PurchaseButton mintPrice={modal.purchasePerk.perk?.price} perk={modal.purchasePerk.perk} />
                  )}
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}
export default PurchaseModal
