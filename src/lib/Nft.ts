export interface Nft {
  owner: string
  token_address: string
  token_id: string | number
  chain_id: string
  metadata: Record<string, any>
  custom?: Custom
  dataKey: string
}

export interface Custom {
  name: string
  description: string
  instructions: string
  conversationStarters: string[]
}
