import TypographyNormal from 'components/Typography/Normal'
import { Perk } from 'lib/Perk'
import PurchaseButton from 'components/PerkCard/PurchaseButton'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useNousStore } from 'store'
import { useEffect, useState } from 'react'
import EquipButton from './EquipButton'

interface Prop {
  perk: Perk
}

const PerkPrice = ({ perk }: { perk: Perk }) => {
  if (!perk.forSale) {
    return 'NOT FOR SALE'
  }

  if (perk.price === '0.0') {
    return 'FREE'
  } else {
    return `${perk.price} ETH`
  }
}

const DisplayPerk = ({ perk }: Prop) => {
  const [isOwned, setIsOwned] = useState(false)
  const [error, setError] = useState('')

  const { selectedNous, ownedPerks } = useNousStore()

  const onReceivedError = (error: string) => {
    setError(error)
  }

  useEffect(() => {
    if (ownedPerks.length > 0 && perk) {
      const isPerkIncluded = ownedPerks.some(ownedPerk => {
        return perk.id.toString() === ownedPerk?.id
      })

      setIsOwned(isPerkIncluded)
    }

    if (perk.id) {
      setError('')
    }
  }, [ownedPerks, perk])
  return (
    <>
      <div className="m-3 h-full">
        <div className="bg-black/40 ring-1 ring-white backdrop-blur border border-blue-600 shadow-2xl h-full">
          <div className="px-4 py-3 bg-blue-500/70 border border-1 border-blue-600 flex justify-between items-center">
            <TypographyNormal>{perk.title}</TypographyNormal>
            <TypographyNormal classNames="text-yellow-300 text-xs -mt-1 uppercase">{perk.category}</TypographyNormal>
          </div>
          <div className="flex p-4 w-full">
            <div className="w-1/2 flex justify-center h-48">
              <img src={perk.banner as string} className="w-full object-scale-down" />
            </div>
            <div className="w-1/2 p-2">
              <div className="flex justify-end">
                <TypographyNormal classNames="font-semibold">
                  <PerkPrice perk={perk} />
                </TypographyNormal>
              </div>
              <hr className="h-px bg-gray-700 border-0 w-full" />
              <div className="flex mt-2 gap-2">
                {perk && !isOwned && perk.forSale && <PurchaseButton mintPrice={perk.price} perk={perk} />}
                {perk && isOwned && perk.forSale && perk.isRepurchaseable && (
                  <PurchaseButton mintPrice={perk.price} perk={perk} />
                )}
                {perk && isOwned && perk.isActivable && (
                  <EquipButton perkId={perk?.id as string} onReceivedError={onReceivedError} />
                )}
              </div>
            </div>
          </div>
          <hr className="h-px bg-gray-700 border-0" />
          <div className="p-4 overflow-auto h-1/2">
            <Markdown className="mt-1 text-sm text-gray-200 content-display" remarkPlugins={[remarkGfm]}>
              {perk.longDescription}
            </Markdown>
          </div>
          <div className="absolute uppercase right-1 bottom-1 text-xs px-1 text-blue-300">PERK VER. {perk.id}</div>
        </div>
      </div>
    </>
  )
}

export default DisplayPerk
