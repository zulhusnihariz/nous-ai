import TypographyNormal from 'components/Typography/Normal'
import { Campaign } from 'lib/Quest'
import { useBoundStore } from 'store'

interface Prop {
  campaign: Campaign
  selectedIndex: string
  onCampaignClicked: (id: string) => void
}

const CampaignBox = ({ campaign, selectedIndex, onCampaignClicked }: Prop) => {
  const { setModalState } = useBoundStore()

  const onHandleBoxClicked = () => {
    setModalState({ campaign: { isOpen: true, campaign } })
    onCampaignClicked(campaign._id)
  }
  return (
    <>
      <article
        className={`shadow-xs ring-1 ring-white cursor-pointer hover:bg-yellow-600 backdrop-blur ${
          selectedIndex === campaign._id ? 'bg-yellow-700' : 'bg-blue-700'
        }`}
        onClick={() => onHandleBoxClicked()}
      >
        <div className="flex flex-col h-full justify-between gap-4 p-4">
          <div>
            <h3 className="font-medium text-white text-lg">
              <TypographyNormal>{campaign.title}</TypographyNormal>
            </h3>

            <p className="line-clamp-2 text-sm text-gray-200">
              <TypographyNormal>{campaign.description}</TypographyNormal>
            </p>
          </div>
          {campaign.quests.some(quest => quest.isParticipated) && (
            <div className="flex justify-end">
              <strong className="-mb-[2px] -me-[2px] inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>

                <span className="text-[10px] font-medium sm:text-xs">Joined!</span>
              </strong>
            </div>
          )}
        </div>
      </article>
    </>
  )
}

export default CampaignBox
