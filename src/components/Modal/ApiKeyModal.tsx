import { Dialog, Transition } from '@headlessui/react'
import { CopyIcon } from 'components/Icons/icons'
import { useAlertMessage } from 'hooks/use-alert-message'
import { Fragment, useState } from 'react'
import { useBoundStore } from 'store'

const ApiKeyModal = () => {
  const { modal, setModalState } = useBoundStore()
  const { showSuccess } = useAlertMessage()

  const { isOpen, key } = modal.apiKey

  const closeDialog = () => {
    setModalState({ apiKey: { isOpen: false, key: '' } })
  }

  const copyToClipboard = () => {
    const textarea = document.createElement('textarea')
    textarea.value = key // The key you want to copy
    textarea.style.position = 'absolute' // Ensuring it doesn't disrupt your layout
    textarea.style.left = '-9999px' // Ensuring it remains offscreen
    document.body.appendChild(textarea)

    // Select the content
    textarea.select()

    // Copy the selected content
    document.execCommand('copy')

    // Clean up: Remove the textarea
    document.body.removeChild(textarea)

    showSuccess('Copied')
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
                <Dialog.Panel className="w-full text-center max-w-sm transform overflow-hidden rounded-md bg-white p-6 align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    API Key
                  </Dialog.Title>
                  <textarea rows={4} className="w-full text-sm bg-gray-200 text-gray-800 p-3 rounded-md mt-2">
                    {key}
                  </textarea>

                  <div className="flex gap-4 justify-center mt-4">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 justify-center rounded-md border border-transparent bg-purple-700 px-4 py-2 text-sm font-medium text-purple-200 hover:bg-purple-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => copyToClipboard()}
                    >
                      <CopyIcon /> Copy
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

export default ApiKeyModal
