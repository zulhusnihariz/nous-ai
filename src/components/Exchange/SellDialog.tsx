import { Dialog, Transition } from '@headlessui/react'
import GenericButton from 'components/Button/GenericButton'
import { Fragment, useEffect, useState } from 'react'
import { useBoundStore } from 'store'
import useSubscription from './hooks/useSubscription'
import useGetSellPrice from './hooks/useGetSellPrice'
import useUserKeyBalance from './hooks/useGetUserBalance'
import { useConnectedWallet } from 'hooks/use-connected-wallet'
import QuantityInput from 'components/QuantityInput'

const ExchangeSellDialog = () => {
  const [amount, setAmount] = useState(0)
  const { unsubscribe, isLoading } = useSubscription()
  const { modal, setModalState } = useBoundStore()
  const { address } = useConnectedWallet()
  const { sellPrice, sellPriceAfterTax } = useGetSellPrice({
    tokenId: modal.unsubscribe.tokenId,
    amount,
  })

  const { refetch, keyCount } = useUserKeyBalance(modal.unsubscribe.tokenId, address.full)

  const onCloseModal = () => {
    setModalState({
      unsubscribe: { isOpen: false, tokenId: '', amount: 0 },
    })
  }

  useEffect(() => {
    setAmount(keyCount)
  }, [keyCount])

  const onClickUnsubscribe = async () => {
    try {
      await unsubscribe(modal.unsubscribe.tokenId, amount)
      refetch()
      setModalState({
        alert: {
          isOpen: true,
          state: 'success',
          message: `Unboosting Nous Psyche #${modal.unsubscribe.tokenId}`,
        },
      })
    } catch (e) {
      setModalState({
        alert: { isOpen: true, state: 'failed', message: `Unboost failed` },
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
                <div className="flex flex-col p-4 text-white h-full">
                  <h3 className="text-lg font-bold">Unstake to unboost this bot</h3>
                  <h5 className="text-md">By unboost this bot, it would possibly drop rank</h5>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center flex flex-col gap-1">
                      <QuantityInput input={amount} setInput={setAmount} max={keyCount} />
                    </div>
                  </div>
                  <div className="my-3 pr-3 w-full text-right">
                    <h5 className="text-xs uppercase text-yellow-400">Total Unstake</h5>
                    <h3>{sellPrice ?? 0} ETH</h3>
                    <h5 className="text-xs uppercase text-yellow-400 mt-1">Total Unstake After Fee</h5>
                    <h3>{sellPriceAfterTax ?? 0} ETH</h3>
                    <div className="text-center flex justify-end gap-2 mt-2">
                      <GenericButton
                        name={!isLoading ? `Unboost` : `Processing`}
                        disabled={isLoading}
                        onClick={onClickUnsubscribe}
                      />
                      <GenericButton name="Cancel" onClick={onCloseModal} />
                    </div>
                  </div>
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
