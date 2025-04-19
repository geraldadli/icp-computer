import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SidebarProvider } from './SidebarContext';
import { ThemeProvider } from './ThemeContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <SidebarProvider>
       <ThemeProvider>
         <App />
       </ThemeProvider>
     </SidebarProvider>
  </StrictMode>
)
