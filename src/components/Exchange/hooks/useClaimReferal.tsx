import { ethers } from 'ethers'
import { useCallback, useState } from 'react'

const contractABI = [
  { inputs: [], name: 'claimReferralFee', outputs: [], stateMutability: 'nonpayable', type: 'function' },
]

const useClaimReferral = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const claimReferralFee = useCallback(async () => {
    setIsLoading(true)
    setError('')
    setIsSuccess(false)

    try {
      const ethersProvider = new ethers.BrowserProvider(window?.ethereum as any)
      const signer = await ethersProvider.getSigner()
      const contract = new ethers.Contract(import.meta.env.VITE_NOUS_AIFI as string, contractABI, signer)
      const tx = await contract.claimReferralFee()
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

  return { claimReferralFee, isLoading, error, isSuccess }
}

export default useClaimReferral
