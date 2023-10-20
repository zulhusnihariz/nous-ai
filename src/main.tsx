import React from 'react'
import ReactDOM from 'react-dom/client'
import EmbedApp from 'EmbedApp'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 0,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
})

const isTopWindow = window.self === window.top

if (isTopWindow) {
  import('./App').then(AppModule => {
    const App = AppModule.default
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
          <EmbedApp />
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    )
  })
} else {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <EmbedApp />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
