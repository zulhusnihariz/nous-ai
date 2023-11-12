import { Dialog } from '@headlessui/react'
import { useBoundStore, useNousStore } from 'store'
import PurchaseButton from './PurchaseButton'
import { useEffect, useState } from 'react'

const PurchaseModal = () => {
  const { modal, setModalState } = useBoundStore()
  const { selectedNous } = useNousStore()

  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    if (selectedNous) {
      setShowButton(true)
    } else {
      setShowButton(false)
    }
  }, [selectedNous])

  return (
    <>
      <Dialog
        open={modal.purchasePerk.isOpen}
        onClose={() => setModalState({ purchasePerk: { isOpen: false, perk: undefined } })}
      >
        <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
        <div className="fixed left-1/2 md:w-2/4 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-slate-900 text-white h-3/4 w-full">
          <Dialog.Panel className="h-full">
            <img className="rounded-t-md h-1/2 w-full object-cover" src={modal.purchasePerk.perk?.banner as string} />
            <div className="flex flex-col justify-center p-4">
              <h3 className="font-semibold text-2xl">{modal.purchasePerk.perk?.title}</h3>
              <p className="mt-1 text-sm text-gray-400 line-clamp-2">{modal.purchasePerk.perk?.description}</p>
            </div>
            <div className="w-full pl-9 flex justify-between gap-2 fixed bottom-5 right-5">
              <button
                onClick={() => setModalState({ purchasePerk: { isOpen: false, perk: undefined } })}
                className="mt-2 inline-block w-full rounded-md bg-gray-50 px-5 py-3 text-center text-sm font-semibold text-gray-500 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
              {showButton && (
                <PurchaseButton
                  mintPrice={modal.purchasePerk.perk?.price as String}
                  perkId={modal.purchasePerk.perk?.id as String}
                />
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}
export default PurchaseModal
