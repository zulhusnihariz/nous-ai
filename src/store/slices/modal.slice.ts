import { StateCreator } from 'zustand'
import { resetters } from '..'
import { NftMetadata, Transaction, LitProtocolEncryption, NousMetadata } from 'services/rpc'

export type ModalState = {
  isOpen: boolean
  isSkipped?: boolean
}

export type Modal = {
  signUpMain: ModalState
  signUpRainbow: ModalState
  encryptKnowledge: ModalState & Partial<Transaction> & { encryption?: LitProtocolEncryption }
  nftMetadata: ModalState & Partial<Transaction> & { metadata?: NftMetadata }
  nousMetadata: ModalState & Partial<Transaction> & { metadata?: NousMetadata }
}

export interface ModalSlice {
  modal: Modal
  setModalState: (modal: Partial<Modal>) => void
  resetModal: () => void
}

let initialTransaction = {
  token_id: '',
  chain_id: '',
  token_address: '',
  version: '',
}

const initialModal = {
  modal: {
    signUpMain: { isOpen: false },
    signUpRainbow: { isOpen: false },
    encryptKnowledge: { isOpen: false, ...initialTransaction, encryption: undefined },
    nftMetadata: {
      isOpen: false,
      ...initialTransaction,
      metadata: undefined,
    },
    nousMetadata: {
      isOpen: false,
      ...initialTransaction,
      metadata: undefined,
    },
  },
}

export const createModalSlice: StateCreator<ModalSlice, [], [], ModalSlice> = set => {
  resetters.push(() => set(initialModal))

  return {
    ...initialModal,
    setModalState: (modal: Partial<Modal>) => {
      set(state => ({
        modal: Object.assign(state.modal, modal),
      }))
    },
    resetModal: () => {
      set({ ...initialModal })
    },
  }
}
