import { useState } from 'react'

const TransactionMint = () => {
  const [dummies] = useState([
    {
      image:
        'https://images.pexels.com/photos/18734695/pexels-photo-18734695/free-photo-of-cup-of-coffee-on-bed.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      address: import.meta.env.VITE_NOUS_AI_NFT,
      eth: 0.156,
      trekki: 7,
    },
    {
      image:
        'https://images.pexels.com/photos/18734695/pexels-photo-18734695/free-photo-of-cup-of-coffee-on-bed.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      address: import.meta.env.VITE_NOUS_AI_NFT,
      eth: 0.09,
      trekki: 8,
    },
    {
      image:
        'https://images.pexels.com/photos/18734695/pexels-photo-18734695/free-photo-of-cup-of-coffee-on-bed.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      address: import.meta.env.VITE_NOUS_AI_NFT,
      eth: 0.04,
      trekki: 6,
    },
    {
      image:
        'https://images.pexels.com/photos/18734695/pexels-photo-18734695/free-photo-of-cup-of-coffee-on-bed.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      address: import.meta.env.VITE_NOUS_AI_NFT,
      eth: 0.2,
      trekki: 2,
    },
    {
      image:
        'https://images.pexels.com/photos/18734695/pexels-photo-18734695/free-photo-of-cup-of-coffee-on-bed.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      address: import.meta.env.VITE_NOUS_AI_NFT,
      eth: 0.1,
      trekki: 5,
    },
  ])

  return (
    <div className="rounded-lg">
      <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4">
        <div className="text-lg font-bold mb-4">Latest Transaction</div>
        {dummies.map((dummy, index) => (
          <div key={index} className="flex justify-between">
            <div className="flex justify-between items-center gap-2">
              <img className="h-8 w-8 rounded-full" alt="default" src={dummy.image} />
              <p
                className="overflow-hidden truncate w-28 sm:w-full md:w-full lg:w-24 xl:w-40 cursor-default"
                title={dummy.address}
              >
                {dummy.address}
              </p>
            </div>
            <div className="flex justify-end gap-1 py-2 font-semibold text-sm">
              <p>
                {dummy.eth} ETH <span className="mx-1 h-1 w-1 bg-white rounded-full">.</span> {dummy.trekki} Trekki
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TransactionMint
