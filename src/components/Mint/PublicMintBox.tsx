import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import RPC from 'utils/ethers'
import { useAccount } from 'wagmi'
import useMinting from './hooks'
import GenericButton from 'components/Button/GenericButton'
import TypographyNormal from 'components/Typography/Normal'

const contractABI = [
  {
    inputs: [],
    name: 'mint',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
]

const PublicMintBox = () => {
  const [isDisabled, setDisabled] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isAbleToMint, setIsAbleToMint] = useState(false)
  const { address } = useAccount()

  const { canMint } = useMinting()

  useEffect(() => {
    const checkEligible = async () => {
      const nos = (await canMint()) || 0
      setIsAbleToMint(nos > 0 ? false : true)
      setDisabled(nos > 0 ? true : false)
    }

    if (address) {
      checkEligible().catch(console.log)
    }
  }, [canMint, address])

  const handleOnMintClicked = async () => {
    if (isDisabled) {
      return
    }

    const rpc = new RPC(window?.ethereum as any)

    try {
      await rpc.callContractMethod({
        contractABI,
        contractAddress: import.meta.env.VITE_NOUS_AI_NFT,
        method: 'mint',
        data: [],
        options: {
          value: '0',
        },
      })
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    const isPaused = async () => {
      const rpc = new RPC(window?.ethereum as any)

      const flag: boolean = await rpc.readContractData({
        contractABI,
        contractAddress: import.meta.env.VITE_NOUS_AI_NFT,
        method: 'paused',
        data: [],
      })

      setDisabled(flag)
    }

    if (!isLoaded) {
      isPaused().catch(console.log)
      setIsLoaded(true)
    }
  }, [isLoaded])

  return (
    <>
      <div className="flex flex-col gap-y-4 p-4 mt-4 mb-4 text-center">
        {isLoaded && !isDisabled && address && (
          <GenericButton
            name={'Mint Nous Psyche'}
            onClick={e => handleOnMintClicked()}
            disabled={isLoaded && isDisabled && address}
            className="text-2xl"
            color="yellow"
            textColor="text-yellow-600"
          />
        )}
        {address && !isAbleToMint && (
          <TypographyNormal classNames="text-red-600">Restricted only to a single NFT per wallet</TypographyNormal>
        )}
        {!address && <TypographyNormal classNames="text-md text-white">Connect to your wallet</TypographyNormal>}
      </div>
    </>
  )
}

export default PublicMintBox
