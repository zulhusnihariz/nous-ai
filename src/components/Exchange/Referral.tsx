import { Dialog, Transition } from '@headlessui/react'
import { useBoundStore } from 'store'
import { Fragment } from 'react'
import TypographyNormal from 'components/Typography/Normal'
import GenericButton from 'components/Button/GenericButton'
import useReferralCode from './hooks/useReferralCode'
import ExchangeAssignRefCodeButton from './AssignCodeButton'
import useClaimReferral from './hooks/useClaimReferal'
import useClipboard from 'hooks/useClipboard'

const ReferralBox = () => {
  const { modal, setModalState } = useBoundStore()
  const { refCode, totalCodeUsed, maxCodeUsed, refereeAmount, totalRefereeAmount, userReward, refetch } =
    useReferralCode()
  const { claimReferralFee, isLoading } = useClaimReferral()
  const copyToClipboard = useClipboard()

  const onClickClaim = async () => {
    try {
      await claimReferralFee()
      refetch()
      setModalState({
        alert: {
          isOpen: true,
          state: 'success',
          message: `Successfully claim referral fee`,
        },
      })
    } catch (e) {
      setModalState({
        alert: {
          isOpen: true,
          state: 'failed',
          message: `Failed to claim referral fee: ${(e as any).reason}`,
        },
      })
    }
  }

  const onClickCopy = async (text: string) => {
    await copyToClipboard(text)
  }
  return (
    <>
      <Transition appear show={modal.referral.isOpen} as={Fragment}>
        <Dialog as="div" onClose={() => setModalState({ referral: { isOpen: false } })}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-blue-800/40 backdrop-blur" aria-hidden="true" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-out duration-300 transform"
            enterFrom="opacity-0 translate-x-full"
            enterTo="opacity-100 translate-x-0"
            leave="transition ease-in duration-200 transform"
            leaveFrom="opacity-100 translate-x-0"
            leaveTo="opacity-0 translate-x-full"
          >
            <div className="fixed left-1/2 lg:w-2/4 md:w-full top-1/2 -translate-x-1 -translate-y-1/2 transform backdrop-blur bg-blue-600/80 ring-1 ring-white text-white h-full">
              <Dialog.Panel className="w-full">
                <div className="flex flex-col justify-center">
                  <h3 className="font-semibold text-2xl p-4 bg-blue-500/70">
                    <TypographyNormal>Referral</TypographyNormal>
                  </h3>
                  <div className="flex flex-col p-4 gap-3">
                    <div className="">
                      <TypographyNormal classNames="text-left uppercase text-md text-yellow-400 font-semibold tracking-wider">
                        REFERRAL CODE
                      </TypographyNormal>
                      <div
                        className="text-left flex items-center gap-3 justify-start cursor-pointer"
                        onClick={() => onClickCopy(refCode)}
                      >
                        {refCode && <TypographyNormal classNames="text-sm text-white">{refCode}</TypographyNormal>}
                        {!refCode && <ExchangeAssignRefCodeButton />}
                      </div>
                    </div>
                    <div className="">
                      <TypographyNormal classNames="text-left uppercase text-md text-yellow-400 font-semibold tracking-wider">
                        REFERRAL CODE USAGE
                      </TypographyNormal>
                      <div className="text-left flex items-center gap-3 justify-start">
                        <TypographyNormal classNames="uppercase text-lg text-white">
                          {totalCodeUsed}/{maxCodeUsed}
                        </TypographyNormal>
                      </div>
                    </div>
                    <div className="flex gap-4 justify-between">
                      <div className="">
                        <TypographyNormal classNames="text-left uppercase text-md text-yellow-400 font-semibold tracking-wider">
                          REFERRAL AMOUNT
                        </TypographyNormal>
                        <div className="text-left flex items-center gap-3 justify-start">
                          <TypographyNormal classNames="uppercase text-lg text-white">{refereeAmount}</TypographyNormal>
                        </div>
                      </div>
                      <div className="">
                        <TypographyNormal classNames="text-left uppercase text-md text-yellow-400 font-semibold tracking-wider">
                          RATIO
                        </TypographyNormal>
                        <div className="text-left flex items-center gap-3 justify-start">
                          <TypographyNormal classNames="uppercase text-lg text-white">
                            {totalRefereeAmount > 0 && (refereeAmount / totalRefereeAmount) * 100}
                            {totalRefereeAmount == 0 && 0} %
                          </TypographyNormal>
                        </div>
                      </div>
                      <div className="">
                        <TypographyNormal classNames="text-left uppercase text-md text-yellow-400 font-semibold tracking-wider">
                          REFERRAL REWARD
                        </TypographyNormal>
                        <div className="text-left flex items-center gap-3 justify-start">
                          <TypographyNormal classNames="uppercase text-lg text-white">
                            {userReward.length > 0 ? userReward : 0} ETH
                          </TypographyNormal>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="h-px border-0 bg-gray-300" />

                  <div className="absolute bottom-0 w-full">
                    <div className="w-full px-5 py-2 flex justify-between gap-2">
                      <GenericButton
                        name={isLoading ? 'Processing' : 'Claim'}
                        onClick={onClickClaim}
                        disabled={userReward.length <= 0 || isLoading}
                      />
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  )
}

export default ReferralBox
