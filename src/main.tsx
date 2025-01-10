import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import {Provider} from 'react-redux'
import { store } from './redux/taskSlice.ts'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContex.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
    <BrowserRouter>
    <AuthProvider>
          <App />
          </AuthProvider>

    </BrowserRouter>
    </Provider>
  </StrictMode>,
)
