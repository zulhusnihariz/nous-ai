import { AccessControlConditions, AuthSig } from '@lit-protocol/types'
import { useState } from 'react'
import { useLitProtocol } from 'hooks/use-lit-protocol'
import { usePublishTransaction } from 'repositories/rpc.repository'
import { convertCamelToSnakeCase } from 'utils'
import { v4 } from 'uuid'
import { useConnectedWallet } from 'hooks/use-connected-wallet'

interface EncryptedKnowledgeBase {
  tokenAddress: String
  chain: String
  tokenId: String
  knowledgeBaseUrl: String
}

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

const PageAdmin = () => {
  const [tokenData, setTokenData] = useState<EncryptedKnowledgeBase>({
    tokenAddress: '',
    chain: '',
    tokenId: '',
    knowledgeBaseUrl: '',
  })

  const onHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTokenData(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

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
    if (!tokenData.knowledgeBaseUrl) return

    const { encryptedString, encryptedSymmetricKey, authSig } = await encrypt({
      text: tokenData.knowledgeBaseUrl as string,
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
      chain_id: tokenData.chain as string,
      data: content,
      mcdata: '',
      meta_contract_id: import.meta.env.VITE_META_CONTRACT_ID,
      method: 'metadata',
      public_key: address.full,
      signature,
      token_address: import.meta.env.VITE_NOUS_AI_NFT,
      token_id: tokenData.tokenId as string,
      version: '',
    })

    setEncrypted({ encryptedString, encryptedSymmetricKey, authSig })
  }

  // const onDecrypt = async () => {
  //   if (!encrypted.encryptedString) return

  //   const { encryptedString, encryptedSymmetricKey, authSig } = encrypted

  //   const decrypted = await decrypt({ accessControlConditions, encryptedString, encryptedSymmetricKey, authSig })
  //   setDecrypted(decrypted)
  // }

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="text-center w-full mx-auto mb-0 mt-8 max-w-md space-y-4">
        <h1 className="text-xl font-bold mb-10 w-full">Encrypt Knowlege Base Encryption</h1>

        <input
          className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm text-black"
          name="tokenAddress"
          type="text"
          placeholder="Token Address"
          value={tokenData.tokenAddress as string}
          onChange={e => onHandleChange(e)}
        />

        <input
          className="w-1/2 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm text-black"
          name="chain"
          type="text"
          placeholder="Chain"
          value={tokenData.chain as string}
          onChange={e => onHandleChange(e)}
        />
        <input
          className="w-1/2 rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm text-black"
          name="tokenId"
          type="text"
          placeholder="Token ID"
          value={tokenData.tokenId as string}
          onChange={e => onHandleChange(e)}
        />
        <input
          className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm block text-black"
          name="knowledgeBaseUrl"
          type="text"
          placeholder="Knowledge Base URL"
          value={tokenData.knowledgeBaseUrl as string}
          onChange={e => onHandleChange(e)}
        />
        <div className="mt-2">
          <button
            onClick={() => onEncrypt()}
            className="rounded-sm bg-gradient-to-t from-[#7224A7] to-[#FF3065] px-4 py-2"
          >
            Encrypt
          </button>
        </div>
      </div>
    </div>
  )
}

export default PageAdmin
