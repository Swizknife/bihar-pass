import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import i18n from './i18n'
import { loadDictionary } from './i18n/txLoader'
import './index.css'
import App from './App'

loadDictionary(i18n.language).then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode><BrowserRouter><App /></BrowserRouter></StrictMode>,
  )
})
