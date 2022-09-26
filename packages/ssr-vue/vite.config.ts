/**
 * @file vite config
 * @module vite.config
 */

import path from 'path'
import { loadEnv, defineConfig } from 'vite'
import vuePlugin from '@vitejs/plugin-vue'

const CWD = process.cwd()

// env
const BASE_ENV_CONFIG = loadEnv('', CWD)
const DEV_ENV_CONFIG = loadEnv('development', CWD)
const PROD_ENV_CONFIG = loadEnv('production', CWD)

// https://vitejs.dev/config/#conditional-config
export default defineConfig(({ command, mode }) => {
  const TARGET_ENV_CONFIG = loadEnv(mode, CWD)
  console.info('vite config', {
    command,
    mode,
    TARGET_ENV_CONFIG
  })

  return {
    plugins: [vuePlugin()],
    root: path.resolve(__dirname),
    base: TARGET_ENV_CONFIG.VITE_CDN_URL + '/',
    publicDir: 'public',
    resolve: {
      alias: {
        '/@': path.resolve(__dirname, 'src')
      }
    },
    server: {
      open: true,
      port: 3009,
      proxy: {
        [BASE_ENV_CONFIG.VITE_API_PROXY_URL]: {
          target: BASE_ENV_CONFIG.VITE_API_ONLINE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          charset: false,
          additionalData: `$source-url: '${TARGET_ENV_CONFIG.VITE_FE_URL}';`
        }
      }
    },
    optimizeDeps: {
      include: [
        // 'swiper',
        // // Tree shaking
        // 'highlight.js/lib/core',
        // 'highlight.js/lib/languages/go',
        // 'highlight.js/lib/languages/css',
        // 'highlight.js/lib/languages/sql',
        // 'highlight.js/lib/languages/php',
        // 'highlight.js/lib/languages/xml',
        // 'highlight.js/lib/languages/json',
        // 'highlight.js/lib/languages/bash',
        // 'highlight.js/lib/languages/less',
        // 'highlight.js/lib/languages/scss',
        // 'highlight.js/lib/languages/yaml',
        // 'highlight.js/lib/languages/rust',
        // 'highlight.js/lib/languages/java',
        // 'highlight.js/lib/languages/shell',
        // 'highlight.js/lib/languages/nginx',
        // 'highlight.js/lib/languages/stylus',
        // 'highlight.js/lib/languages/python',
        // 'highlight.js/lib/languages/javascript',
        // 'highlight.js/lib/languages/typescript'
      ],
      exclude: [
        // Effect polyfill
        'intersection-observer',
        // Tree shaking
        'highlight.js',
        // Node
        'express',
        'lru-cache',
        'node-schedule',
        'cookie-parser',
        'serialize-javascript',
        'cross-env',
        'simple-netease-cloud-music',
        'wonderful-bing-wallpaper'
      ]
    },
    build: {
      // https://vitejs.dev/config/#build-csscodesplit
      // https://vitejs.dev/guide/features.html#css-code-splitting
      cssCodeSplit: false,
      sourcemap: true,
      manifest: true,
      rollupOptions: {
        output: {
          entryFileNames: '[name]-[hash].js',
          chunkFileNames: '[name]-[hash].js',
          assetFileNames: '[name]-[hash].[ext]',
          manualChunks(id) {
            if (id.includes('node_modules')) {
              const basics = [
                // 'swiper',
                // 'dom7', // MARK: important > swiper need dom7
                // 'amplitude',
                // 'amplitudejs',
                // 'emoji-233333',
                'lozad',
                // 'marked',
                // '@braintree/sanitize-url',
                // 'serialize-javascript',
                // 'highlight.js',
                // 'ua-parse-js',
                // 'intersection-observer'
              ]

              if (basics.some((exp) => id.includes(`node_modules/${exp}`))) {
                return 'basic'
              } else if (id.includes('mapbox-gl')) {
                return 'mapbox-gl'
              } else {
                return 'vendor'
              }
            }
          }
        }
      }
    }
  }
})
