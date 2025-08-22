import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // TODO: Replace [repository-name] with your actual GitHub repository name.
  // For example, if your repository URL is https://github.com/your-username/my-quran-app,
  // the base should be '/my-quran-app/'.
  base: '/tarteel/'
})
