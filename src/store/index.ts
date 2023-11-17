import { create } from 'zustand'
import { ModalSlice, createModalSlice } from './slices/modal.slice'
import { WalletSlice, createWalletSlice } from './slices/wallet.slice'
import { TokenSlice, createTokenSlice } from './slices/token.slice'

type ResetAllSlices = { resetAllSlices: () => void }
type BoundStoreType = ModalSlice & ResetAllSlices & WalletSlice
type NousStoreType = TokenSlice

export const resetters: (() => void)[] = []

export const useBoundStore = create<BoundStoreType>()((...a) => ({
  ...createModalSlice(...a),
  ...createWalletSlice(...a),
  resetAllSlices: () => resetters.forEach(resetter => resetter()),
}))

export const useNousStore = create<NousStoreType>()((...a) => ({
  ...createTokenSlice(...a),
  resetAllSlices: () => resetters.forEach(resetter => resetter()),
}))
