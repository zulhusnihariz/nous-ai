import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import { Web3Wrapper } from 'App'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Web3Wrapper>
      <Header />
      <hr className="h-px mb-8 bg-gray-700 border-0 dark:bg-gray-700" />
      <div className="container mx-auto text-white">
        <Outlet />
      </div>
    </Web3Wrapper>
  )
}

export default MainLayout
