import { AccessControlConditions } from '@lit-protocol/types'
import { useState } from 'react'
import { useLitProtocol } from 'hooks/use-lit-protocol'

const PageAdmin = () => {
  const accessControlConditions: AccessControlConditions = [
    {
      contractAddress: '',
      standardContractType: '',
      chain: import.meta.env.VITE_DEFAULT_LINEAGE_CHAIN,
      method: 'eth_getBalance',
      parameters: [':userAddress'],
      //params: [':userAddress'],
      conditionType: 'evmBasic',
      returnValueTest: {
        comparator: '=',
        value: '0', // '0xba21Df4cF0e779F46CAdd58CCf5a24Ce2512d09e0',
      },
    },
  ]

  const [text, setText] = useState<string>('')

  const [encrypted, setEncrypted] = useState({
    encryptedString: '',
    encryptedSymmetricKey: '',
  })

  const [decrypted, setDecrypted] = useState('')

  const { encrypt, decrypt } = useLitProtocol()

  const onEncrypt = async () => {
    let { encryptedString, encryptedSymmetricKey } = await encrypt({ text, accessControlConditions })

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
          <p>Encrypted: {encrypted.encryptedString ?? '-'} </p>
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
