import PortfolioPage from './pages/PortfolioPage'
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from '@vercel/analytics/react';


function App() {
  return (
    <>
      <PortfolioPage />
      <SpeedInsights />
      <Analytics />
    </>
  )
}

export default App
