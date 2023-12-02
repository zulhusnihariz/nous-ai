import { Dialog, Transition } from '@headlessui/react'
import GenericButton from 'components/Button/GenericButton'
import TypographyNormal from 'components/Typography/Normal'
import { Fragment } from 'react'
import { useBoundStore } from 'store'
import useSubscription from './hooks/useSubscription'
import useGetSellPrice from './hooks/useGetSellPrice'
import useUserKeyBalance from './hooks/useGetUserBalance'
import { useConnectedWallet } from 'hooks/use-connected-wallet'

const ExchangeSellDialog = () => {
  const { unsubscribe, isLoading } = useSubscription()
  const { modal, setModalState } = useBoundStore()
  const { address } = useConnectedWallet()
  const { sellPrice, sellPriceAfterTax } = useGetSellPrice({
    tokenId: modal.unsubscribe.tokenId,
    amount: modal.unsubscribe.amount,
  })

  const { refetch } = useUserKeyBalance(modal.unsubscribe.tokenId, address.full)

  const onCloseModal = () => {
    setModalState({
      unsubscribe: { isOpen: false, tokenId: '', amount: 0 },
    })
  }

  const onClickSubscribe = async () => {
    try {
      await unsubscribe(modal.unsubscribe.tokenId, modal.unsubscribe.amount)
      refetch()
      setModalState({
        alert: {
          isOpen: true,
          state: 'success',
          message: `Succesfully unsubscribed to Nous Psyche #${modal.unsubscribe.tokenId}`,
        },
      })
    } catch (e) {
      setModalState({
        alert: { isOpen: true, state: 'failed', message: `Unsubscription failed` },
      })
    }
  }

  return (
    <Transition appear show={modal.unsubscribe.isOpen} as={Fragment}>
      <Dialog as="div" onClose={onCloseModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={`fixed inset-0 bg-blue-800/40 backdrop-blur`} aria-hidden="true" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="transition ease-out duration-300 transform"
          enterFrom="opacity-0 translate-y-full"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-200 transform"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-full"
        >
          <div className="fixed left-1/2 md:w-2/4 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-slate-900 text-white h-2/5 w-1/2">
            <Dialog.Panel className="h-full">
              <div
                className={`p-4 ring-1 ring-white backdrop-blur border shadow-2xl h-full bg-blue-500/70 border-blue-600`}
              >
                <div className="">
                  <TypographyNormal classNames="text-left uppercase text-md text-yellow-400 font-semibold tracking-wider">
                    SUBSCRIPTION PRICE
                  </TypographyNormal>
                  <div className="text-left flex items-center gap-3 justify-start">
                    <TypographyNormal classNames="uppercase text-lg text-white">{sellPrice} ETH</TypographyNormal>
                  </div>
                </div>
                <div className="mt-2">
                  <TypographyNormal classNames="text-left uppercase text-md text-yellow-400 font-semibold tracking-wider">
                    AMOUNT RECEIVED AFTER TAX
                  </TypographyNormal>
                  <div className="text-left flex items-center gap-3 justify-start">
                    <TypographyNormal classNames="uppercase text-xl text-white">
                      {sellPriceAfterTax} ETH
                    </TypographyNormal>
                  </div>
                </div>
                <div className="text-center mb-3 fixed bottom-0 flex gap-2 right-4">
                  <GenericButton
                    name={!isLoading ? `Unsubscribe` : `Processing`}
                    disabled={isLoading}
                    onClick={onClickSubscribe}
                  />
                  <GenericButton name="Cancel" onClick={onCloseModal} />
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}

export default ExchangeSellDialog
