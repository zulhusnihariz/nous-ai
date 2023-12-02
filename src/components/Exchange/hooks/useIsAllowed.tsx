import { useConnectedWallet } from 'hooks/use-connected-wallet'
import { useCallback, useEffect, useState } from 'react'
import RPC from 'utils/ethers'

const contractABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'isAddressAllowlisted',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

const useCheckAllowedList = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isAllowed, setIsAllowed] = useState(false)

  const { address } = useConnectedWallet()

  const checkIsAllowed = useCallback(async () => {
    setIsLoading(true)
    setError('')
    setIsSuccess(false)

    try {
      const rpc = new RPC(window?.ethereum as any)

      const isAllowed = await rpc.readContractData({
        contractABI,
        contractAddress: import.meta.env.VITE_NOUS_AIFI as string,
        method: 'isAddressAllowlisted',
        data: [address?.full],
      })

      setIsSuccess(true)
      setIsAllowed(isAllowed as boolean)
    } catch (error: any) {
      setError(error.reason as string)
      setIsAllowed(false)
    } finally {
      setIsLoading(false)
    }
  }, [address?.full])

  useEffect(() => {
    if (address?.full) {
      checkIsAllowed().catch(console.log)
    }
  }, [address?.full, checkIsAllowed])

  return { isAllowed, isLoading, error, isSuccess }
}

export default useCheckAllowedList
