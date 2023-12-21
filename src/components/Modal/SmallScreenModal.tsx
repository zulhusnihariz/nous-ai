import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { useBoundStore } from 'store'
import { useAccount } from 'wagmi'
import GenericButton from 'components/Button/GenericButton'
import { MenuCloseIcon } from 'components/Icons/icons'

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
            <div className="fixed inset-0 bg-blue-600/40 backdrop-blur" />
          </Transition.Child>

          <Transition.Child as={Fragment}>
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex items-center justify-center fixed left-1/2 w-full lg:w-2/4 bottom-0 -translate-x-1/2 -translate-y-0 transform">
                <Dialog.Panel className="w-full p-2 transform overflow-hidden bg-blue-900/80 backdrop-blur align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-white flex justify-between">
                    <GenericButton
                      icon={<MenuCloseIcon />}
                      onClick={() => {
                        closeDialog()
                      }}
                    />
                  </Dialog.Title>
                  <div className="relative flex items-center justify-between text-white mt-6">
                    <div className="flex flex-col w-full gap-4 px-4">
                      <Link
                        to="/mint"
                        className={`h-full uppercase tracking-widest sm:text-md md:text-xl hover:text-yellow-400
                        `}
                        onClick={() => {
                          closeDialog()
                        }}
                      >
                        <span className="">Mint</span>
                      </Link>
                      {address && (
                        <>
                          <Link
                            to="/inventory"
                            className={`h-full uppercase tracking-widest sm:text-md md:text-xl hover:text-yellow-400`}
                            onClick={() => {
                              closeDialog()
                            }}
                          >
                            <span className="">Inventory</span>
                          </Link>
                        </>
                      )}

                      {/* {address && (
                        <>
                          <Link
                            to="/subscribe"
                            className={`h-full uppercase tracking-widest sm:text-md md:text-xl hover:text-yellow-400`}
                            onClick={() => {
                              closeDialog()
                            }}
                          >
                            <span className="">Subscription</span>
                          </Link>
                        </>
                      )}

                      <Link
                        to="/explorer"
                        className={`h-full uppercase tracking-widest sm:text-md md:text-xl hover:text-yellow-400`}
                        onClick={() => {
                          closeDialog()
                        }}
                      >
                        <span className="">Explorer</span>
                      </Link> */}

                      <div className="py-2 flex flex-col gap-2">
                        <Link
                          to=""
                          className={`h-full uppercase tracking-widest sm:text-md md:text-md hover:text-yellow-400
                        `}
                          onClick={() => {
                            window.open(
                              'https://nous-psyche.notion.site/Glossary-64da36bc10314f619259c8585b1cd44d',
                              '_blank'
                            )
                          }}
                        >
                          <span className="">Whitepaper</span>
                        </Link>
                        <Link
                          to=""
                          className={`h-full uppercase tracking-widest sm:text-md md:text-md hover:text-yellow-400
                        `}
                          onClick={() => {
                            window.open('https://twitter.com/thenouspsyche', '_blank')
                          }}
                        >
                          <span className="">Twitter</span>
                        </Link>
                        <Link
                          to=""
                          className={`h-full uppercase tracking-widest sm:text-md md:text-md hover:text-yellow-400
                        `}
                          onClick={() => {
                            window.open('https://discord.com/invite/96xkTdHF6p', '_blank')
                          }}
                        >
                          <span className="">Discord</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </div>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  )
}

export default SmallScreenModal
