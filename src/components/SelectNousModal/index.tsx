import { Dialog } from '@headlessui/react'
import { Nft } from 'lib'
import { useEffect, useState } from 'react'
import { useGetNftByWalletAddress } from 'repositories/moralis.repository'
import { useGetPerkByTokenId } from 'repositories/perk.repository'
import { useGetOwnedNousMetadatas } from 'repositories/rpc.repository'
import { useBoundStore, useNousStore } from 'store'
import { useAccount } from 'wagmi'

const SelectNousModal = () => {
  const [tokenId, setTokenId] = useState(-1)
  const { modal, setModalState } = useBoundStore()
  const { setSelectedNous, setOwnedPerks } = useNousStore()

  const { address } = useAccount()
  const { data: owned } = useGetNftByWalletAddress({
    address: address as string,
    chain: import.meta.env.VITE_DEFAULT_CHAIN_NAME,
  })

  const { data: nfts } = useGetOwnedNousMetadatas(address as string, owned?.map(el => `${el.token_id}`) ?? [])
  const { data: token } = useGetPerkByTokenId(tokenId)

  const [nous, setNous] = useState<Nft | null>()

  const onHandleSelect = () => {
    if (!nous) return
    setSelectedNous(nous)
    setTokenId(nous.token_id as number)
    setModalState({ selectNous: { isOpen: false } })
  }

  const onHandleClickSelect = (nft: Nft) => {
    if (nous && nous.token_id === nft.token_id) {
      setNous(null)
    } else {
      setNous(nft)
    }
  }

  useEffect(() => {
    if (token) {
      console.log(token)
      const perks = token.map(perk => ({ id: perk?.id }))
      setOwnedPerks(perks)
    }
  }, [setOwnedPerks, token])

  return (
    <>
      <Dialog
        open={modal.selectNous.isOpen}
        onClose={() => setModalState({ purchasePerk: { isOpen: false, perk: undefined } })}
      >
        <div className="fixed inset-0 bg-black/80" aria-hidden="true" />
        <div className="fixed left-1/2 md:w-2/4 top-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-slate-900 text-white h-2/5 w-full">
          <Dialog.Panel className="h-full p-4">
            <h3 className="font-semibold text-2xl">Select your Nous Psyche</h3>
            <div className="flex gap-2 p-2 overflow-x-auto mt-2 justify-center">
              {nfts?.map((nft, index) => (
                <div key={index}>
                  <img
                    className={`h-32 w-32 rounded-md cursor-pointer ${
                      nous?.token_id === nft.token_id ? 'ring-4 ring-green-300' : ''
                    }`}
                    src={nft.metadata.image}
                    onClick={() => onHandleClickSelect(nft)}
                  />
                </div>
              ))}
            </div>
            <div className="w-full pl-9 flex justify-between gap-2 fixed bottom-5 right-5">
              <button
                onClick={() => setModalState({ selectNous: { isOpen: false } })}
                className="mt-2 inline-block w-full rounded-md bg-gray-50 px-5 py-3 text-center text-sm font-semibold text-gray-500 sm:mt-0 sm:w-auto"
              >
                Not now
              </button>
              {nfts && nfts?.length > 0 && (
                <button
                  onClick={onHandleSelect}
                  className={`mt-2 inline-block w-full rounded-md  px-5 py-3 text-center text-sm font-semibold sm:mt-0 sm:w-auto ${
                    !nous ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'bg-green-500 text-white'
                  }`}
                >
                  Select
                </button>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}

export default SelectNousModal
