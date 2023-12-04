import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useConnect } from 'wagmi'

export const CustomConnectButton = () => {
  const { connectors, connect } = useConnect()
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        // original custom button template: https://www.rainbowkit.com/docs/custom-connect-button
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated')

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    className="bg-[#FF0000] text-sm p-4 py-3 font-extrabold"
                    onClick={() => connect({ connector: connectors[0] })}
                    type="button"
                  >
                    Connect Wallet
                  </button>
                )
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                )
              }
              return (
                <ConnectButton
                  chainStatus={'none'}
                  accountStatus={{
                    smallScreen: 'avatar',
                    largeScreen: 'avatar',
                  }}
                />
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}
