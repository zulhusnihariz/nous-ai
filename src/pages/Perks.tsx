import AlertBoxSuccess from 'components/AlertBox'
import PerkCard from 'components/PerkCard'
import DisplayPerk from 'components/PerkCard/DisplayPerk'
import TypographyNormal from 'components/Typography/Normal'
import { Perk } from 'lib/Perk'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetPerks } from 'repositories/perk.repository'
import { useBoundStore, useNousStore } from 'store'

const PagePerks = () => {
  const [selectedPerkIndex, setSelectedPerkIndex] = useState(0)

  const { data: perks } = useGetPerks({
    first: 50,
    skip: 0,
  })

  const { selectedNous } = useNousStore()
  const navigate = useNavigate()
  const { setModalState } = useBoundStore()

  const onHandlePerkClicked = (index: number) => {
    setSelectedPerkIndex(index)
  }

  useEffect(() => {
    if (!selectedNous?.token_id) {
      navigate('/inventory')
    }
  }, [navigate, selectedNous])

  return (
    <>
      <div className="flex flex-col md:flex-row w-full">
        <div className="md:w-1/2">
          <img src={selectedNous?.metadata.image} className="-z-10 h-48 w-48 ml-3 lg:ml-0" />
          <div className="relative bottom-0 -top-48 md:-top-20 left-5 overflow-auto">
            <div className="h-96 p-2 flex flex-col gap-4 w-full overflow-y-scroll" >
              {perks &&
                perks.map((perk, index) => (
                  <PerkCard
                    key={index}
                    perk={perk}
                    index={index}
                    onClickHandler={onHandlePerkClicked}
                    onSelectedIndex={selectedPerkIndex}
                  />
                ))}
            </div>
          </div>
        </div>
        <div className="md:w-1/2 h-[600px] -translate-y-96 md:-translate-y-0">
          {perks && perks[selectedPerkIndex] && <DisplayPerk perk={perks[selectedPerkIndex]} />}
        </div>
      </div>
    </>
  )
}

export default PagePerks
