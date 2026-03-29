import PortfolioPage from './pages/PortfolioPage'
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from '@vercel/analytics/react';
import ChatWidget from './components/ChatWidget';


function App() {
  return (
    <>
      <PortfolioPage />
      <SpeedInsights />
      <Analytics />
      <ChatWidget />
    </>
  )
}

export default App
