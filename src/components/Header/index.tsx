import React, { useEffect } from 'react'
import { Disclosure } from '@headlessui/react'

import { Link } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useNetwork } from 'wagmi'
import { useBoundStore } from 'store'
import { CURRENT_CHAIN } from 'store/slices/wallet.slice'
import logo from '/img/logo.png'
import { CommunityIcon, InventoryIcon, MintIcon } from 'components/Icons/icons'

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
      <div className="mx-auto max-w-[3840px] py-1">
        <div className="relative flex h-16 items-center justify-between px-3">
          <div className="flex flex-shrink-0 items-center">
            <Link to="/">
              <img className="block h-10 w-auto lg:hidden" src={logo} alt="Nous Psyche" />
              <img className="hidden h-16 w-auto lg:block" src={logo} alt="Nous Psyche" />
            </Link>
          </div>
          <div className="flex gap-3 text-white">
            <Link
              to="/mint"
              className="flex items-center gap-2 px-4 h-10 py-2 hover:bg-orange-200 hover:text-orange-800 rounded-lg"
            >
              <MintIcon /> Mint
            </Link>
            {address && (
              <>
                <Link
                  to="/inventory"
                  className="flex items-center gap-2 px-4 h-10 py-2 hover:bg-orange-200 hover:text-orange-800 rounded-lg"
                >
                  <InventoryIcon /> Inventory
                </Link>
              </>
            )}

            <Link
              to="/explorer"
              className="flex items-center gap-2 px-4 h-10 py-2 hover:bg-orange-200 hover:text-orange-800 rounded-lg"
            >
              <CommunityIcon />
              Explorer
            </Link>
          </div>
          <ConnectButton
            chainStatus={'none'}
            accountStatus={{
              smallScreen: 'avatar',
              largeScreen: 'avatar',
            }}
          />
        </div>
      </div>
    </Disclosure>
  )
}
