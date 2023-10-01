import '@near-wallet-selector/modal-ui/styles.css'
import { setupModal } from '@near-wallet-selector/modal-ui'
import { setupWalletSelector } from '@near-wallet-selector/core'
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet'
import MyNearIconUrl from '@near-wallet-selector/my-near-wallet/assets/my-near-wallet-icon.png'
import { NearLogo } from 'components/Icons/wallet'

export default function ConnectNear() {
  async function onClickConnect() {
    const selector = await setupWalletSelector({
      network: 'testnet',
      modules: [
        setupMyNearWallet({
          walletUrl: 'https://testnet.mynearwallet.com',
          //@ts-ignore
          iconUrl: MyNearIconUrl,
        }),
      ],
    })

    const modal = setupModal(selector, {
      contractId: `${process.env.CONTRACT_NAME}`,
    })

    modal.show()
  }

  return (
    <div className="flex justify-center">
      <div className="w-2/3 grid gap-4">
        <button
          onClick={() => onClickConnect()}
          className="rounded-xl block w-full border border-gray-300 hover:border-green-800 hover:bg-green-600 hover:bg-opacity-20 px-8 py-4 font-semibold"
        >
          <div className="flex items-center">
            <NearLogo />
            <span className="hidden md:block">Near</span>
          </div>
        </button>
      </div>
    </div>
  )
}
