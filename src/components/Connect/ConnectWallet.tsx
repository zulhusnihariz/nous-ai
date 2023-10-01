import { useAccount, useNetwork } from 'wagmi'
// import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useBoundStore } from 'store'
import { CURRENT_CHAIN } from 'store/slices/wallet.slice'
import { useEffect } from 'react'
import { useConnect } from 'wagmi'
import { MetamaskLogo, PhantomLogo } from 'components/Icons/wallet'

interface WalletProp {
  chain: CURRENT_CHAIN
  chainId: number
}

export default function ConnectWallet(prop: WalletProp) {
  const { setCurrentWalletState, setWalletState, setModalState } = useBoundStore()
  const { isConnected, isDisconnected, address } = useAccount()
  const { chain } = useNetwork()

  useEffect(() => {
    if (isConnected) {
      setModalState({ signUpMain: { isOpen: false } })
      setCurrentWalletState({ chain: chain?.network as CURRENT_CHAIN, address, publicKey: address })
      setWalletState({ evm: { address, publicKey: address, balance: { symbol: chain?.nativeCurrency.symbol } } })
    }

    if (isDisconnected) setCurrentWalletState({ chain: undefined })
  }, [isConnected])

  const { connect, connectors, isLoading, pendingConnector } = useConnect()

  return (
    <div className="flex justify-center">
      <div className="w-2/3 grid gap-4">
        {connectors.map(connector => (
          <button
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connect({ connector, chainId: prop.chainId })}
            className="rounded-xl block w-full border border-gray-300 hover:border-green-800 hover:bg-green-600 hover:bg-opacity-20 px-8 py-4 font-semibold"
          >
            <div className="flex items-center">
              {connector.id === 'metaMask' && (
                <>
                  <MetamaskLogo />
                  <span className="hidden md:block">Metamask</span>
                </>
              )}
              {connector.id === 'phantom' && (
                <>
                  <PhantomLogo />
                  <span className="hidden md:block">Phantom</span>
                </>
              )}

              {!connector.ready && ' (unsupported)'}
              {isLoading && connector.id === pendingConnector?.id && ' (connecting)'}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
