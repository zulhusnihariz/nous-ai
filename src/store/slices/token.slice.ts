import { StateCreator } from 'zustand'
import { resetters } from '..'
import { NftToken } from 'lib/NftToken'
import { Nft } from 'lib'

export interface TokenSlice {
  ownedNfts: NftToken[]
  selectedNous: Nft | undefined
  setSelectedNous: (nft: Nft | undefined) => void
  setOwnedNfts: (nfts: NftToken[]) => void
}

const initialData = {
  selectedNous: undefined,
  ownedNfts: [],
}

export const createTokenSlice: StateCreator<TokenSlice, [], [], TokenSlice> = set => {
  resetters.push(() => set(initialData))

  return {
    ...initialData,
    setSelectedNous: (nft: Nft | undefined) => {
      set(state => ({ ...state, selectedNous: nft }))
    },
    setOwnedNfts: (nfts: NftToken[]) => {
      set(state => ({ ...state, ownedNfts: nfts }))
    },
  }
}
