import { Route, Routes } from 'react-router-dom'

import { ApiProvider } from 'hooks/use-api'
import PublicLayout from 'layouts/PublicLayout'
import EmbedRoom from 'pages/Embed'

const EmbedApp = () => {
  return (
    <ApiProvider>
      <Routes>
        <Route element={<PublicLayout children={undefined} />}>
          <Route path="/embed/:key" element={<EmbedRoom />} />
        </Route>
      </Routes>
    </ApiProvider>
  )
}

export default EmbedApp
