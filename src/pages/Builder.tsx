import { useNousStore } from 'store'
import BuilderPreview from 'components/Builder/Preview'
import BuilderConfiguration from 'components/Builder/Configure'
import { Nft } from 'lib'
import { useGetLineageNousMetadata } from 'repositories/rpc.repository'
import { useConnectedWallet } from 'hooks/use-connected-wallet'
import { useEffect, useState } from 'react'
import GenericButton from 'components/Button/GenericButton'

const PageBuilder = () => {
  const { selectedNous } = useNousStore()
  const { address } = useConnectedWallet()

  const { data: custom } = useGetLineageNousMetadata(
    selectedNous?.dataKey as string,
    'custom',
    address.full.toLowerCase(),
    ''
  )

  const [width, setWidth] = useState<number>(window.innerWidth)
  const [currentTab, setCurrentTab] = useState('configure')
  function handleWindowSizeChange() {
    setWidth(window.innerWidth)
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange)
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
    }
  }, [])

  const isMobile = width <= 768

  return (
    <>
      {isMobile && (
        <>
          <div className="flex justify-center gap-4">
            <GenericButton
              name="Configure"
              onClick={() => {
                setCurrentTab('configure')
              }}
            />
            <GenericButton
              name="Preview"
              onClick={() => {
                setCurrentTab('preview')
              }}
            />
          </div>

          <div className="flex">
            {currentTab === 'configure' && <BuilderConfiguration nft={{ ...selectedNous, custom } as Nft} />}
            {currentTab === 'preview' && <BuilderPreview nft={{ ...selectedNous, custom } as Nft} />}
          </div>
        </>
      )}

      {!isMobile && (
        <div className="flex">
          <BuilderConfiguration nft={{ ...selectedNous, custom } as Nft} />
          <BuilderPreview nft={{ ...selectedNous, custom } as Nft} />
        </div>
      )}
    </>
  )
}

export default PageBuilder
