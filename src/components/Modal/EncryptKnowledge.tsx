import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBoundStore } from 'store'
import { AccessControlConditions, AuthSig } from '@lit-protocol/types'
import { useConnectedWallet } from 'hooks/use-connected-wallet'
import { useLitProtocol } from 'hooks/use-lit-protocol'
import { usePublishTransaction } from 'repositories/rpc.repository'
import { convertCamelToSnakeCase } from 'utils'
import { v4 } from 'uuid'

export const accessControlConditions: AccessControlConditions = [
  {
    contractAddress: '',
    standardContractType: '',
    chain: import.meta.env.VITE_DEFAULT_LINEAGE_CHAIN,
    method: 'eth_getBalance',
    parameters: [':userAddress'],
    conditionType: 'evmBasic',
    returnValueTest: {
      comparator: '=',
      value: '0',
    },
  },
]

interface Prop {
  chainId: String
  tokenAddress: String
  tokenId: String
}

const EncryptKnowledgeModal = (prop: Prop) => {
  const navigate = useNavigate()

  const { modal, setModalState } = useBoundStore()
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
      alias: '',
      chain_id: prop.chainId as string,
      data: content,
      mcdata: '',
      meta_contract_id: import.meta.env.VITE_LIT_PROTOCOL_META_CONTRACT_ID,
      method: 'metadata',
      public_key: address.full,
      signature,
      token_address: import.meta.env.VITE_NOUS_AI_NFT,
      token_id: prop.tokenId as string,
      version: v4(),
    })

    setEncrypted({ encryptedString, encryptedSymmetricKey, authSig })
  }

  // const onDecrypt = async () => {
  //   if (!encrypted.encryptedString) return

  //   const { encryptedString, encryptedSymmetricKey, authSig } = encrypted

  //   const decrypted = await decrypt({ accessControlConditions, encryptedString, encryptedSymmetricKey, authSig })
  //   setDecrypted(decrypted)
  // }

  const closeDialog = () => {
    setModalState({ encryptKnowledge: { isOpen: false } })
  }

  return (
    <>
      <Transition appear show={modal.encryptKnowledge.isOpen} as={Fragment} afterLeave={() => setKnowledgeBaseURL('')}>
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
                  <input
                    className="w-full rounded-lg border-black border p-3  text-sm shadow-sm text-black mb-2 "
                    name="tokenAddress"
                    type="text"
                    placeholder="Token Address"
                    value={prop.tokenAddress as string}
                    disabled={true}
                  />

                  <div className="flex gap-2">
                    <input
                      className="w-1/2 rounded-lg border-black border p-3  text-sm shadow-sm text-black"
                      name="chain"
                      type="text"
                      placeholder="Chain"
                      value={prop.chainId as string}
                      disabled={true}
                    />
                    <input
                      className="w-1/2 rounded-lg border-black border p-3 text-sm shadow-sm text-black "
                      name="tokenId"
                      type="text"
                      placeholder="Token ID"
                      value={prop.tokenId as string}
                      disabled={true}
                    />
                  </div>

                  <input
                    className="w-full rounded-lg border-black border p-3 text-sm shadow-sm block text-black mt-2"
                    name="knowledgeBaseUrl"
                    type="text"
                    placeholder="Knowledge Base URL"
                    value={knowledgeBaseURL as string}
                    onChange={e => setKnowledgeBaseURL(e.target.value)}
                  />
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => onEncrypt()}
                    >
                      Encrypt
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
