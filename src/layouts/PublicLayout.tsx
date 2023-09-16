import { Outlet } from 'react-router-dom'

const PublicLayout = () => {
  return (
    <div className="container mx-auto text-white">
      <Outlet />
    </div>
  )
}

export default PublicLayout
