import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { useBoundStore } from 'store'
import { useConnectedWallet } from 'hooks/use-connected-wallet'
import { usePublishTransaction } from 'repositories/rpc.repository'
import { useAlertMessage } from 'hooks/use-alert-message'
import { FileUploader } from 'components/FileUploader'

const EncryptKnowledgeModal = () => {
  const { modal, setModalState } = useBoundStore()
  const { isOpen, token_id, chain_id, token_address, version, knowledge } = modal.encryptKnowledge
  const { showSuccess } = useAlertMessage()

  const [cids, setCids] = useState<string[]>([])

  const [isLoading, setIsLoading] = useState(false)

  const { address, signMessage } = useConnectedWallet()
  const { mutateAsync: publish } = usePublishTransaction()

  const onEncrypt = async () => {
    if (cids.length <= 0 || !address?.full) return

    const content = JSON.stringify(cids)
    const signature = (await signMessage(content)) as string

    await publish({
      alias: '',
      chain_id: chain_id as string,
      data: content,
      mcdata: '',
      meta_contract_id: import.meta.env.VITE_NOUS_STORAGE_META_CONTRACT_ID,
      method: 'metadata',
      public_key: address.full.toLowerCase(),
      signature,
      token_address: token_address as string,
      token_id: token_id as string,
      version: version as string,
    })

    closeDialog()
    showSuccess('Success')
  }

  useEffect(() => {
    setCids(knowledge ?? [])
  }, [knowledge])

  const closeDialog = () => {
    setModalState({ encryptKnowledge: { isOpen: false } })
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment} afterLeave={() => setCids([])}>
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
            <div className="flex min-h-full items-center justify-center p-4 text-center gap-5">
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
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 gap-5 mb-4">
                    Upload Knowledge For Chat AI
                  </Dialog.Title>

                  <div className="flex justify-center">
                    <FileUploader
                      cids={cids}
                      setIsLoading={bool => setIsLoading(bool)}
                      setCid={cid => setCids(prev => [...prev, cid])}
                    />
                  </div>

                  <div className="mt-4 flex gap-4 justify-center">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => onEncrypt()}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Processing...' : 'Upload'}
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

export default EncryptKnowledgeModal
