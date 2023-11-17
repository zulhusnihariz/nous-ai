import { Dialog, Transition } from '@headlessui/react'
import { useBoundStore, useNousStore } from 'store'
import { Fragment } from 'react'
import TwitterFollowButton from 'components/TwitterFollowButton'
import { useAddParticipant } from 'repositories/quest-system.repository'
import { useConnectedWallet } from 'hooks/use-connected-wallet'

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
  const { mutateAsync: submit } = useAddParticipant()
  const { address } = useConnectedWallet()

  const onHandleActionTrigger = async () => {
    if (!address.full) {
      return
    }

    await submit({
      questId,
      address: address?.full,
      data: '',
    })
  }

  switch (action) {
    case 'join_twitter':
      return (
        <a
          className="rounded-md bg-gray-50 px-5 py-2 text-center text-sm font-semibold text-gray-500"
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
            className="rounded-md bg-gray-50 px-5 py-2 text-center text-sm font-semibold text-gray-500"
            href={actionData}
            target="_blank"
          >
            {actionText}
          </a>
          <a
            className="ml-2 rounded-md bg-gray-50 px-5 py-2 text-center text-sm font-semibold text-gray-500"
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
          className="rounded-md bg-gray-50 px-5 py-2 text-center text-sm font-semibold text-gray-500"
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
          className="rounded-md bg-gray-50 px-5 py-2 text-center text-sm font-semibold text-gray-500"
          href={actionData}
          target="_blank"
          onClick={onHandleActionTrigger}
        >
          {actionText}
        </a>
      )
  }
}

const SingleCampaignBox = () => {
  const { modal, setModalState } = useBoundStore()
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
              <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
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
              <div className="fixed left-1/2 md:w-2/4 top-1/2 -translate-x-1 -translate-y-1/2 transform rounded-lg bg-gray-900 text-white h-full w-full">
                <Dialog.Panel className="h-full">
                  <div className="w-full p-4 flex justify-between gap-2">
                    <button
                      onClick={() => setModalState({ campaign: { isOpen: false, campaign: undefined } })}
                      className="mt-2 inline-block w-full rounded-md bg-gray-50 px-5 py-3 text-center text-sm font-semibold text-gray-500 sm:mt-0 sm:w-auto"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="flex flex-col justify-center p-4">
                    <h3 className="font-semibold text-2xl">{modal.campaign.campaign?.title}</h3>
                    <p className="mt-1 text-sm text-gray-400 line-clamp-2">{modal.campaign.campaign?.description}</p>
                    <div className="mt-10">
                      <h4 className="text-gray-400 text-sm">Reward Perks</h4>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        {modal.campaign.campaign?.perks &&
                          modal.campaign.campaign?.perks.map((perk, index) => {
                            return (
                              <div key={index} className="p-3 bg-slate-800 rounded-lg text-md">
                                <div>{perk?.title}</div>
                                <p className="text-xs text-gray-500">{perk.description}</p>
                              </div>
                            )
                          })}
                      </div>
                    </div>
                    <hr className="h-px my-8 border-0 bg-gray-700" />
                    <div className="flex flex-col gap-2">
                      {modal.campaign.campaign?.quests.map((quest, index) => (
                        <div className="rounded-lg flex bg-black/80 px-5 py-5 items-center" key={index}>
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
                              <span className="uppercase text-xs text-slate-400">Submitted</span>
                            )}
                          </div>
                        </div>
                      ))}
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
