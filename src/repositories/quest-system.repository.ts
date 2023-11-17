import { useQuery, useMutation } from '@tanstack/react-query'
import { News } from 'lib'
import { Campaign } from 'lib/Quest'
import { RQ_KEY } from 'repositories'
import { getPerkById } from 'services/apollo'
import { addParticipant, getCampaigns } from 'services/quest-system'
import { useQueryClient } from 'wagmi'

const useGetCampaigns = (address?: string) => {
  return useQuery({
    queryKey: [RQ_KEY.GET_QUEST_CAMPAIGNS, address],
    queryFn: async ({ queryKey }) => {
      try {
        const response = await getCampaigns(address)
        const campaigns = response.data as Campaign[]

        for (const campaign of campaigns) {
          const promises = campaign.perkIds?.map(async perkId => {
            const { data: perkData } = await getPerkById(perkId)
            return perkData
          })

          const data = await Promise.all(promises)

          campaign.perks = []
          for (const d of data) {
            if (d.perk) {
              campaign.perks.push(d.perk)
            }
          }
        }

        return campaigns
      } catch (e) {
        console.log(e)
      }
      return []
    },
  })
}

const useAddParticipant = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: { questId: string; address: string; data: string }) => {
      return addParticipant(params.questId, params.address, params.data)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries([RQ_KEY.GET_QUEST_CAMPAIGNS])
    },
  })
}

export { useGetCampaigns, useAddParticipant }
