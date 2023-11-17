import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { useBoundStore } from 'store'
import { useConnectedWallet } from 'hooks/use-connected-wallet'
import { usePublishTransaction } from 'repositories/rpc.repository'
import { useAlertMessage } from 'hooks/use-alert-message'
import { FileUploader } from 'components/FileUploader'
import { CloseIcon } from 'components/Icons/icons'
import { IPFSFile, useGetDirectory, useStoreDirectory } from 'repositories/ipfs.repository'
import { updateChatBot } from 'services/nous'

const EncryptKnowledgeModal = () => {
  const { modal, setModalState } = useBoundStore()
  const { isOpen, token_id, chain_id, token_address, version, knowledge } = modal.encryptKnowledge
  const { metadata } = modal.nftMetadata
  const { metadata: nous } = modal.nousMetadata

  const { showSuccess } = useAlertMessage()

  const [cids, setCids] = useState<string[]>([])

  const [isLoading, setIsLoading] = useState(false)

  const { address, signMessage } = useConnectedWallet()
  const { mutateAsync: publish } = usePublishTransaction()

  const { data: files } = useGetDirectory(cids)
  const { mutateAsync: storeDirectory } = useStoreDirectory()

  const onEncrypt = async (cids: string[]) => {
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

    showSuccess('Success')
  }

  useEffect(() => {
    setCids(knowledge ?? [])
  }, [knowledge])

  const closeDialog = () => {
    setModalState({ encryptKnowledge: { isOpen: false } })
  }

  const onUploadFile = async (cid: string) => {
    if (!address?.full) return

    const newCids = [cid]
    await onEncrypt(newCids)
    if (nous?.id && metadata?.name) await updateChatBot(nous.id, metadata.name, `ipfs://${cid}`)
    setCids(newCids)
  }

  const onDeleteFile = async (cid: string) => {
    const filtered = (files as IPFSFile[]).filter(el => el.cid !== cid)

    if (filtered.length > 0) {
      const results = await storeDirectory(filtered?.map(el => el.content))
      const split = results.split('/')
      const newCid = split[split.length - 1]
      onUploadFile(newCid)
    } else {
      await onEncrypt([])
      setCids([])
    }
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment} afterLeave={() => setCids([])}>
        <Dialog as="div" className="relative z-50" onClose={closeDialog}>
          <div className="fixed inset-0 flex w-screen items-center justify-center overflow-hidden backdrop-blur-sm">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className=" h-full sm:h-3/4 md:w-3/4 w-full rounded bg-white border">
                <header className="flex justify-between items-center h-[10%] p-3 bg-black text-white">
                  <div className="font-semibold">
                    <Dialog.Title>Resource for Bot Development</Dialog.Title>
                  </div>

                  <div className="flex justify-center">
                    <button onClick={closeDialog} className="p-2 hover:text-red-900">
                      <CloseIcon />
                    </button>
                  </div>
                </header>
                <main className="h-[90%] bg-[#181818] overflow-hidden">
                  {isLoading && (
                    <div className="flex justify-center">
                      <p className=" w-full rounded-md bg-green-500 text-green-100 text-center font-semibold tracking-wide p-2">
                        Processing...
                      </p>
                    </div>
                  )}
                  <h3 className=" font-semibold tracking-wide text-white p-2 text-center">Your Upload</h3>
                  {/* file upload */}
                  <FileUploader
                    cids={cids}
                    existingFiles={files}
                    setIsLoading={bool => setIsLoading(bool)}
                    onUploadFile={onUploadFile}
                    onDeleteFile={onDeleteFile}
                  />
                </main>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default EncryptKnowledgeModal
