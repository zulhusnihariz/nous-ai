import PerkCard from 'components/PerkCard'
import PurchaseModal from 'components/PerkCard/Purchase'
import SelectNousModal from 'components/SelectNousModal'
import { useEffect } from 'react'
import { useGetPerks } from 'repositories/perk.repository'
import { useBoundStore, useNousStore } from 'store'

const PagePerks = () => {
  const { data: perks } = useGetPerks({
    first: 50,
    skip: 0,
  })

  const { selectedNous } = useNousStore()
  const { setModalState } = useBoundStore()

  useEffect(() => {
    if (!selectedNous) {
      setModalState({ selectNous: { isOpen: true } })
    }
  }, [selectedNous, setModalState])
  return (
    <>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
        {perks && perks.map((perk, index) => <PerkCard key={index} perk={perk} />)}
      </div>
      <PurchaseModal />
      <SelectNousModal />
    </>
  )
}

export default PagePerks
