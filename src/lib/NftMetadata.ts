export type NftMetadata = {
  attributes: Array<{ trait_type: string; value: string }>
  external_url?: string
  description: string
  image: string
  name: string
}
