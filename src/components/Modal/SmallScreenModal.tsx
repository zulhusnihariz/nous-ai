import { Dialog, Transition } from '@headlessui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { CommunityIcon, InventoryIcon, MintIcon } from 'components/Icons/icons'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { useBoundStore } from 'store'
import { useAccount } from 'wagmi'
import SocialMedias from '../Header/SocialMedias'

const SmallScreenModal = () => {
  const { modal, setModalState } = useBoundStore()

  const { isOpen } = modal.smallMenu
  const { address } = useAccount()

  const closeDialog = () => {
    setModalState({ smallMenu: { isOpen: false } })
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment} afterLeave={() => closeDialog()}>
        <Dialog as="div" className="relative z-10" onClose={() => closeDialog()}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full h-screen text-center transform overflow-hidden rounded-md bg-blue-900 p-6 align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-white flex justify-between py-6 px-4"
                  >
                    <p>Welcome to Nous!</p>
                    <button
                      onClick={() => {
                        closeDialog()
                      }}
                      className="hover:text-red-500"
                    >
                      X
                    </button>
                  </Dialog.Title>
                  <div className="relative flex items-center justify-between text-white">
                    <div className="flex flex-col w-full">
                      {/*                   
                      Should be here.    
                      <ConnectButton
                        chainStatus={'none'}
                        accountStatus={{
                          smallScreen: 'avatar',
                          largeScreen: 'avatar',
                        }}
                      /> */}
                      <Link
                        to="/mint"
                        className={`flex items-center gap-2 px-4 py-5 h-full hover:bg-blue-700 
                        `}
                        onClick={() => {
                          closeDialog()
                        }}
                      >
                        <MintIcon /> <span className="pl-4">Mint</span>
                      </Link>
                      <hr />
                      {address && (
                        <>
                          <Link
                            to="/inventory"
                            className={`flex items-center gap-2 px-4 py-5 h-full hover:bg-blue-700 `}
                            onClick={() => {
                              closeDialog()
                            }}
                          >
                            <InventoryIcon /> <span className="pl-4">Inventory</span>
                          </Link>
                          <hr />
                        </>
                      )}

                      <Link
                        to="/explorer"
                        className={`flex items-center gap-2 px-4 py-5 h-full hover:bg-blue-700
                        `}
                        onClick={() => {
                          closeDialog()
                        }}
                      >
                        <CommunityIcon />
                        <span className="pl-4">Explorer</span>
                      </Link>
                      <hr />
                      <div className="text-white pt-10">
                        <p>Follow Us On These Platforms!</p>
                        <div className="p-4">
                          <SocialMedias />
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default SmallScreenModal
