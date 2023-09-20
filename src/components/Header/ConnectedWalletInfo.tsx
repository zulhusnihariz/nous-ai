import { useConnectedWallet } from 'hooks/use-connected-wallet'
import { useBoundStore } from 'store'

export function ConnectedWalletInfo() {
  const { disconnect, address } = useConnectedWallet()
  const { current } = useBoundStore()

  return (
    <>
      <div className="flex rounded-lg bg-[#1A1B1F]">
        <p className="px-4 py-2">{`${current.balance.formatted} ${current.balance.symbol}`}</p>
        <p className="rounded-lg bg-[#38393C] px-4 py-2 font-bold"> {address.display}</p>
      </div>
      <button
        style={{
          fontSize: '16px',
          padding: '15px',
          fontWeight: 'bold',
          borderRadius: '5px',
          margin: '15px auto',
        }}
        onClick={() => disconnect()}
      >
        Disconnect
      </button>
    </>
  )
}
