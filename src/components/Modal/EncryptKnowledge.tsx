import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { useBoundStore } from 'store'
import { AccessControlConditions, AuthSig } from '@lit-protocol/types'
import { useConnectedWallet } from 'hooks/use-connected-wallet'
import { useLitProtocol } from 'hooks/use-lit-protocol'
import { usePublishTransaction } from 'repositories/rpc.repository'
import { convertCamelToSnakeCase, convertSnakeToCamelCase } from 'utils'

export const accessControlConditions: AccessControlConditions = [
  {
    contractAddress: '',
    standardContractType: '',
    chain: import.meta.env.VITE_DEFAULT_LINEAGE_CHAIN,
    method: 'eth_getBalance',
    parameters: [':userAddress'],
    conditionType: 'evmBasic',
    returnValueTest: {
      comparator: '>',
      value: '0',
    },
  },
]

const EncryptKnowledgeModal = () => {
  const { modal, setModalState } = useBoundStore()
  const { isOpen, encryption, token_id, chain_id, token_address, version } = modal.encryptKnowledge

  const [knowledgeBaseURL, setKnowledgeBaseURL] = useState('')

  const [encrypted, setEncrypted] = useState<{
    encryptedString: string
    encryptedSymmetricKey: string
    authSig: AuthSig
  }>({
    encryptedString: '',
    encryptedSymmetricKey: '',
    authSig: {} as AuthSig,
  })

  const { address, signMessage } = useConnectedWallet()
  const { encrypt, decrypt } = useLitProtocol()
  const { mutateAsync: publish } = usePublishTransaction()

  const onEncrypt = async () => {
    if (!knowledgeBaseURL) return

    const { encryptedString, encryptedSymmetricKey, authSig } = await encrypt({
      text: knowledgeBaseURL as string,
      accessControlConditions,
    })

    const content = JSON.stringify(
      convertCamelToSnakeCase({
        encryptedString,
        encryptedSymmetricKey,
        authSig,
      })
    )

    const signature = (await signMessage(JSON.stringify(content))) as string

    await publish({
      alias: 'lit_protocol',
      chain_id: chain_id as string,
      data: content,
      mcdata: '',
      meta_contract_id: import.meta.env.VITE_LIT_PROTOCOL_META_CONTRACT_ID,
      method: 'metadata',
      public_key: address.full,
      signature,
      token_address: token_address as string,
      token_id: token_id as string,
      version: version as string,
    })

    setEncrypted({ encryptedString, encryptedSymmetricKey, authSig })
    closeDialog()
  }

  const onDecrypt = async () => {
    if (!encryption) return
    const { encrypted_string, encrypted_symmetric_key, auth_sig } = encryption

    let decrypted = await decrypt({
      accessControlConditions,
      encryptedString: encrypted_string,
      encryptedSymmetricKey: encrypted_symmetric_key,
      authSig: convertSnakeToCamelCase(auth_sig) as AuthSig,
    })

    setKnowledgeBaseURL(decrypted)
  }

  const closeDialog = () => {
    setModalState({ encryptKnowledge: { isOpen: false } })
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment} afterLeave={() => setKnowledgeBaseURL('')}>
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
                    Encrypt Knowlege Base Encryption
                  </Dialog.Title>
                  {/*      <input
                    className="w-full rounded-lg border-black border p-3  text-sm shadow-sm text-black mb-2 "
                    name="tokenAddress"
                    type="text"
                    placeholder="Token Address"
                    value={modal.encryptKnowledge.tokenAddress as string}
                    disabled={true}
                  />

                  <div className="flex gap-2">
                    <input
                      className="w-1/2 rounded-lg border-black border p-3  text-sm shadow-sm text-black"
                      name="chain"
                      type="text"
                      placeholder="Chain"
                      value={modal.encryptKnowledge.chainId as string}
                      disabled={true}
                    />
                    <input
                      className="w-1/2 rounded-lg border-black border p-3 text-sm shadow-sm text-black "
                      name="tokenId"
                      type="text"
                      placeholder="Token ID"
                      value={modal.encryptKnowledge.tokenId as string}
                      disabled={true}
                    />
                  </div>
 */}
                  <input
                    className="w-full rounded-lg border-black border p-3 text-sm shadow-sm block text-black mt-2"
                    name="knowledgeBaseUrl"
                    type="text"
                    placeholder="Knowledge Base URL"
                    value={knowledgeBaseURL as string}
                    onChange={e => setKnowledgeBaseURL(e.target.value)}
                  />
                  <div className="mt-4 flex gap-4 justify-center">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => onEncrypt()}
                    >
                      Encrypt
                    </button>

                    {encryption && (
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => onDecrypt()}
                      >
                        Decrypt
                      </button>
                    )}
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
