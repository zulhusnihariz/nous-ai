import questSystemApiInstance from 'adapter/quest-system'

export const getCampaignByTokenId = (tokenId?: string) => {
  return questSystemApiInstance({
    method: 'GET',
    url: `/campaigns/token/${tokenId}`,
  })
}

export const addParticipant = (questId: string, tokenId: string, data?: string) => {
  return questSystemApiInstance({
    method: 'POST',
    url: `/quests/${questId}/participants`,
    data: {
      tokenId,
      data,
    },
  })
}
