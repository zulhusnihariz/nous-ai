import { useEffect, useState } from 'react'
import { base, mainnet, polygon, polygonMumbai } from 'wagmi/chains'
import { createConfig, configureChains, WagmiConfig } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { alchemyProvider } from 'wagmi/providers/alchemy'
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
import PageNft from 'pages/PageNft'
import PageInventory from 'pages/inventory'
import PageRoom from 'pages/Room'
import { ApiProvider } from 'hooks/use-api'
import { LitProtocolProvider } from 'hooks/use-lit-protocol'
import PublicLayout from 'layouts/PublicLayout'
import PageAdmin from 'pages/admin'
import { RainbowKitProvider, connectorsForWallets, darkTheme, lightTheme, midnightTheme } from '@rainbow-me/rainbowkit'
import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets'
import PageSearch from 'pages/PageSearch'
import PageMint from 'pages/Mint'
import PageBot from 'pages/Bot2'
import PageExplorer from 'pages/Explorer'
import PageContainer from 'pages/Container'
import PageBot2 from 'pages/Bot2'
import PagePerks from 'pages/Perks'
import PageQuest from 'pages/Quest'
import PageExchange from 'pages/Exchange'

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
            <Route path="/mint" element={<PageMint />} />
            <Route path="/explorer" element={<PageExplorer />} />
            <Route path="/bot/:name" element={<PageBot />} />
            <Route path="/bot2" element={<PageBot2 />} />
            <Route path="/search" element={<PageSearch />} />
            <Route path="/perks" element={<PagePerks />} />
            <Route path="/quests" element={<PageQuest />} />
            <Route path="/subscribe" element={<PageExchange />} />
            <Route path="/container/:key" element={<PageContainer />} />
          </Route>
          <Route element={<PublicLayout children={undefined} />}>
            <Route path="/room/:key" element={<PageRoom />} />
          </Route>
        </Routes>
      </LitProtocolProvider>
    </ApiProvider>
  )
}

const currentChain = [base, polygonMumbai]

// Web3 Configs
const { chains, publicClient } = configureChains(currentChain, [
  infuraProvider({ apiKey: String(import.meta.env.VITE_INFURA_ID) }),
  alchemyProvider({ apiKey: String(import.meta.env.VITE_ALCHEMY_ID) }),
  jsonRpcProvider({
    rpc: chain => {
      return {
        http: `${chain.rpcUrls.default.http}`,
      }
    },
  }),
  publicProvider(),
])

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      metaMaskWallet({
        chains,
        projectId: '_',
      }),
    ],
  },
])

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

export function Web3Wrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        theme={lightTheme({
          accentColor: '#ff0000',
          accentColorForeground: 'black',
          borderRadius: 'none',
          fontStack: 'system',
        })}
        modalSize="compact"
        chains={chains}
      >
        <IpfsProvider>
          <AlertMessageProvider>{children}</AlertMessageProvider>
        </IpfsProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App
