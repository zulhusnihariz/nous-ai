import { Dialog, Transition } from '@headlessui/react'
import { useBoundStore, useNousStore } from 'store'
import { Fragment, useEffect, useState } from 'react'
import { useAddParticipant } from 'repositories/quest-system.repository'
import TypographyNormal from 'components/Typography/Normal'
import GenericButton from 'components/Button/GenericButton'
import { useNavigate } from 'react-router-dom'

const Actions = ({
  questId,
  action,
  actionData,
  actionText,
}: {
  questId: string
  action: string
  actionData: string
  actionText: string
}) => {
  const { selectedNous } = useNousStore()
  const { setModalState } = useBoundStore()
  const { mutateAsync: submit, isError, isSuccess } = useAddParticipant(selectedNous?.token_id as string)

  const [inputValue, setInputValue] = useState<Record<string, string>>({})

  const onHandleActionTrigger = async () => {
    if (!selectedNous?.token_id) {
      return
    }

    let data = ''
    if (action === 'twitter_post') {
      data = inputValue[questId]?.trim()
      if (!data) {
        return
      }
    }

    await submit({
      questId,
      token_id: selectedNous?.token_id as string,
      data,
    })
  }

  const onHandleActionInput = (e: any) => {
    setInputValue({ ...inputValue, [questId]: e.target.value })
  }

  useEffect(() => {
    if (isSuccess) {
      setModalState({
        alert: { isOpen: true, state: 'success', message: `Quest submitted` },
      })
    }

    if (isError) {
      setModalState({
        alert: { isOpen: true, state: 'failed', message: `Quest error` },
      })
    }
  }, [isSuccess, isError, setModalState])

  switch (action) {
    case 'join_twitter':
      return (
        <a
          className="bg-gray-50 px-5 py-2 text-center text-sm font-semibold text-gray-500"
          href={actionData}
          target="_blank"
          onClick={onHandleActionTrigger}
        >
          Join Twitter
        </a>
      )
    case 'tweet_twitter':
      return (
        <div className="">
          <a
            className="bg-gray-50 px-5 py-2 text-center text-sm font-semibold text-gray-500"
            href={actionData}
            target="_blank"
          >
            {actionText}
          </a>
          <a
            className="ml-2 bg-gray-50 px-5 py-2 text-center text-sm font-semibold text-gray-500"
            href=""
            onClick={onHandleActionTrigger}
          >
            Verify
          </a>
        </div>
      )
    case 'join_discord':
      return (
        <a
          className="bg-gray-50 px-5 py-2 text-center text-sm font-semibold text-gray-500"
          href={actionData}
          target="_blank"
          onClick={onHandleActionTrigger}
        >
          Join Discord
        </a>
      )
    case 'go_to_url':
      return (
        <a
          className="bg-gray-50 px-5 py-2 text-center text-sm font-semibold text-gray-500"
          href={actionData}
          target="_blank"
          onClick={onHandleActionTrigger}
        >
          {actionText}
        </a>
      )
    case 'twitter_post':
      return (
        <>
          <input
            className="py-2 mr-1 px-1 text-black text-xs"
            placeholder={actionText}
            value={inputValue[questId] ?? ''}
            onChange={e => onHandleActionInput(e)}
          />
          <button
            className="bg-gray-50 px-5 py-2 text-center text-sm font-semibold text-gray-500 h-full"
            onClick={() => onHandleActionTrigger()}
          >
            Submit
          </button>
        </>
      )
  }
}

const SingleCampaignBox = () => {
  const { modal, setModalState } = useBoundStore()
  const navigate = useNavigate()

  return (
    <>
      {modal.campaign.campaign && (
        <Transition appear show={modal.campaign.isOpen} as={Fragment}>
          <Dialog as="div" onClose={() => setModalState({ campaign: { isOpen: false, campaign: undefined } })}>
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
              <div className="fixed left-1/2 md:w-2/4 top-1/2 -translate-x-1 -translate-y-1/2 transform backdrop-blur bg-blue-600/80 ring-1 ring-white text-white h-full w-full">
                <Dialog.Panel className="">
                  <div className="flex flex-col justify-center">
                    <h3 className="font-semibold text-2xl p-4 bg-blue-500/70">
                      <TypographyNormal>{modal.campaign.campaign?.title}</TypographyNormal>
                    </h3>
                    <p className="mt-2 text-sm text-white px-4">
                      <TypographyNormal>{modal.campaign.campaign?.description}</TypographyNormal>
                    </p>
                    <div className="mt-3 px-4">
                      <h4 className="text-yellow-400 text-sm">
                        <TypographyNormal>Reward Perks</TypographyNormal>
                      </h4>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {modal.campaign.campaign?.perks &&
                          modal.campaign.campaign?.perks.map((perk, index) => {
                            return (
                              <div key={index} className="line-clamp-1 p-3 bg-slate-800 text-md">
                                <div>{perk?.title}</div>
                              </div>
                            )
                          })}
                      </div>
                    </div>
                    <hr className="h-px mt-8 border-0 bg-gray-300" />
                    <div className="relative w-full h-full">
                      {modal.campaign.campaign.merkleTreeRoot && (
                        <div className="right-0 text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                          <GenericButton name="Claim Perk" onClick={() => navigate('/perks')} color="yellow" />
                        </div>
                      )}
                      <div
                        className={`flex flex-col ${modal.campaign.campaign.isOngoing ? 'bg-blue-600/40 blur' : ''}`}
                      >
                        {modal.campaign.campaign?.quests.map((quest, index) => (
                          <div
                            className="flex border-b px-5 bg-blue-800/50 backdrop-blur py-5 items-center"
                            key={index}
                          >
                            <div className="flex-1">
                              <span>{quest.title}</span>
                            </div>
                            <div>
                              {!quest.isParticipated && (
                                <Actions
                                  questId={quest._id}
                                  action={quest.action!}
                                  actionData={quest.actionData!}
                                  actionText={quest.actionText!}
                                />
                              )}
                              {quest.isParticipated && (
                                <>
                                  <span className="uppercase text-xs text-slate-400">Submitted</span>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="absolute bottom-0 w-full">
                      <div className="w-full px-5 py-2 flex justify-between gap-2">
                        <GenericButton
                          name="Cancel"
                          onClick={() => setModalState({ campaign: { isOpen: false, campaign: undefined } })}
                        />
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </div>
            </Transition.Child>
          </Dialog>
        </Transition>
      )}
    </>
  )
}

export default SingleCampaignBox
