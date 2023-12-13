import { useNousStore } from 'store'
import BuilderPreview from 'components/Builder/Preview'
import BuilderConfiguration from 'components/Builder/Configure'
import { Nft } from 'lib'
import { useGetLineageNousMetadata } from 'repositories/rpc.repository'
import { useConnectedWallet } from 'hooks/use-connected-wallet'

const PageBuilder = () => {
  const { selectedNous } = useNousStore()
  const { address } = useConnectedWallet()

  const { data: custom } = useGetLineageNousMetadata(
    selectedNous?.dataKey as string,
    'custom',
    address.full.toLowerCase(),
    ''
  )

  return (
    <>
      <div className="flex">
        <BuilderConfiguration nft={{ ...selectedNous, custom } as Nft} />
        <BuilderPreview nft={{ ...selectedNous, custom } as Nft} />
      </div>
    </>
  )
}

export default PageBuilder
