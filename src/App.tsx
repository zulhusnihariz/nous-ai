import { useEffect, useState } from 'react'
// import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';
// import { connectorsForWallets, RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask'
import { PhantomConnector } from 'phantom-wagmi-connector'
import {
  arbitrum,
  arbitrumGoerli,
  bsc,
  bscTestnet,
  celo,
  celoAlfajores,
  goerli,
  mainnet,
  polygon,
  polygonMumbai,
} from 'wagmi/chains'
import { createConfig, configureChains, WagmiConfig } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import MainLayout from 'layouts/MainLayout'
import './App.css'
// Hook
import { IpfsProvider } from 'hooks/use-ipfs'
import { AlertMessageProvider } from 'hooks/use-alert-message'
// Router
import { Route, Routes } from 'react-router-dom'

import PageIndex from 'pages'
import PageNft from 'pages/nft'
import PageInventory from 'pages/inventory'
import PageRoom from 'pages/Room'
import { ApiProvider } from 'hooks/use-api'
import { LitProtocolProvider } from 'hooks/use-lit-protocol'
import SignInModal from 'components/Modal/SignInModal'
import PublicLayout from 'layouts/PublicLayout'
import PageAdmin from 'pages/admin'

const App = () => {
  return (
    <ApiProvider>
      <LitProtocolProvider>
        <Routes>
          <Route element={<MainLayout children={undefined} />}>
            <Route path="/" element={<PageIndex />} />
            <Route path="/nft" element={<PageNft />} />
            <Route path="/inventory" element={<PageInventory />} />
            <Route path="/admin" element={<PageAdmin />} />
          </Route>
          <Route element={<PublicLayout children={undefined} />}>
            <Route path="/room/:key" element={<PageRoom />} />
          </Route>
        </Routes>
      </LitProtocolProvider>
    </ApiProvider>
  )
}

const currentChain = [
  // mainnet
  arbitrum,
  bsc,
  celo,
  mainnet,
  polygon,
  bsc,
  // tesnet
  arbitrumGoerli,
  bscTestnet,
  celoAlfajores,
  goerli,
  polygonMumbai,
  bscTestnet,
]

// Web3 Configs
const { chains, publicClient } = configureChains(currentChain, [
  infuraProvider({ apiKey: String(import.meta.env.VITE_INFURA_ID) }),
  jsonRpcProvider({
    rpc: chain => {
      return {
        http: `${chain.rpcUrls.default.http}`,
      }
    },
  }),
  publicProvider(),
])

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains }), new PhantomConnector({ chains })],
  publicClient,
})

export function Web3Wrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <WagmiConfig config={wagmiConfig}>
      <IpfsProvider>
        <AlertMessageProvider>{children}</AlertMessageProvider>
      </IpfsProvider>
      <SignInModal />
    </WagmiConfig>
  )
}

export default App
