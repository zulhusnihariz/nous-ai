import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useBoundStore } from 'store'
import { NftToken } from 'lib/NftToken'

const tokens: NftToken[] = [
  {
    tokenId: 0,
    name: 'Token #0',
    description: '',
    metadataUri: '',
    image: 'https://bafybeiaoeqlodqmdbcaiqg3wsh6xhpxrm7z33ijem5myfy4pgxorcfrkpq.ipfs.nftstorage.link',
  },
]

const DropdownOwnedToken = () => {
  const [selected, setSelected] = useState<NftToken>(tokens[0])
  const [data, setData] = useState(tokens)

  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className="relative">
        <Listbox.Button className="relative w-[200px] cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <span className="items-center gap-2 truncate text-black flex">
            <img
              src="https://bafybeiaoeqlodqmdbcaiqg3wsh6xhpxrm7z33ijem5myfy4pgxorcfrkpq.ipfs.nftstorage.link/"
              className="text-center rounded-md h-8 w-8"
            />
            {selected.name}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {data.map((nft, index) => (
              <Listbox.Option
                key={index}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                  }`
                }
                value={nft}
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>{nft.name}</span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}

export default DropdownOwnedToken
