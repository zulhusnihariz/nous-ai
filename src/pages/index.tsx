import { useBoundStore } from 'store'
import { useConnectedWallet } from 'hooks/use-connected-wallet'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const PageIndex = () => {
  const navigate = useNavigate()

  const { setModalState, current } = useBoundStore()
  useConnectedWallet()

  useEffect(() => {
    if (current) {
      navigate('/inventory')
    }
  })

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="text-center">
        <h3>Connect wallet to use Nous AI Studio</h3>
        <div className="mt-2">
          <button
            onClick={() => setModalState({ signUpMain: { isOpen: true } })}
            className="rounded-sm bg-gradient-to-t from-[#7224A7] to-[#FF3065] px-4 py-2"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  )
}

export default PageIndex
