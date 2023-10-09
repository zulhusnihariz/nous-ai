import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { useBoundStore } from 'store'
import { useConnectedWallet } from 'hooks/use-connected-wallet'
import { usePublishTransaction } from 'repositories/rpc.repository'
import { ImageUploader } from 'components/ImageUploader'

interface NftMetadata {
  name: string
  description: string
  image: string
  attributes: { trait_type: string; value: string }[]
}

const initialNftMetadata: NftMetadata = {
  name: 'Nous Psyche',
  description: '',
  image: '',
  attributes: [
    { trait_type: 'name', value: '' },
    { trait_type: 'personality', value: '' },
  ],
}

const NftMetadataModal = () => {
  const { modal, setModalState } = useBoundStore()
  const { isOpen, metadata, token_id, chain_id, token_address, version } = modal.nftMetadata

  const [nftMetadata, setNftMetadata] = useState<NftMetadata>(initialNftMetadata)
  const [isLoading, setIsLoading] = useState(false)

  const { address, signMessage } = useConnectedWallet()
  const { mutateAsync: publish } = usePublishTransaction()

  const handleChange = (e: any) => {
    setNftMetadata(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleRemoveAttribute = (idx: number) => {
    setNftMetadata(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, index) => index !== idx),
    }))
  }

  const handleAddAttribute = () => {
    setNftMetadata(prev => ({
      ...prev,
      attributes: [...prev.attributes, { trait_type: '', value: '' }],
    }))
  }

  const handleAttributeChange = (e: any, idx: number) => {
    setNftMetadata(prev => ({
      ...prev,
      attributes: prev.attributes.map((el, index) => (index === idx ? { ...el, [e.target.name]: e.target.value } : el)),
    }))
  }

  const onCreateMetadata = async () => {
    if (!address?.full) return
    const content = JSON.stringify(nftMetadata)

    const signature = (await signMessage(JSON.stringify(content))) as string

    await publish({
      alias: '',
      chain_id: chain_id as string,
      data: content,
      mcdata: '',
      meta_contract_id: import.meta.env.VITE_NFT_METADATA_META_CONTRACT_ID,
      method: 'metadata',
      public_key: address.full,
      signature,
      token_address: token_address as string,
      token_id: token_id as string,
      version: version as string,
    })

    closeDialog()
  }

  const closeDialog = () => {
    setModalState({
      nftMetadata: { isOpen: false, token_id: '', chain_id: '', token_address: '', metadata: undefined },
    })
  }

  useEffect(() => {
    if (metadata) setNftMetadata(metadata)
  }, [metadata])

  return (
    <>
      <Transition appear show={isOpen} as={Fragment} afterLeave={() => setNftMetadata(initialNftMetadata)}>
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
                    Metadata for Token ID: {token_id}
                  </Dialog.Title>

                  <input
                    className="w-full rounded-lg border-black border p-3  text-sm shadow-sm text-black mb-2 "
                    name="name"
                    type="text"
                    placeholder="Name"
                    value={nftMetadata.name as string}
                    disabled={true}
                  />

                  <input
                    className="w-full rounded-lg border-black border p-3  text-sm shadow-sm text-black mb-2 "
                    name="description"
                    type="text"
                    placeholder="Description"
                    value={nftMetadata.description as string}
                    onChange={e => handleChange(e)}
                  />

                  <div className="flex justify-start items-center my-2">
                    <label>Attributes</label>

                    {/* <button
                      className="ml-5 text-center border border-black px-3 py-1"
                      onClick={() => handleAddAttribute()}
                    >
                      +
                    </button> */}
                  </div>

                  {nftMetadata.attributes.length > 0 &&
                    nftMetadata.attributes.map((attribute, idx) => {
                      return (
                        <div className="flex gap-2" key={idx}>
                          <input
                            className="w-full rounded-lg border-black border p-3  text-sm shadow-sm text-black mb-2 "
                            name="trait_type"
                            type="text"
                            placeholder="Trait Type"
                            value={attribute.trait_type}
                            onChange={e => handleAttributeChange(e, idx)}
                          />

                          <input
                            className="w-full rounded-lg border-black border p-3  text-sm shadow-sm text-black mb-2 "
                            name="value"
                            type="text"
                            placeholder="Value"
                            value={attribute.value}
                            onChange={e => handleAttributeChange(e, idx)}
                          />
                          {/* <button
                            className="ml-5 text-center border border-black px-3 py-1"
                            onClick={() => handleRemoveAttribute(idx)}
                          >
                            -
                          </button> */}
                        </div>
                      )
                    })}

                  <ImageUploader
                    url={nftMetadata.image as string}
                    setIsLoading={bool => setIsLoading(bool)}
                    setImageURL={(url: string) => {
                      handleChange({
                        target: {
                          name: 'image',
                          value: url,
                        },
                      })
                    }}
                  />

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => onCreateMetadata()}
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

export default NftMetadataModal
