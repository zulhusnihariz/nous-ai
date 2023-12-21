import GenericButton from 'components/Button/GenericButton'
import TypographyNormal from 'components/Typography/Normal'
import { Fragment, useEffect, useState } from 'react'
import useReferralCode from './hooks/useAllowedList'
import { useBoundStore } from 'store'
import { base58ToHex, hexToBase58 } from 'utils'
import { useConnectedWallet } from 'hooks/use-connected-wallet'
import { Dialog, Transition } from '@headlessui/react'

const ExchangeNotAllowed = () => {
  const [inputValue, setInputValue] = useState<string>('')

  const { address } = useConnectedWallet()
  const { enterAllowedList, validateCode, isLoading, error } = useReferralCode({ address: address.full })
  const { setModalState, modal } = useBoundStore()

  const onCloseModal = () => {
    setModalState({
      notAllowed: { isOpen: false },
    })
  }

  const onSubmitClicked = async () => {
    try {
      const input = validateCode(inputValue)

      if (input) {
        const hex = base58ToHex(input)
        await enterAllowedList(hex)
        setModalState({
          alert: {
            isOpen: true,
            state: 'success',
            message: `Code accepted.`,
            onOkClicked: () => {
              window.location.reload()
            },
          },
        })
      } else {
        throw Error('Invalid referal code')
      }
    } catch (e: any) {
      setModalState({
        alert: { isOpen: true, state: 'failed', message: `${e}` },
      })
      console.log(e)
    }
  }

  useEffect(() => {
    if (error) {
      setModalState({
        alert: { isOpen: true, state: 'failed', message: `${error}` },
      })
    }
  }, [setModalState, error])

  return (
    <>
      <Transition appear show={modal.notAllowed.isOpen} as={Fragment}>
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
            <div className="fixed left-1/2 md:w-2/4 top-1/2 -translate-x-1/2 -translate-y-1/2 transform ring ring-white bg-blue-600/80 backdrop-blur text-white h-2/5 w-1/2">
              <Dialog.Panel className="h-full">
                <div className="h-56 flex flex-col justify-center gap-2 items-center">
                  <TypographyNormal>
                    Exchange is still in <span className="font-semibold text-yellow-400 mt-2">Beta</span>, paste your
                    invite to join
                  </TypographyNormal>
                  <div className="mt-2 flex flex-col items-center justify-center w-full gap-2">
                    <input
                      placeholder="Invite code"
                      className="p-2 w-3/4 mt-2 text-slate-600 text-sm text-center"
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                    />
                    <GenericButton
                      name={isLoading ? 'Processing' : 'Submit'}
                      disabled={isLoading}
                      onClick={onSubmitClicked}
                    />
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  )
}

export default ExchangeNotAllowed
