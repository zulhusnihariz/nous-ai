import { Web3Wrapper } from 'App'
import { Outlet } from 'react-router-dom'

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Web3Wrapper>
      <div className="container mx-auto text-white">
        <Outlet />
      </div>
    </Web3Wrapper>
  )
}

export default PublicLayout
