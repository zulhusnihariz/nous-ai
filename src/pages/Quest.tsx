import CampaignBox from 'components/CampaignBox'
import SingleCampaignBox from 'components/CampaignBox/SingleCampaign'
import { useConnectedWallet } from 'hooks/use-connected-wallet'
import { useGetCampaigns } from 'repositories/quest-system.repository'

const PageQuest = () => {
  const { address } = useConnectedWallet()
  const { data: campaigns } = useGetCampaigns(address?.full)
  return (
    <>
      <div className="w-4/5 mx-auto grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
        {campaigns && campaigns.map((campaign, index) => <CampaignBox key={index} campaign={campaign} />)}
      </div>
      <SingleCampaignBox />
    </>
  )
}

export default PageQuest
