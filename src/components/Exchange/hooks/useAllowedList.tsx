import { ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import RPC from 'utils/ethers'

interface Props {
  address?: string
}

const contractABI = [
  {
    inputs: [{ internalType: 'bytes', name: 'referralCode', type: 'bytes' }],
    name: 'enterAllowlistWithReferral',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'isAllowlisted',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
]

const useAllowedList = ({ address }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isAllowed, SetIsAllowed] = useState(false)

  const enterAllowedList = useCallback(async (code: string) => {
    setIsLoading(true)
    setError('')

    try {
      const ethersProvider = new ethers.BrowserProvider(window?.ethereum as any)
      const signer = await ethersProvider.getSigner()
      const contract = new ethers.Contract(import.meta.env.VITE_NOUS_AIFI as string, contractABI, signer)
      const tx = await contract.enterAllowlistWithReferral(code)
      await tx.wait()
    } catch (error: any) {
      console.log(error)
      setError(error.reason as string)
      throw new Error(error.reason as string)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const checkAllowEntry = useCallback(async () => {
    setIsLoading(true)
    setError('')

    try {
      const rpc = new RPC(window?.ethereum as any)

      const allowed = await rpc.readContractData({
        contractABI,
        contractAddress: import.meta.env.VITE_NOUS_AIFI as string,
        method: 'isAllowlisted',
        data: [address!],
      })

      SetIsAllowed(allowed as boolean)
    } catch (error: any) {
      setError(error.reason as string)
      throw new Error(error.reason as string)
    } finally {
      setIsLoading(false)
    }
  }, [address])

  const validateCode = (input: string) => {
    if (input.startsWith('NP-')) {
      return input.substring(3)
    } else {
      throw Error('Invalid referal code')
    }
  }

  useEffect(() => {
    if (address) {
      checkAllowEntry().catch(console.log)
    }
  }, [address, checkAllowEntry, isAllowed])
  return { enterAllowedList, isAllowed, validateCode, isLoading, error }
}

export default useAllowedList
