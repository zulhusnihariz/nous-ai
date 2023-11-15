import { Perk } from './Perk'

export interface Campaign {
  title: String
  description: String
  isOngoing: Boolean
  perkIds: [number]
  perks: Perk[]
  quests: [Quest]
  banner?: String
  merkleTreeRoot?: String
}

export interface Quest {
  _id: string
  title: string
  description: string
  action?: string
  actionData?: string
  actionText?: string
  isParticipated?: boolean
}
