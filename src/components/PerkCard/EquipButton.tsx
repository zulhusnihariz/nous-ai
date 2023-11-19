import { useBoundStore, useNousStore } from 'store'
import { Perk } from 'lib/Perk'
import useEquipPerk from 'hooks/useEquip'
import GenericButton from 'components/Button/GenericButton'
import { useEffect } from 'react'

interface Prop {
  perkId: string
  onReceivedError: (error: string) => void
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
      setModalState({
        alert: { isOpen: true, state: 'success', message: `Equipping Perk ver. ${prop.perkId} success` },
      })
    } catch (e) {
      setModalState({
        alert: { isOpen: true, state: 'failed', message: `Purchase Perk ver. ${prop.perkId} failed: ${error}` },
      })
      console.log(e)
    }
  }

  return (
    <div className="w-full">
      <div className="">
        <GenericButton name={!isLoading ? `Equip` : `Processing`} onClick={onHandleEquip} />
      </div>
    </div>
  )
}

export default EquipButton
