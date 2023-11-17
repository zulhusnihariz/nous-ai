import useEquipPerk from 'hooks/useEquip'
import { Perk } from 'lib/Perk'

interface Prop {
  perk: Partial<Perk>
  tokenId: string
}

const PerkCardNft = ({ perk, tokenId }: Prop) => {
  const { equipPerk, isLoading, error } = useEquipPerk({
    perkId: perk.id as string,
    tokenId: tokenId,
  })

  const onHandleEquip = async () => {
    try {
      await equipPerk()
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <article className="rounded-lg shadow text-center py-2 bg-slate-800 text-slate-100">
      <h3 className="py-2 font-bold  uppercase text-sm line-clamp-1">{perk.title}</h3>
      <hr className="w-3/5 h-0.5 mx-auto bg-gray-700 border-0 rounded" />
      <div className="h-1/2">
        <img alt="Office" src={perk.banner as string} className="h-full w-full object-cover" />
      </div>
      <hr className="w-full h-0.5 mx-auto bg-gray-700 border-0 rounded" />

      <div className="h-2/5 flex justify-center items-center">
        {perk.isActivable && (
          <button
            onClick={onHandleEquip}
            className="uppercase rounded bg-green-400 text-green-800 text-center px-4 py-2 text-sm font-medium hover:bg-green-300"
          >
            Equip
          </button>
        )}
        {!perk.isActivable && (
          <span className="uppercase rounded text-green-300 text-center px-4 py-2 text-sm font-medium transition">
            Activated
          </span>
        )}
      </div>
    </article>
  )
}

export default PerkCardNft
