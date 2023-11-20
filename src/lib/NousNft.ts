import { NftMetadata } from './NftMetadata'

export type NousNft = {
  metadata: NftMetadata & { version: string }
  knowledge: string[]
  nous: NousMetadata & { version: string }
  token: {
    address: string
    chain: string
    id: string
  }
  stat: {
    level: string
  }
  achievement: {
    badge: string
  }
}

export interface NousMetadata {
  id: string
}
