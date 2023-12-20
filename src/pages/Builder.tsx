import { useNousStore } from 'store'
import BuilderPreview from 'components/Builder/Preview'
import BuilderConfiguration from 'components/Builder/Configure'
import { Nft } from 'lib'
import { useGetLineageNousMetadata } from 'repositories/rpc.repository'
import { useEffect, useState } from 'react'
import GenericButton from 'components/Button/GenericButton'
import { useNavigate } from 'react-router-dom'

const PageBuilder = () => {
  const navigate = useNavigate()
  const { selectedNous } = useNousStore()

  const [builder, setBuilder] = useState({
    name: '',
    description: '',
    instructions: '',
    conversationStarters: [''],
  })

  const { data, refetch } = useGetLineageNousMetadata(
    selectedNous?.dataKey as string,
    'builder',
    selectedNous?.owner as string,
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

  useEffect(() => {
    if (data) setBuilder(data.content)
  }, [data])

  useEffect(() => {
    if (!selectedNous) navigate('/inventory')
  }, [selectedNous])

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
            {currentTab === 'configure' && (
              <BuilderConfiguration nft={{ ...selectedNous, builder } as Nft} refetch={refetch} />
            )}
            {currentTab === 'preview' && <BuilderPreview nft={{ ...selectedNous, builder } as Nft} />}
          </div>
        </>
      )}

      {!isMobile && (
        <div className="flex">
          <BuilderConfiguration nft={{ ...selectedNous, builder } as Nft} refetch={refetch} />
          <BuilderPreview nft={{ ...selectedNous, builder } as Nft} />
        </div>
      )}
    </>
  )
}

export default PageBuilder
