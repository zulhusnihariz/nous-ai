import React, { useEffect } from 'react'
import { Disclosure } from '@headlessui/react'

import { Link } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useNetwork } from 'wagmi'
import { useBoundStore } from 'store'
import { CURRENT_CHAIN } from 'store/slices/wallet.slice'
import logo from '/img/logo.png'

export default function Header() {
  const { setCurrentWalletState, setWalletState } = useBoundStore()
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()

  useEffect(() => {
    if (isConnected) {
      setCurrentWalletState({ chain: chain?.network as CURRENT_CHAIN, address, publicKey: address })
      setWalletState({ evm: { address, publicKey: address, balance: { symbol: chain?.nativeCurrency.symbol } } })
    }

    if (!isConnected) setCurrentWalletState({ chain: undefined })
  }, [isConnected])

  return (
    <Disclosure as="nav" className="bg-transparent">
      <div className="mx-auto max-w-[3840px] py-5">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center sm:items-stretch sm:justify-start">
            <div className="flex flex-shrink-0 items-center">
              <Link to="/">
                <img className="block h-10 w-auto lg:hidden" src={logo} alt="Collabeat" />
                <img className="hidden h-20 w-auto lg:block" src={logo} alt="Collabeat" />
              </Link>
            </div>
          </div>
          <ConnectButton />
        </div>
      </div>
    </Disclosure>
  )
}
