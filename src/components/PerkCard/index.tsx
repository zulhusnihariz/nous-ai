import TypographyNormal from 'components/Typography/Normal'
import { Perk } from 'lib/Perk'
import { useEffect, useState } from 'react'
import { useNousStore } from 'store'

interface Prop {
  perk: Perk
  index: number
  onSelectedIndex: number
  onClickHandler: (index: number) => void
}

const PerkPrice = ({ price }: { price: String }) => {
  if (price === '0.0') {
    return 'FREE'
  } else {
    return `${price} E`
  }
}

const PerkCard = (prop: Prop) => {
  const [isOwned, setIsOwned] = useState(false)

  const { selectedNous, ownedPerks } = useNousStore()

  useEffect(() => {
    if (ownedPerks.length > 0) {
      const isPerkIncluded = ownedPerks.some(perk => {
        return perk.id.toString() === prop.perk.id.toString()
      })
      setIsOwned(isPerkIncluded)
    }
  }, [ownedPerks, prop.perk.id, selectedNous])

  return (
    <div
      onClick={() => prop.onClickHandler(prop.index)}
      className={`w-4/5 border relative font-semibold ring-2 border-slate-600 p-2 py-3 flex justify-between items-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${
        prop.onSelectedIndex === prop.index
          ? 'left-5 ring-white/90 from-yellow-500 to-yellow-600'
          : 'ring-white/80 from-blue-500 to-blue-700'
      }`}
    >
      <TypographyNormal classNames="">
        {prop.perk.title}{' '}
        {prop.perk.category && <span className="text-xs text-yellow-300 font-thin">[{prop.perk.category}]</span>}
      </TypographyNormal>
      <TypographyNormal>
        <PerkPrice price={prop.perk.price} />
      </TypographyNormal>
    </div>
  )
}

export default PerkCard
