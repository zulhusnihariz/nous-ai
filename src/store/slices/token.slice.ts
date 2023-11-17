import { StateCreator } from 'zustand'
import { resetters } from '..'
import { NftToken } from 'lib/NftToken'
import { Nft } from 'lib'
import { TokenPerk } from 'lib/Perk'

export interface TokenSlice {
  ownedPerks: TokenPerk[]
  selectedNous: Nft | undefined
  setSelectedNous: (nft: Nft | undefined) => void
  setOwnedPerks: (perks: TokenPerk[]) => void
}

const initialData = {
  selectedNous: undefined,
  ownedNfts: [],
  ownedPerks: [],
}

export const createTokenSlice: StateCreator<TokenSlice, [], [], TokenSlice> = set => {
  resetters.push(() => set(initialData))

  return {
    ...initialData,
    setSelectedNous: (nft: Nft | undefined) => {
      set(state => ({ ...state, selectedNous: nft }))
    },
    setOwnedPerks: (perks: TokenPerk[]) => {
      set(state => ({ ...state, ownedPerks: perks }))
    },
  }
}
