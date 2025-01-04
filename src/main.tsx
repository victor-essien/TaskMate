import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import {Provider} from 'react-redux'
import { store } from './redux/taskSlice.ts'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </Provider>
  </StrictMode>,
)
