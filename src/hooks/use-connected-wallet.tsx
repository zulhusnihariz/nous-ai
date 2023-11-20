import { useEffect, useState } from 'react'
import { useBoundStore } from 'store'
import { CURRENT_CHAIN } from 'store/slices/wallet.slice'

import { useChainId, useBalance, useAccount, useSignMessage, useDisconnect } from 'wagmi'
import { abbreviateETHBalance, shortenAddress } from 'utils'

export function useConnectedWallet() {
  const { current, wallet, setCurrentWalletState, setWalletState } = useBoundStore()

  const [address, setAddress] = useState({ display: '', full: '' })

  const { address: evmAddress } = useAccount()
  const evmChainId = useChainId()
  const { disconnectAsync: wagmiDisconnect, isSuccess } = useDisconnect()
  const { data: evmBalance } = useBalance({ address: evmAddress })
  const { signMessageAsync } = useSignMessage({})

  function setConnectedAddress() {
    switch (current.chain) {
      case CURRENT_CHAIN.POLYGON:
      case CURRENT_CHAIN.MUMBAI:
      case CURRENT_CHAIN.MATIC_MUMBAI:
      case CURRENT_CHAIN.BASE:
        setAddress({ display: shortenAddress(`${evmAddress}`), full: `${evmAddress}` })
        return
    }
  }

  function getBalance() {
    if (!current.chain) return

    switch (current.chain) {
      case CURRENT_CHAIN.POLYGON:
      case CURRENT_CHAIN.MUMBAI:
      case CURRENT_CHAIN.MATIC_MUMBAI:
      case CURRENT_CHAIN.BASE:
        {
          const ethBalance = evmBalance == null ? void 0 : evmBalance.formatted
          const displayBalance = ethBalance ? abbreviateETHBalance(parseFloat(ethBalance)) : void 0

          setCurrentWalletState({ balance: { formatted: displayBalance ?? '0', symbol: evmBalance?.symbol ?? '' } })
        }
        break
      default:
        break
    }
  }

  function refreshWallet() {
    setConnectedAddress()
    getBalance()
  }

  async function signMessage(message: string) {
    switch (current.chain) {
      case CURRENT_CHAIN.POLYGON:
      case CURRENT_CHAIN.MUMBAI:
      case CURRENT_CHAIN.MATIC_MUMBAI:
      case CURRENT_CHAIN.BASE:
        try {
          return await signMessageAsync({ message })
        } catch (e) {
          return e
        }
    }
  }

  /**
   * @description disconnect wallet based on current connected chain
   */
  async function disconnect() {
    switch (current.chain) {
      case CURRENT_CHAIN.POLYGON:
      case CURRENT_CHAIN.MUMBAI:
      case CURRENT_CHAIN.MATIC_MUMBAI:
      case CURRENT_CHAIN.BASE:
        await wagmiDisconnect()
        setWalletState({ evm: { address: '' } })
        break
      default:
        break
    }

    setCurrentWalletState({ chain: undefined, address: '', publicKey: '', balance: { formatted: '', symbol: '' } })
    setAddress({ display: '', full: '' })
  }

  useEffect(() => {
    function setConnectedBalance() {
      getBalance()
    }

    setConnectedAddress()
    setConnectedBalance()
  }, [current.chain, evmChainId])

  return { address, disconnect, signMessage, refreshWallet }
}
