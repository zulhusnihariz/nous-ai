import { useBoundStore, useNousStore } from 'store'
import { Perk } from 'lib/Perk'
import useEquipPerk from 'hooks/useEquip'

interface Prop {
  perkId: string
}

const EquipButton = (prop: Prop) => {
  const { selectedNous } = useNousStore()
  const { setModalState } = useBoundStore()

  const { equipPerk, isLoading, error } = useEquipPerk({
    perkId: prop.perkId,
    tokenId: selectedNous?.token_id as string,
  })

  const onHandleEquip = async () => {
    try {
      await equipPerk()
      setModalState({ purchasePerk: { isOpen: false, perk: undefined } })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-end gap-2">
        <img
          src={selectedNous?.metadata.image}
          className="text-center w-10 h-10 rounded-md ring ring-green-300"
          onClick={e => {
            e.stopPropagation()
            setModalState({ selectNous: { isOpen: true } })
          }}
        />
        <button
          className="rounded-md bg-green-500 px-5 py-3 text-center text-sm font-semibold text-white"
          onClick={onHandleEquip}
        >
          Equip
        </button>
      </div>
    </div>
  )
}

export default EquipButton
