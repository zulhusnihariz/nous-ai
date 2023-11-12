import { Perk } from 'lib/Perk'
import { useEffect, useState } from 'react'
import { useBoundStore, useNousStore } from 'store'

interface Prop {
  perk: Perk
}

const PerkPrice = ({ price }: { price: String }) => {
  if (price === '0.0') {
    return 'FREE'
  } else {
    return `${price} E`
  }
}

const PerkCard = (prop: Prop) => {
  const [showButton, setShowButton] = useState(false)

  const { setModalState } = useBoundStore()
  const { selectedNous } = useNousStore()

  const onHandleOpenPurchaseModal = () => {
    setModalState({ purchasePerk: { isOpen: true, perk: prop.perk } })
  }

  useEffect(() => {
    if (selectedNous) {
      setShowButton(true)
    } else {
      setShowButton(false)
    }
  }, [selectedNous])

  return (
    <article className="rounded-md bg-white shadow-md shadow-zinc-500">
      <div className="flex items-start sm:gap-8">
        <div>
          <div className="">
            <img className="rounded-t-md" src={prop.perk.banner as string} />
          </div>
          <div className="p-4 cursor-pointer" onClick={onHandleOpenPurchaseModal}>
            <h3 className="text-sm font-medium text-black">{prop.perk.title}</h3>

            <p className="mt-1 text-sm text-gray-600 line-clamp-2">{prop.perk.description}</p>

            <h5 className="mt-4 text-2xl text-gray-800 font-semibold text-end">
              <PerkPrice price={prop.perk.price} />
            </h5>
            {showButton && (
              <div className="flex gap-2">
                <div className="w-1/4 rounded-md bg-white">
                  <img
                    src="https://bafybeiaoeqlodqmdbcaiqg3wsh6xhpxrm7z33ijem5myfy4pgxorcfrkpq.ipfs.nftstorage.link/"
                    className="text-center rounded-md"
                  />
                </div>
                <button
                  onClick={onHandleOpenPurchaseModal}
                  className="block w-full rounded bg-yellow-400 text-yellow-800 text-center p-4 text-sm font-medium transition hover:bg-yellow-300"
                >
                  Buy
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export default PerkCard
