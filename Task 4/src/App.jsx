import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './components/Home'
import About from './components/About'
import Contact from './components/Contact'
import Mahad from './components/Mahad'

function AppContent() {
  const location = useLocation()
  const showNavigation = location.pathname !== '/mahad'

  return (
    <>
      {showNavigation && <Navigation />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/mahad" element={<Mahad />} />
        </Routes>
      </main>
    </>
  )
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}
