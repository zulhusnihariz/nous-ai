import { useQuery, useMutation } from '@tanstack/react-query'
import { News } from 'lib'
import { Campaign } from 'lib/Quest'
import { RQ_KEY } from 'repositories'
import { getPerkById } from 'services/apollo'
import { addParticipant, getCampaignByTokenId } from 'services/quest-system'
import { useQueryClient } from 'wagmi'

const useGetCampaignsByTokenId = (tokenId?: string) => {
  return useQuery({
    queryKey: [RQ_KEY.GET_QUEST_CAMPAIGNS, tokenId],
    queryFn: async ({ queryKey }) => {
      try {
        const response = await getCampaignByTokenId(tokenId)
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
    enabled: tokenId !== undefined,
    staleTime: 1000,
    refetchOnWindowFocus: true,
  })
}

const useAddParticipant = (tokenId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: { questId: string; token_id: string; data: string }) => {
      return addParticipant(params.questId, params.token_id, params.data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries([RQ_KEY.GET_QUEST_CAMPAIGNS, tokenId]).catch(console.log)
      queryClient.refetchQueries([RQ_KEY.GET_QUEST_CAMPAIGNS, tokenId]).catch(console.log)
    },
  })
}

export { useGetCampaignsByTokenId, useAddParticipant }
