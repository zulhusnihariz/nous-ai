import React, { useEffect, useRef } from 'react'
import { Disclosure } from '@headlessui/react'
import { Link, useLocation } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useNetwork } from 'wagmi'
import { useBoundStore, useNousStore } from 'store'
import { CURRENT_CHAIN } from 'store/slices/wallet.slice'
import logo from '/img/logo.png'
import { CommunityIcon, InventoryIcon, MintIcon, SubscribeIcon } from 'components/Icons/icons'
import { useConnectedWallet } from 'hooks/use-connected-wallet'
import SmallScreenModal from '../Modal/SmallScreenModal'
import { Bars3Icon } from '@heroicons/react/24/outline'
import SocialMedias from './SocialMedias'

export default function Header() {
  const { setCurrentWalletState, setWalletState, setModalState } = useBoundStore()
  const { setSelectedNous } = useNousStore()
  const { address, isConnected } = useAccount()
  const wallet = useConnectedWallet()
  const { chain } = useNetwork()
  const location = useLocation()
  const prevAddressRef = useRef(address)

  useEffect(() => {
    if (isConnected) {
      if (!wallet.address.full) {
        wallet.refreshWallet()
        setSelectedNous(undefined)
        setCurrentWalletState({ chain: chain?.network as CURRENT_CHAIN, address, publicKey: address })
        setWalletState({ evm: { address, publicKey: address, balance: { symbol: chain?.nativeCurrency.symbol } } })
      }

      if (wallet.address.full && address !== prevAddressRef.current) {
        window.location.reload()
      }
    }

    if (!isConnected) setCurrentWalletState({ chain: undefined })

    prevAddressRef.current = address
  }, [address, isConnected])

  const openModal = () => {
    setModalState({ smallMenu: { isOpen: true } })
  }

  return (
    <Disclosure as="nav" className="bg-transparent">
      <div className="mx-auto max-w-[3840px]">
        <div className="relative flex h-16 items-center justify-between px-3">
          <div className="flex flex-shrink-0 items-center">
            <Link to="/">
              <img className="block h-12 w-auto lg:hidden" src={logo} alt="Nous Psyche" />
              <img className="hidden h-16 w-auto lg:block" src={logo} alt="Nous Psyche" />
            </Link>
          </div>
          <div className="flex text-white h-full">
            <Link
              to="/mint"
              className={`hidden sm:flex items-center gap-2 px-4 py-2 h-full border-r border-l hover:bg-blue-600 backdrop-blur bg-black/60 ${
                location.pathname === '/mint' ? 'bg-blue-600/80' : ''
              }`}
            >
              <MintIcon /> Mint
            </Link>
            {address && (
              <>
                <Link
                  to="/inventory"
                  className={`hidden sm:flex items-center gap-2 px-4 py-2 h-full border-r border-l hover:bg-blue-600 backdrop-blur bg-black/60 ${
                    location.pathname === '/inventory' ? 'bg-blue-600/80' : ''
                  }`}
                >
                  <InventoryIcon /> Inventory
                </Link>
              </>
            )}

            <Link
              to="/explorer"
              className={`hidden sm:flex items-center gap-2 px-4 py-2 h-full border-r border-l hover:bg-blue-600 backdrop-blur bg-black/60 ${
                location.pathname === '/explorer' ? 'bg-blue-600/80' : ''
              }`}
            >
              <CommunityIcon />
              Explorer
            </Link>

            <Link
              to="/subscribe"
              className={`hidden sm:flex items-center gap-2 px-4 py-2 h-full border-r border-l hover:bg-blue-600 backdrop-blur bg-black/60 ${
                location.pathname === '/subscribe' ? 'bg-blue-600/80' : ''
              }`}
            >
              <SubscribeIcon />
              Subscribe
            </Link>
          </div>

          <div className="flex justify-between gap-3 items-center">
            <div className="hidden sm:block pr-4">
              <div title="Follow Us On These Platforms">
                <SocialMedias />
              </div>
            </div>
            <div className="block">
              <ConnectButton
                chainStatus={'none'}
                accountStatus={{
                  smallScreen: 'avatar',
                  largeScreen: 'avatar',
                }}
              />
            </div>
            <button type="button" className="block sm:hidden h-8 w-8 text-white" onClick={openModal}>
              <Bars3Icon />
            </button>
          </div>
        </div>
        <div>
          <SmallScreenModal />
        </div>
      </div>
    </Disclosure>
  )
}
