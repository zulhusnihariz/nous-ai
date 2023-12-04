import { Web3AuthConnector } from '@web3auth/web3auth-wagmi-connector'
import { Web3Auth } from '@web3auth/modal'
import { OpenloginAdapter } from '@web3auth/openlogin-adapter'
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from '@web3auth/base'
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider'
import { TorusWalletConnectorPlugin } from '@web3auth/torus-wallet-connector-plugin'

const name = 'Web3Auth'
const iconUrl = 'https://images.web3auth.io/web3auth-logo.svg'

export const web3AuthConnector = ({ chains }: any) => {
  // Create Web3Auth Instance
  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: `${import.meta.env.VITE_DEFAULT_CHAIN_ID_HEX}`,
    rpcTarget: import.meta.env.VITE_INFURA_URL, // This is the public RPC we have added, please pass on your own endpoint while creating an app
    displayName: chains[0].name,
    tickerName: chains[0].nativeCurrency?.name,
    ticker: chains[0].nativeCurrency?.symbol,
    blockExplorer: chains[0].blockExplorers?.default.url,
  }

  const web3AuthInstance = new Web3Auth({
    clientId: import.meta.env.VITE_WEB3AUTH_CLIENT_ID,
    web3AuthNetwork: import.meta.env.VITE_WEB3AUTH_NETWORK,
    chainConfig: {
      chainNamespace: CHAIN_NAMESPACES.EIP155,
      chainId: `${import.meta.env.VITE_DEFAULT_CHAIN_ID_HEX}`,
      rpcTarget: import.meta.env.VITE_INFURA_URL, // This is the public RPC we have added, please pass on your own endpoint while creating an app
    },
    uiConfig: {
      theme: { primary: 'dark' },
      loginMethodsOrder: ['facebook', 'google'],
      defaultLanguage: 'en',
      modalZIndex: '2147483647',
    },
  })

  // Add openlogin adapter for customisations
  const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig },
  })

  const openloginAdapterInstance = new OpenloginAdapter({
    privateKeyProvider,
    adapterSettings: {
      uxMode: 'redirect',
      whiteLabel: {
        appName: 'Web3Auth',
        logoLight: 'https://images.web3auth.io/web3auth-logo.svg',
        logoDark: 'https://images.web3auth.io/web3auth-logo.svg',
        defaultLanguage: 'en',
      },
    },
  })

  web3AuthInstance.configureAdapter(openloginAdapterInstance)

  // Add Torus Wallet Plugin
  const torusPlugin = new TorusWalletConnectorPlugin({
    torusWalletOpts: {
      buttonPosition: 'bottom-left',
    },
    walletInitOptions: {
      whiteLabel: {
        theme: { isDark: false, colors: { primary: '#00a8ff' } },
        logoDark: iconUrl,
        logoLight: iconUrl,
      },
      useWalletConnect: false,
      enableLogging: true,
    },
  })

  web3AuthInstance.addPlugin(torusPlugin)

  return {
    id: 'web3auth',
    name,
    iconUrl,
    iconBackground: '#fff',

    createConnector: () => {
      const connector = new Web3AuthConnector({
        chains: chains,
        options: {
          web3AuthInstance,
          modalConfig: {
            [WALLET_ADAPTERS.WALLET_CONNECT_V2]: {
              label: '',
              showOnModal: false,
            },
            [WALLET_ADAPTERS.TORUS_EVM]: {
              label: '',
              showOnModal: false,
            },
          },
        },
      })
      return {
        connector,
      }
    },
  }
}
