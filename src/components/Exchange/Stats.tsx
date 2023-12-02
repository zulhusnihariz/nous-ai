import TypographyNormal from 'components/Typography/Normal'
import useReferralCode from './hooks/useReferralCode'
import GenericButton from 'components/Button/GenericButton'
import { useBoundStore } from 'store'
import { useGetTotalPatreonValue } from 'repositories/patreon.repository'
import { useConnectedWallet } from 'hooks/use-connected-wallet'
import { ethers } from 'ethers'

const ExchangeStats = () => {
  const { setModalState } = useBoundStore()
  const { address } = useConnectedWallet()

  const { data } = useGetTotalPatreonValue(address.full)
  return (
    <>
      <div className="flex items-center justify-between gap-5 px-2 pt-2">
        <div className="flex flex-col">
          <TypographyNormal classNames="uppercase text-sm text-yellow-400 font-semibold tracking-wider">
            SUBSCRIBE VALUE
          </TypographyNormal>
          {data && (
            <TypographyNormal classNames="uppercase text-lg text-white tracking-wider text-bolder">
              {ethers.formatEther(data.toString())} ETH
            </TypographyNormal>
          )}
        </div>
        <div className="">
          <GenericButton name="Referral" onClick={() => setModalState({ referral: { isOpen: true } })} />
        </div>
      </div>
    </>
  )
}

export default ExchangeStats
