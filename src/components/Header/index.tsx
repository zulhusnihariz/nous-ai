import React, { useEffect, useRef } from 'react'
import { Disclosure } from '@headlessui/react'
import { Link, useLocation } from 'react-router-dom'
import { useAccount, useNetwork } from 'wagmi'
import { useBoundStore, useNousStore } from 'store'
import { CURRENT_CHAIN } from 'store/slices/wallet.slice'
import logo from '/img/logo.png'
import { useConnectedWallet } from 'hooks/use-connected-wallet'
import SmallScreenModal from '../Modal/SmallScreenModal'
import SocialMedias from './SocialMedias'
import { CustomConnectButton } from 'components/Button/CustomConnectButton'
import { useAccountModal, useConnectModal } from '@rainbow-me/rainbowkit'
import GenericButton from 'components/Button/GenericButton'
import { Bar3Icon } from 'components/Icons/misc'
import { displayShortAddress } from 'utils'

export default function Header() {
  const { setCurrentWalletState, setWalletState, setModalState } = useBoundStore()
  const { setSelectedNous } = useNousStore()
  const { address, isConnected } = useAccount()
  const wallet = useConnectedWallet()
  const { chain } = useNetwork()
  const prevAddressRef = useRef(address)
  const { openConnectModal } = useConnectModal()
  const { openAccountModal } = useAccountModal()

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
    <Disclosure as="nav" className="bg-black/50 backdrop-blur">
      <div className="mx-auto max-w-[3840px]">
        <div className="relative flex h-16 items-center justify-between px-3">
          <div className="flex gap-2 items-center">
            <GenericButton icon={<Bar3Icon />} onClick={openModal} />
          </div>
          <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 flex flex-shrink-0 items-center">
            <Link to="/">
              <img className="block h-12 w-auto lg:hidden" src={logo} alt="Nous Psyche" />
              <img className="hidden h-14 w-auto lg:block" src={logo} alt="Nous Psyche" />
            </Link>
          </div>
          {!address && <GenericButton name="Login" onClick={openConnectModal} />}
          {address && (
            <div className="text-right text-white cursor-pointer" onClick={openAccountModal}>
              <div className="text-xs text-slate-400 uppercase">WALLET ({chain?.name})</div>
              <div className="flex items-center justify-end gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    chain?.id.toString() === import.meta.env.VITE_DEFAULT_CHAIN_ID ? 'bg-green-500' : 'bg-red-500'
                  }`}
                ></div>
                {displayShortAddress(address)}
              </div>
            </div>
          )}
        </div>
        <div>
          <SmallScreenModal />
        </div>
      </div>
    </Disclosure>
  )
}
