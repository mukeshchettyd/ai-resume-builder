import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Builder from './pages/Builder'
import Preview from './pages/Preview'
import Proof from './pages/Proof'

import './styles/global.css'

function App() {
  return (
    <BrowserRouter basename="/ai-resume-builder">
      <div className="app-layout">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/builder" element={<Builder />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/proof" element={<Proof />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
