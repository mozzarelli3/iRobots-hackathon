import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppCopy from './AppCopy.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppCopy />
  </StrictMode>,
)
