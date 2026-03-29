import PortfolioPage from './pages/PortfolioPage'
import { SpeedInsights } from "@vercel/speed-insights/next"

function App() {
  return (
    <>
      <PortfolioPage />
      <SpeedInsights />
    </>
  )
}

export default App
