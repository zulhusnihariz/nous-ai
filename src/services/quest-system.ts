import questSystemApiInstance from 'adapter/quest-system'

export const getCampaigns = (address?: string) => {
  return questSystemApiInstance({
    method: 'GET',
    url: `/campaigns${address ? `/address/${address}` : ''}`,
  })
}

export const addParticipant = (questId: string, address: string, data?: string) => {
  return questSystemApiInstance({
    method: 'POST',
    url: `/quests/${questId}/participants`,
    data: {
      address,
      data,
    },
  })
}
