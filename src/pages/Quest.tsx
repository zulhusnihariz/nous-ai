import CampaignBox from 'components/CampaignBox'
import SingleCampaignBox from 'components/CampaignBox/SingleCampaign'
import { useState } from 'react'
import { useGetCampaignsByTokenId } from 'repositories/quest-system.repository'
import { useNousStore } from 'store'

const PageQuest = () => {
  const [selectedIndex, setSelectedIndex] = useState('')

  const { selectedNous } = useNousStore()
  const { data: campaigns } = useGetCampaignsByTokenId(selectedNous?.token_id as string)

  const onHandleCampaignClicked = (id: string) => {
    setSelectedIndex(id)
  }
  return (
    <>
      <div className="w-4/5 mx-auto grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
        {campaigns &&
          campaigns.map((campaign, index) => (
            <CampaignBox
              key={index}
              campaign={campaign}
              selectedIndex={selectedIndex}
              onCampaignClicked={onHandleCampaignClicked}
            />
          ))}
      </div>
      <SingleCampaignBox />
    </>
  )
}

export default PageQuest
