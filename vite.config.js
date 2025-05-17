import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'bea70e5e-01bc-471a-9ef6-7d9dc3114f5b-00-1llym7l53ga7u.spock.replit.dev'
    ]
  }
})
