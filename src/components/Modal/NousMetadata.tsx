import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { useBoundStore } from 'store'
import { useConnectedWallet } from 'hooks/use-connected-wallet'
import { usePublishTransaction } from 'repositories/rpc.repository'
import { NousMetadata } from 'lib/NousNft'
import { useAlertMessage } from 'hooks/use-alert-message'

const initialNousMetadata: NousMetadata = {
  id: '',
}

const NousMetadataModal = () => {
  const { modal, setModalState } = useBoundStore()
  const { isOpen, metadata, token_id, chain_id, token_address, version } = modal.nousMetadata
  const { showSuccess } = useAlertMessage()

  const [nousMetadata, setNousMetadata] = useState<NousMetadata>(initialNousMetadata)
  const [isLoading, setIsLoading] = useState(false)

  const { address, signMessage } = useConnectedWallet()
  const { mutateAsync: publish } = usePublishTransaction()

  const handleChange = (e: any) => {
    setNousMetadata(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const onCreateNousMetadata = async () => {
    if (!address?.full) return

    const content = JSON.stringify(nousMetadata)
    setIsLoading(true)

    const signature = (await signMessage(JSON.stringify(content))) as string

    await publish({
      alias: 'nous',
      chain_id: chain_id as string,
      data: content,
      mcdata: '',
      meta_contract_id: import.meta.env.VITE_NOUS_AI_META_CONTRACT_ID,
      method: 'metadata',
      public_key: address.full.toLowerCase(),
      signature,
      token_address: token_address as string,
      token_id: token_id as string,
      version: version as string,
    })

    closeDialog()
    showSuccess('Success')
    setIsLoading(false)
  }

  const closeDialog = () => {
    setModalState({
      nousMetadata: { isOpen: false, token_id: '', chain_id: '', token_address: '', metadata: undefined },
    })
  }

  useEffect(() => {
    if (metadata) setNousMetadata(metadata)
  }, [metadata])

  return (
    <>
      <Transition appear show={isOpen} as={Fragment} afterLeave={() => setNousMetadata(initialNousMetadata)}>
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
                    Nous Metadata for Token ID: {token_id}
                  </Dialog.Title>

                  <input
                    className="w-full rounded-lg border-black border p-3  text-sm shadow-sm text-black mb-2 "
                    name="id"
                    type="text"
                    placeholder="ID"
                    value={nousMetadata.id}
                    onChange={e => handleChange(e)}
                  />

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => onCreateNousMetadata()}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Processing...' : metadata ? 'Update' : 'Create'}
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

export default NousMetadataModal
