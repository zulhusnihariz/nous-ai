import { Dialog, Transition } from '@headlessui/react'
import GenericButton from 'components/Button/GenericButton'
import TypographyNormal from 'components/Typography/Normal'
import { Fragment } from 'react'
import { useBoundStore } from 'store'

const AlertBox = () => {
  const { modal, setModalState } = useBoundStore()

  const onCloseModal = () => {
    if (modal.alert.onOkClicked) {
      modal.alert.onOkClicked()
    }
    setModalState({ alert: { isOpen: false, state: '', message: '', onOkClicked: () => {} } })
  }

  return (
    <Transition appear show={modal.alert.isOpen} as={Fragment}>
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
          <div
            className={`fixed inset-0 backdrop-blur ${modal.alert.state === 'success' ? 'bg-blue-500/50' : ''} ${
              modal.alert.state === 'failed' ? 'bg-red-300/50' : ''
            }`}
            aria-hidden="true"
          />
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
                className={`ring-1 ring-white backdrop-blur border shadow-2xl h-full flex flex-col justify-between ${
                  modal.alert.state === 'success' ? 'bg-blue-500/70 border-blue-600' : ''
                } ${modal.alert.state === 'failed' ? 'bg-red-500/70 border-red-600' : ''}`}
              >
                <div className="flex justify-center items-center h-full text-center w-1/2 mx-auto">
                  <TypographyNormal classNames="uppercase">{modal.alert.message}</TypographyNormal>
                </div>
                <div className="text-center mb-3">
                  <GenericButton name="Okay" onClick={onCloseModal} />
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  )
}

export default AlertBox
