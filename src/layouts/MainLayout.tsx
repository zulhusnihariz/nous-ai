import { Outlet, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import { Web3Wrapper } from 'App'
import bg from '/public/img/bg.png'
import AlertBox from 'components/AlertBox'

interface BackgroundImages {
  [key: string]: string
}
const backgroundImages: BackgroundImages = {
  '/mint': '/img/minting.png',
  '/perks': '/img/workshop.png',
  '/search': '',
  '/room': 'none',
  '': 'none',
  '/bot2': 'none',
}

const getRootPath = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean)
  return segments.length > 0 ? `/${segments[0]}` : ''
}

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()

  let backgroundImage = ''

  if (backgroundImages[getRootPath(location.pathname)] === 'none') {
    backgroundImage = ''
  } else {
    backgroundImage = backgroundImages[getRootPath(location.pathname)] || '/img/bg.png'
  }

  return (
    <Web3Wrapper>
      {/* {backgroundImage && (
        <img src={backgroundImage} className="mask-image absolute object-cover w-screen -z-10 h-screen" />
      )} */}
      <Header />
      <hr className="h-px mb-4 bg-slate-800 border-0 dark:bg-gray-700" />
      <div className="container mx-auto text-white">
        <Outlet />
      </div>
      <AlertBox />
    </Web3Wrapper>
  )
}

export default MainLayout
