import apiMoralisInstance from 'adapter/moralis'

export const getNftsByWalletAddress = (address: string, chain: string) => {
  return apiMoralisInstance({
    method: 'GET',
    url: `/${address}/nft?chain=${chain}&token_addresses%5B0%5D=${
      import.meta.env.VITE_NOUS_AI_NFT
    }&format=decimal&media_items=false`,
  })
}

export const getNftsByContractAddress = (token_address: string, chain: string) => {
  return apiMoralisInstance({
    method: 'GET',
    url: `/nft/${token_address}?chain=${chain}&format=decimal&media_items=false`,
  })
}
