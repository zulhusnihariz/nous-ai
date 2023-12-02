import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import RPC from 'utils/ethers'
import { useAccount } from 'wagmi'
import useMinting from './hooks'
import GenericButton from 'components/Button/GenericButton'
import TypographyNormal from 'components/Typography/Normal'
import { useBoundStore } from 'store'
import { useNavigate } from 'react-router-dom'

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
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isAbleToMint, setIsAbleToMint] = useState(false)
  const { address } = useAccount()

  const { canMint } = useMinting()
  const { setModalState } = useBoundStore()
  const navigate = useNavigate()

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

    setIsLoading(true)

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

      setModalState({
        alert: {
          isOpen: true,
          state: 'success',
          message: 'Minting completed',
          onOkClicked: () => {
            navigate('/inventory')
            window.location.reload()
          },
        },
      })
    } catch (e) {
      setModalState({ alert: { isOpen: true, state: 'failed', message: (e as any).reason } })
      console.log(e)
    } finally {
      setIsLoading(false)
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
            name={isLoading ? 'Processing...' : 'Mint Nous Psyche'}
            onClick={e => handleOnMintClicked()}
            disabled={isLoading || (isLoaded && isDisabled && address)}
            className="text-xl"
            color="yellow"
            textColor="text-yellow-600"
          />
        )}
        {isLoaded && address && !isAbleToMint && (
          <TypographyNormal classNames="text-red-600">Restricted only to a single NFT per wallet</TypographyNormal>
        )}
        {!address && <TypographyNormal classNames="text-md text-white">Connect to your wallet</TypographyNormal>}
      </div>
    </>
  )
}

export default PublicMintBox
