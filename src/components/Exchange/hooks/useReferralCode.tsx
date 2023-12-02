import { ethers } from 'ethers'
import { useConnectedWallet } from 'hooks/use-connected-wallet'
import { useCallback, useEffect, useState } from 'react'
import { hexToBase58 } from 'utils'
import RPC from 'utils/ethers'

const contractABI = [
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getCode',
    outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'referralCounters',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'currentReferralCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'referralFeePool',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxCodeUsed',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
    name: 'totalCodeUsed',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
]

const useReferralCode = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [refCode, setRefCode] = useState('')
  const [refereeAmount, setRefereeAmount] = useState(0)
  const [totalRefereeAmount, setTotalRefereeAmount] = useState(0)
  const [referralFeePool, setReferralFeePool] = useState(0)
  const [maxCodeUsed, setMaxCodeUsed] = useState(0)
  const [totalCodeUsed, setTotalCodeUsed] = useState(0)
  const [userReward, setUserReward] = useState('')

  const { address } = useConnectedWallet()

  const checkIfHaveCode = useCallback(async () => {
    setError('')

    try {
      const rpc = new RPC(window?.ethereum as any)

      const code = await rpc.readContractData({
        contractABI,
        contractAddress: import.meta.env.VITE_NOUS_REF as string,
        method: 'getCode',
        data: [address?.full],
      })

      setRefCode(`NP-${hexToBase58(code as string)}`)

      const totalCodeUsed = await rpc.readContractData({
        contractABI,
        contractAddress: import.meta.env.VITE_NOUS_REF as string,
        method: 'totalCodeUsed',
        data: [code],
      })

      setTotalCodeUsed(Number(totalCodeUsed))
    } catch (error: any) {
      setError(error.reason as string)
      setRefCode('')
    } finally {
      setIsLoading(false)
    }
  }, [address?.full])

  // Get total use referee
  const getTotalUserReferee = useCallback(async () => {
    try {
      const rpc = new RPC(window?.ethereum as any)

      const refAmount = await rpc.readContractData({
        contractABI,
        contractAddress: import.meta.env.VITE_NOUS_AIFI as string,
        method: 'referralCounters',
        data: [address?.full],
      })

      setRefereeAmount(Number(refAmount))
    } catch (error: any) {
      setError(error.reason as string)
      setRefereeAmount(0)
    }
  }, [address?.full])

  // Get total referee count
  const getTotalReferee = useCallback(async () => {
    try {
      const rpc = new RPC(window?.ethereum as any)

      const refAmount = await rpc.readContractData({
        contractABI,
        contractAddress: import.meta.env.VITE_NOUS_AIFI as string,
        method: 'currentReferralCount',
        data: [],
      })

      setTotalRefereeAmount(Number(refAmount))
    } catch (error: any) {
      setError(error.reason as string)
      setRefereeAmount(0)
    }
  }, [])

  // Get total referee pool
  const getTotalRefereePool = useCallback(async () => {
    try {
      const rpc = new RPC(window?.ethereum as any)

      const pool = await rpc.readContractData({
        contractABI,
        contractAddress: import.meta.env.VITE_NOUS_AIFI as string,
        method: 'referralFeePool',
        data: [],
      })

      setReferralFeePool(Number(pool))
    } catch (error: any) {
      setError(error.reason as string)
      setRefereeAmount(0)
    }
  }, [])

  // Get max code used
  const getTotalMaxCodeUsed = useCallback(async () => {
    try {
      const rpc = new RPC(window?.ethereum as any)

      const amount = await rpc.readContractData({
        contractABI,
        contractAddress: import.meta.env.VITE_NOUS_REF as string,
        method: 'maxCodeUsed',
        data: [],
      })

      setMaxCodeUsed(Number(amount))
    } catch (error: any) {
      setError(error.reason as string)
      setRefereeAmount(0)
    }
  }, [])

  const refetch = useCallback(() => {
    setIsLoaded(false)
  }, [])

  useEffect(() => {
    if (address?.full && !isLoaded) {
      checkIfHaveCode().catch(console.log)
      getTotalUserReferee().catch(console.log)
      getTotalReferee().catch(console.log)
      getTotalRefereePool().catch(console.log)
      getTotalMaxCodeUsed().catch(console.log)
      setIsLoaded(true)
    }

    if (isLoaded && refereeAmount && totalRefereeAmount && referralFeePool) {
      if (totalRefereeAmount == 0) {
        setUserReward(ethers.formatEther('0'.toString()))
        return
      }
      const reward = (refereeAmount / totalRefereeAmount) * referralFeePool
      setUserReward(ethers.formatEther(reward.toString()))
    }
  }, [
    address?.full,
    checkIfHaveCode,
    getTotalMaxCodeUsed,
    getTotalReferee,
    getTotalRefereePool,
    getTotalUserReferee,
    isLoaded,
    refereeAmount,
    referralFeePool,
    totalRefereeAmount,
  ])

  return {
    refetch,
    refCode,
    maxCodeUsed,
    totalCodeUsed,
    refereeAmount,
    totalRefereeAmount,
    referralFeePool,
    userReward,
    isLoading,
    error,
    isSuccess,
  }
}

export default useReferralCode
