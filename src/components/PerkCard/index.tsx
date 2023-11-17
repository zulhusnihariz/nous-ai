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
  const [showButton, setShowButton] = useState(true)
  const [isOwned, setIsOwned] = useState(false)

  const { setModalState } = useBoundStore()
  const { selectedNous, ownedPerks } = useNousStore()

  const onHandleOpenPurchaseModal = () => {
    setModalState({ purchasePerk: { isOpen: true, perk: prop.perk } })
  }

  useEffect(() => {
    if (ownedPerks.length > 0) {
      const isPerkIncluded = ownedPerks.some(perk => {
        return perk.id.toString() === prop.perk.id.toString()
      })
      setIsOwned(isPerkIncluded)
    }
  }, [ownedPerks, prop.perk.id, selectedNous])

  return (
    <article className="rounded-md bg-white shadow-md shadow-zinc-500">
      <div className="flex items-start sm:gap-8">
        <div className="group relative block overflow-hidden w-full">
          {isOwned && !prop.perk.isRepurchaseable && (
            <div className="absolute end-0 z-5 p-1.5 text-gray-900 transition bg-green-300 rounded-tr-md">
              <button className="block w-full rounded uppercase text-green-800 text-center text-xs font-medium">
                Upgraded
              </button>
            </div>
          )}
          {!prop.perk.forSale && (
            <div className="absolute end-0 z-10 p-1.5 text-gray-900 transitio bg-yellow-300 rounded-tr-md">
              <button className="block w-full rounded uppercase text-yellow-800 text-center text-xs font-medium">
                NOT FOR SALE
              </button>
            </div>
          )}
          <img className="rounded-t-md object-cover h-20 w-full" src={prop.perk.banner as string} />
          <div className="p-4 cursor-pointer" onClick={onHandleOpenPurchaseModal}>
            <h3 className="text-sm font-medium text-black">{prop.perk.title}</h3>

            <p className="mt-1 text-sm text-gray-600 line-clamp-2">{prop.perk.description}</p>

            <h5 className="mt-3 text-2xl text-gray-800 font-semibold text-end">
              <PerkPrice price={prop.perk.price} />
            </h5>
            {showButton && (
              <div className="flex gap-2">
                {prop.perk.forSale && (
                  <>
                    <div
                      className="w-1/4 rounded-md bg-white"
                      onClick={e => {
                        e.stopPropagation()
                        setModalState({ selectNous: { isOpen: true } })
                      }}
                    >
                      <img src={selectedNous?.metadata.image} className="text-center rounded-md" />
                    </div>
                    {!isOwned && (
                      <button
                        onClick={onHandleOpenPurchaseModal}
                        className="block w-full rounded bg-yellow-400 text-yellow-800 text-center p-4 text-sm font-medium transition hover:bg-yellow-300"
                      >
                        Buy
                      </button>
                    )}
                    {isOwned && prop.perk.isRepurchaseable && (
                      <button
                        onClick={onHandleOpenPurchaseModal}
                        className="block w-full rounded bg-yellow-400 text-yellow-800 text-center p-4 text-sm font-medium transition hover:bg-yellow-300"
                      >
                        Buy
                      </button>
                    )}
                    {isOwned && !prop.perk.isRepurchaseable && (
                      <button
                        onClick={onHandleOpenPurchaseModal}
                        className="block w-full rounded bg-green-400 text-green-800 text-center p-4 text-sm font-medium transition hover:bg-green-300"
                      >
                        Equip
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export default PerkCard
