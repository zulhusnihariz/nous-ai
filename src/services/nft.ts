import apiMoralisInstance from 'adapter/moralis'

export const getNftsByWalletAddress = (address: string, chain: string) => {
  return apiMoralisInstance({
    method: 'GET',
    url: `/${address}/nft?chain=${chain}&format=decimal&media_items=false`,
  })
}

export const getNftsByContractAddress = (token_address: string, chain: string) => {
  return apiMoralisInstance({
    method: 'GET',
    url: `/nft/${token_address}?chain=${chain}&format=decimal&media_items=false`,
  })
}
