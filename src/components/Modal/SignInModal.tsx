import { Dialog } from '@headlessui/react'
import { useBoundStore } from 'store'
import ConnectSolana from 'components/Connect/ConnectSolana'
import ConnectWallet from 'components/Connect/ConnectWallet'
import ConnectNear from 'components/Connect/ConnectNear'
import { CURRENT_CHAIN } from 'store/slices/wallet.slice'
import { polygon, polygonMumbai } from 'wagmi/chains'
import { useState } from 'react'

const chains = [
  {
    /* name: 'Polygon',
    chain: polygon, */
    name: 'Mumbai',
    chain: polygonMumbai,
    svg: (
      <span role="img" aria-label="Polygon Logo" className="icon-32">
        <svg aria-hidden="true" focusable="false" viewBox="0 0 16 16">
          <path
            fill="#ffffff"
            d="M11.3944 10.7329L14.7152 8.81544C14.8912 8.71358 15 8.52468 15 8.32196V4.48698C15 4.28426 14.8912 4.09538 14.7152 3.99351L11.3944 2.07602C11.2184 1.97417 10.9999 1.97516 10.8248 2.07602L7.50404 3.99351C7.32805 4.09538 7.21925 4.28426 7.21925 4.48698V11.3401L4.89037 12.684L2.56149 11.3401V8.6513L4.89037 7.30737L6.42617 8.19438V6.39062L5.17515 5.66774C5.08911 5.61829 4.99027 5.59159 4.89037 5.59159C4.79046 5.59159 4.69162 5.61829 4.60558 5.66774L1.28481 7.58523C1.10878 7.68709 1 7.876 1 8.07871V11.9137C1 12.1164 1.10878 12.3053 1.28481 12.4071L4.60558 14.3247C4.78157 14.4255 4.99916 14.4255 5.17515 14.3247L8.49593 12.4071C8.67198 12.3053 8.78071 12.1164 8.78071 11.9137V5.05956L8.82225 5.03582L11.1086 3.71563L13.4375 5.05956V7.74842L11.1086 9.09235L9.57481 8.20724V10.0111L10.8238 10.732C10.9999 10.8328 11.2184 10.8328 11.3934 10.732L11.3944 10.7329Z"
          ></path>
        </svg>
      </span>
    ),
  },
]

export default function SignInModal() {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const { modal, setModalState } = useBoundStore()
  return (
    <>
      <Dialog open={modal.signUpMain.isOpen} onClose={() => setModalState({ signUpMain: { isOpen: false } })}>
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed left-1/2 md:w-2/4 top-1/2 -translate-x-1/2 -translate-y-1/2 transform border border-slate-500 bg-blue-900 text-white h-3/4 w-full">
          <Dialog.Panel className="flex justify-center items-center h-full">
            <div className="w-3/4">
              <h3 className="font-semibold text-2xl">Connect</h3>
              <p>
                By connecting a wallet, you agree to Mesolitica's Terms of Service and acknowledge that you have read
                and understood the disclaimers therein.
              </p>
              <div className="mt-5">
                <div className={chains[selectedIndex].name == 'Polygon' ? '' : 'hidden'}>
                  <ConnectWallet chain={CURRENT_CHAIN.POLYGON} chainId={polygon.id} />
                </div>

                <div className={chains[selectedIndex].name == 'Mumbai' ? '' : 'hidden'}>
                  <ConnectWallet chain={CURRENT_CHAIN.MUMBAI} chainId={polygonMumbai.id} />
                </div>
                <div className={chains[selectedIndex].name == 'Solana' ? '' : 'hidden'}>
                  <ConnectSolana />
                </div>
                <div className={chains[selectedIndex].name == 'Near' ? '' : 'hidden'}>
                  <ConnectNear />
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}
