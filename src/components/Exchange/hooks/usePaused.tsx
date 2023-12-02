import { useConnectedWallet } from 'hooks/use-connected-wallet'
import { useCallback, useEffect, useState } from 'react'
import RPC from 'utils/ethers'

const contractABI = [
  {
    inputs: [],
    name: 'paused',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
]

const useContractPaused = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const [isPaused, setIsPaused] = useState(true)

  const { address } = useConnectedWallet()

  const checkIfContractPaused = useCallback(async () => {
    setError('')

    try {
      const rpc = new RPC(window?.ethereum as any)

      const isPaused = await rpc.readContractData({
        contractABI,
        contractAddress: import.meta.env.VITE_NOUS_AIFI as string,
        method: 'paused',
        data: [],
      })

      setIsPaused(isPaused as boolean)
    } catch (error: any) {
      setError(error.reason as string)
      setIsPaused(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (address?.full && !isLoaded) {
      checkIfContractPaused().catch(console.log)
      setIsLoaded(true)
    }
  }, [address?.full, checkIfContractPaused, isLoaded])

  return {
    isPaused,
    isLoading,
    isLoaded,
    error,
  }
}

export default useContractPaused
