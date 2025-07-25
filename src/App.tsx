import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import VoiceGenerator from './pages/VoiceGenerator'
import VideoDubbing from './pages/VideoDubbing'
import Dashboard from './pages/Dashboard'
import Pricing from './pages/Pricing'
import Support from './pages/Support'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/generate" element={<VoiceGenerator />} />
          <Route path="/video-dubbing" element={<VideoDubbing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/support" element={<Support />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App