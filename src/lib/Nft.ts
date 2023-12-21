export interface Nft {
  owner: string
  token_address: string
  token_id: string | number
  chain_id: string
  metadata: Record<string, any>
  builder?: Builder
  dataKey: string
}

export interface Builder {
  name: string
  description: string
  category: string
  instructions: string
  conversationStarters: string[]
}
