
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Recommendations from './pages/Recommendations'
import HealthProfile from './pages/HealthProfile'

function App() {
  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: { 
            background: '#363636', 
            color: '#fff',
            borderRadius: '8px'
          },
          success: { 
            style: { 
              background: '#10b981',
              color: '#fff'
            }
          },
          error: { 
            style: { 
              background: '#ef4444',
              color: '#fff'
            }
          }
        }}
      />
      
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/profile" element={<HealthProfile />} />
            {/* Additional routes will be added in subsequent iterations */}
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
