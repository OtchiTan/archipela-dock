import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ArchipelagoProvider } from './hooks/ArchipelagoProvider';
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ArchipelagoProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ArchipelagoProvider>
  </StrictMode>,
)
