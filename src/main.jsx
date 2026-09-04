import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BarberProvider } from './context/BarberContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BarberProvider>
      <App />
    </BarberProvider>
  </StrictMode>,
)
