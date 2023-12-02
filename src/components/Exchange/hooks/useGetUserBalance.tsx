import { useCallback, useEffect, useState } from 'react'
import RPC from 'utils/ethers'

const contractABI = [
  {
    inputs: [
      { internalType: 'uint256', name: '', type: 'uint256' },
      { internalType: 'address', name: '', type: 'address' },
    ],
    name: 'balanceKeys',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'keySupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
]

const useUserKeyBalance = (tokenId: string, address: string) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [balance, setIsBalance] = useState(0)
  const [tokenKeyBalance, setTokenKeyBalance] = useState(0)

  const getUserKeyCount = useCallback(async () => {
    setIsLoading(true)
    setError('')
    setIsSuccess(false)

    try {
      const rpc = new RPC(window?.ethereum as any)

      const balance = await rpc.readContractData({
        contractABI,
        contractAddress: import.meta.env.VITE_NOUS_AIFI as string,
        method: 'balanceKeys',
        data: [tokenId, address],
      })

      setIsSuccess(true)
      setIsBalance(Number(balance.toString()))
    } catch (error: any) {
      setError(error.reason as string)
    } finally {
      setIsLoading(false)
    }
  }, [address, tokenId])

  const getTokenKeyCount = useCallback(async () => {
    setIsLoading(true)
    setError('')
    setIsSuccess(false)

    try {
      const rpc = new RPC(window?.ethereum as any)

      const balance = await rpc.readContractData({
        contractABI,
        contractAddress: import.meta.env.VITE_NOUS_AIFI as string,
        method: 'keySupply',
        data: [tokenId],
      })

      setIsSuccess(true)
      setTokenKeyBalance(Number(balance.toString()))
    } catch (error: any) {
      setError(error.reason as string)
    } finally {
      setIsLoading(false)
    }
  }, [tokenId])

  const refetch = useCallback(() => {
    getUserKeyCount().catch(console.log)
    getTokenKeyCount().catch(console.log)
  }, [getTokenKeyCount, getUserKeyCount])

  useEffect(() => {
    if (tokenId) {
      refetch()
    }
  }, [refetch, tokenId])

  return { keyCount: balance, totalTokenKeyCount: tokenKeyBalance, refetch, isLoading, error, isSuccess }
}

export default useUserKeyBalance
