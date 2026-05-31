import React from 'react'
import ReactDOM from 'react-dom/client'
import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion'
import App from '@/App.jsx'
import '@/index.css'

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

ReactDOM.createRoot(document.getElementById('root')).render(
  <MotionConfig
    transition={
      isMobile
        ? { duration: 0.4, ease: "easeOut" }
        : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  >
    <LazyMotion features={domAnimation}>
      <App />
    </LazyMotion>
  </MotionConfig>
)