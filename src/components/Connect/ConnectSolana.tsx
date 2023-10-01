import { useBoundStore } from 'store'
import { useEffect } from 'react'
import { PhantomProvider } from 'lib/Phantom'
import { CURRENT_CHAIN } from 'store/slices/wallet.slice'
import { PhantomLogo } from 'components/Icons/wallet'

export default function ConnectSolana() {
  const { current, setCurrentWalletState, setWalletState, setModalState } = useBoundStore()

  useEffect(() => {
    const getProvider = (): PhantomProvider | undefined => {
      if ('solana' in window) {
        // @ts-ignore
        const provider = window.solana as any
        if (provider.isPhantom) return provider as PhantomProvider
      }
    }

    setWalletState({ phantom: { provider: getProvider() } })
  }, [])

  /**
   * @description prompts user to connect wallet if it exists
   */
  const connectWallet = async () => {
    // @ts-ignore
    const { solana } = window

    if (solana) {
      try {
        const response = await solana.connect()
        setWalletState({
          phantom: { address: response.publicKey.toString(), publicKey: response.publicKey.toString() },
        })
        setCurrentWalletState({ chain: CURRENT_CHAIN.SOLANA })
        setModalState({ signUpMain: { isOpen: false } })
      } catch (err) {
        // { code: 4001, message: 'User rejected the request.' }
      }
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-2/3 grid gap-4">
        {current.chain === undefined && (
          <button
            onClick={() => connectWallet()}
            className="rounded-xl block w-full border border-gray-300 hover:border-green-800 hover:bg-green-600 hover:bg-opacity-20 px-8 py-4 font-semibold"
          >
            <div className="flex items-center">
              <PhantomLogo />
              <span className="hidden md:block">Phantom</span>
            </div>
          </button>
        )}
      </div>
    </div>
  )
}
