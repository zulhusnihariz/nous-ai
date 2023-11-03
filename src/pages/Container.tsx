import { useParams } from 'react-router-dom'
import { useGetSingleNousMetadata } from 'repositories/rpc.repository'

const PageContainer = () => {
  const { key } = useParams()
  const { data: nft } = useGetSingleNousMetadata(key as string)

  const iframeHeight = 'calc(100vh - 90px)'

  return (
    <>
      <iframe className="w-full" style={{ height: iframeHeight }} src={nft?.metadata.animation_url} />
    </>
  )
}

export default PageContainer
