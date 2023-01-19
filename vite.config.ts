import { defineConfig } from 'vite'
import WindiCss from 'vite-plugin-windicss';
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), WindiCss()],
})
