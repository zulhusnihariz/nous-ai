import React, { createContext, useContext } from 'react'
import { getNftsByWalletAddress, getNftsByContractAddress } from 'services/nft'
import rpc from 'services/rpc'

interface ApiContextProps {
  getNftsByWalletAddress: typeof getNftsByWalletAddress
  getNftsByContractAddress: typeof getNftsByContractAddress
  rpc: typeof rpc
}

interface ApiProviderProps {
  children: React.ReactNode
}

export const ApiContext = createContext<ApiContextProps | undefined>({
  getNftsByWalletAddress,
  getNftsByContractAddress,
  rpc,
})

export const useApi = () => {
  const context = useContext(ApiContext)
  if (!context) {
    throw new Error('useApi must be used within a ApiProvider')
  }
  return context
}

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  return (
    <ApiContext.Provider value={{ getNftsByWalletAddress, getNftsByContractAddress, rpc }}>
      {children}
    </ApiContext.Provider>
  )
}
