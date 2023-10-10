import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { useBoundStore } from 'store'

const ViewKnowledgeModal = () => {
  const { modal, setModalState } = useBoundStore()

  const { isOpen, url } = modal.viewKnowledge

  const openNewTab = () => {
    window.open(url)
  }

  const closeDialog = () => {
    setModalState({ viewKnowledge: { isOpen: false, url: '' } })
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment} afterLeave={() => closeDialog()}>
        <Dialog as="div" className="relative z-10" onClose={closeDialog}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full text-center max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Knowledge URL
                  </Dialog.Title>
                  <div className="w-full text-sm text-center bg-gray-800 text-gray-400 p-3 rounded-xl mt-2 overflow-hidden">
                    {url}
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Checkout the url for more details</p>
                  </div>

                  <div className="flex gap-4 justify-center mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => openNewTab()}
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => closeDialog()}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default ViewKnowledgeModal
