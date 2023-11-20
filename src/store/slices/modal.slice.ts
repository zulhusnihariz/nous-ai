import { StateCreator } from 'zustand'
import { resetters } from '..'
import { Transaction } from 'services/rpc'
import { NftMetadata } from 'lib'
import { Perk } from 'lib/Perk'
import { Campaign } from 'lib/Quest'
import { NousMetadata } from 'lib/NousNft'

export type ModalState = {
  isOpen: boolean
  isSkipped?: boolean
}

export type Modal = {
  signUpMain: ModalState
  signUpRainbow: ModalState
  encryptKnowledge: ModalState & Partial<Transaction> & { knowledge?: string[] }
  nftMetadata: ModalState & Partial<Transaction> & { metadata?: NftMetadata }
  nousMetadata: ModalState & Partial<Transaction> & { metadata?: NousMetadata }
  viewKnowledge: ModalState & {
    url: string
  }
  apiKey: ModalState & { key: string }
  purchasePerk: ModalState & { perk: Perk | undefined }
  selectNous: ModalState
  campaign: ModalState & { campaign?: Campaign }
  alert: ModalState & { state: string } & { message: string }
}

export interface ModalSlice {
  modal: Modal
  setModalState: (modal: Partial<Modal>) => void
  resetModal: () => void
}

const initialTransaction = {
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
    viewKnowledge: {
      isOpen: false,
      url: '',
    },
    apiKey: {
      isOpen: false,
      key: '',
    },
    purchasePerk: {
      isOpen: false,
      perk: undefined,
    },
    tokenSelection: {
      isOpen: false,
      selectedTokenId: -1,
    },
    selectNous: {
      isOpen: false,
    },
    campaign: {
      isOpen: false,
      campaign: undefined,
    },
    alert: {
      isOpen: false,
      state: '',
      message: '',
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
