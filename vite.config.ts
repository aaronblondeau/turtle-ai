import { fileURLToPath, URL } from 'node:url'

import { defineConfig  } from 'vite'
import vue from '@vitejs/plugin-vue'

console.log('~~ VC URL', process.env.URL)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    // make URL env var that is provided by netlify available to the app : https://docs.netlify.com/configure-builds/environment-variables/
    // Note that something like the following can be used to help make typescript happy when using process.env.
    /*
    declare var process: {
      env: {
        URL: string
      }
    }
    */
    'process.env.URL': `"${process.env.URL}"`
  }
})
