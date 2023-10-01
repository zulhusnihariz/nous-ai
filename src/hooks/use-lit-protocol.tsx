import { createContext, useContext, useEffect, useState } from 'react'
import LitProtocol, { DecryptStringArgs, EncryptStringArgs } from 'utils/lit-protocol'

interface LitProtocolContextInterface {
  isLitConnected: boolean
  encrypt: (data: EncryptStringArgs) => ReturnType<InstanceType<typeof LitProtocol>['encryptString']>
  decrypt: (data: DecryptStringArgs) => ReturnType<InstanceType<typeof LitProtocol>['decryptString']>
}

export const LitProtocolContext = createContext<LitProtocolContextInterface | undefined>(undefined)

export const useLitProtocol = () => {
  const context = useContext(LitProtocolContext)
  if (!context) {
    throw new Error('useLitProtocol must be used within a LitProtocolProvider')
  }
  return context
}

interface LitProtocolProviderProps {
  children: React.ReactNode
}

export const LitProtocolProvider: React.FC<LitProtocolProviderProps> = ({ children }) => {
  const [isLitConnected, setIsLitConnected] = useState(false)
  const [client, setClient] = useState<LitProtocol>()

  useEffect(() => {
    async function init() {
      if (!isLitConnected) {
        const client = new LitProtocol(import.meta.env.VITE_DEFAULT_LINEAGE_CHAIN)
        await client.connect()
        setIsLitConnected(true)
        setClient(client)
      }
    }

    init()
  }, [])

  const encrypt = async (data: EncryptStringArgs) => {
    if (!client) throw Error('Lit Protocol has not been initialized')

    return await client.encryptString(data)
  }
  const decrypt = async (data: DecryptStringArgs) => {
    if (!client) throw Error('Lit Protocol has not been initialized')
    return await client.decryptString(data)
  }

  return (
    <LitProtocolContext.Provider value={{ isLitConnected, encrypt, decrypt }}>
      <div>{children}</div>
    </LitProtocolContext.Provider>
  )
}
