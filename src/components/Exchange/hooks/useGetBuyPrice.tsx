import { ethers } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import RPC from 'utils/ethers'

interface Prop {
  tokenId: string
  amount: number
}

const contractABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'getBuyPrice',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'getBuyPriceAfterFee',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
]

const useGetBuyPrice = ({ tokenId, amount }: Prop) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [buyPrice, setBuyPrice] = useState('0')
  const [buyPriceAfterTax, setBuyPriceAfterTax] = useState('0')

  const getBuyPrice = useCallback(async () => {
    setIsLoading(true)
    setError('')

    if (amount == 0) {
      setBuyPrice(`0`)
      return
    }

    try {
      const rpc = new RPC(window?.ethereum as any)

      const price: string = await rpc.readContractData({
        contractABI,
        contractAddress: import.meta.env.VITE_NOUS_AIFI as string,
        method: 'getBuyPrice',
        data: [tokenId, amount.toString()],
      })

      const subscribePrice = price === '0.0' ? `0` : ethers.formatEther(price.toString())
      setBuyPrice(subscribePrice.toString())
    } catch (error: any) {
      setError(error.reason as string)
      throw new Error(error.reason as string)
    } finally {
      setIsLoading(false)
    }
  }, [amount, tokenId])

  const getBuyPriceAfterTax = useCallback(async () => {
    setIsLoading(true)
    setError('')

    if (amount == 0) {
      setBuyPrice(`0`)
      return
    }

    try {
      const rpc = new RPC(window?.ethereum as any)

      const price: string = await rpc.readContractData({
        contractABI,
        contractAddress: import.meta.env.VITE_NOUS_AIFI as string,
        method: 'getBuyPriceAfterFee',
        data: [tokenId, amount.toString()],
      })

      const subscribePrice = price === '0' ? `0` : ethers.formatEther(price.toString())
      setBuyPriceAfterTax(subscribePrice.toString())
    } catch (error: any) {
      setError(error.reason as string)
      throw new Error(error.reason as string)
    } finally {
      setIsLoading(false)
    }
  }, [amount, tokenId])

  useEffect(() => {
    const timer = setTimeout(async () => {
      await getBuyPrice().catch(console.log)
      await getBuyPriceAfterTax().catch(console.log)
    }, 1000)

    return () => clearTimeout(timer)
  }, [getBuyPrice, getBuyPriceAfterTax])

  return { buyPrice, buyPriceAfterTax, isLoading, error }
}

export default useGetBuyPrice
