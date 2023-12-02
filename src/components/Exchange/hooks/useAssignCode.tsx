import { ethers } from 'ethers'
import { useCallback, useState } from 'react'
import RPC from 'utils/ethers'

const contractABI = [
  { inputs: [], name: 'assignReferralCode', outputs: [], stateMutability: 'nonpayable', type: 'function' },
]

const useAssignCode = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const getRefCode = useCallback(async () => {
    setIsLoading(true)
    setError('')
    setIsSuccess(false)

    try {
      const ethersProvider = new ethers.BrowserProvider(window?.ethereum as any)
      const signer = await ethersProvider.getSigner()
      const contract = new ethers.Contract(import.meta.env.VITE_NOUS_REF as string, contractABI, signer)
      const tx = await contract.assignReferralCode()
      await tx.wait()

      setIsSuccess(true)
    } catch (error: any) {
      console.log(error)
      setError(error.reason as string)
      throw new Error(error.reason as string)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { getRefCode, isLoading, error, isSuccess }
}

export default useAssignCode
