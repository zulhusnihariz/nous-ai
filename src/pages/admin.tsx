import { AccessControlConditions } from '@lit-protocol/types'
import { useState } from 'react'
import { useLitProtocol } from 'hooks/use-lit-protocol'
import { usePublishTransaction } from 'repositories/rpc.repository'
import { convertCamelToSnakeCase } from 'utils'
import { v4 } from 'uuid'
import { useConnectedWallet } from 'hooks/use-connected-wallet'
const PageAdmin = () => {
  const [text, setText] = useState<string>('')

  const [encrypted, setEncrypted] = useState({
    encryptedString: '',
    encryptedSymmetricKey: '',
  })

  const [decrypted, setDecrypted] = useState('')

  const { address, signMessage } = useConnectedWallet()
  const { encrypt, decrypt } = useLitProtocol()
  const { mutateAsync: publish } = usePublishTransaction()

  const accessControlConditions: AccessControlConditions = [
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

  const onEncrypt = async () => {
    let { encryptedString, encryptedSymmetricKey, authSig } = await encrypt({ text, accessControlConditions })

    const content = JSON.stringify(
      convertCamelToSnakeCase({
        encryptedString,
        encryptedSymmetricKey,
        authSig,
      })
    )

    const signature = (await signMessage(JSON.stringify(content))) as string

    const res = await publish({
      alias: '',
      chain_id: import.meta.env.VITE_DEFAULT_LINEAGE_CHAIN,
      data: content,
      mcdata: JSON.stringify({ loose: 0 }),
      meta_contract_id: import.meta.env.VITE_META_CONTRACT_ID,
      method: 'metadata',
      public_key: address.full as string,
      signature,
      token_address: import.meta.env.VITE_NOUS_AI_NFT,
      token_id: '',
      version: v4(),
    })
    console.log('res', res)

    setEncrypted({ encryptedString, encryptedSymmetricKey })
  }

  const onDecrypt = async () => {
    if (!encrypted.encryptedString) return

    const { encryptedString, encryptedSymmetricKey } = encrypted

    let decrypted = await decrypt({ accessControlConditions, encryptedString, encryptedSymmetricKey })
    setDecrypted(decrypted)
  }

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-xl font-bold mb-10">Encrypt text</h1>

        <label className="text-left" htmlFor="text">
          Text to encrypt:
        </label>
        <br />
        <input className="text-black" name="text" type="text" value={text} onChange={e => setText(e.target.value)} />
        <div className="mt-2">
          <p>Encrypted: {encrypted.encryptedString ?? '-'}</p>
          <button
            onClick={() => onEncrypt()}
            className="rounded-sm bg-gradient-to-t from-[#7224A7] to-[#FF3065] px-4 py-2"
          >
            Encrypt
          </button>

          <p>Decrypted: {decrypted ?? '-'} </p>
          <button
            onClick={() => onDecrypt()}
            className="rounded-sm bg-gradient-to-t from-[#7224A7] to-[#FF3065] px-4 py-2"
          >
            Decrypt
          </button>
        </div>
      </div>
    </div>
  )
}

export default PageAdmin
