import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import react from '@vitejs/plugin-react-swc'
import * as fs from 'fs'
import log from 'loglevel'
import * as path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, loadEnv } from 'vite'
import { checker } from 'vite-plugin-checker'
import { createHtmlPlugin } from 'vite-plugin-html'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import tsconfigPaths from 'vite-tsconfig-paths'

log.setLevel(log.levels.TRACE)

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relative: string) => path.resolve(appDirectory, relative)
const root = path.resolve(__dirname, resolveApp('src'))

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isLocalDevelopment = mode === 'development'
  const isAnalyze = mode === 'analyze'

  const env = loadEnv(mode, process.cwd(), '')
  const isProduction = env.VITE_ENV === 'production'

  if (isProduction) log.setLevel(log.levels.ERROR)

  return {
    server: {
      port: Number(env.VITE_PORT || 8000),
    },
    plugins: [
      react(),
      tsconfigPaths(),
      createSvgIconsPlugin({
        iconDirs: [
          path.resolve(process.cwd(), 'src/assets/icons'),
          path.resolve(process.cwd(), 'src/assets/illustrations'),
        ],
        symbolId: '[name]',
      }),
      createHtmlPlugin({
        minify: true,
        entry: './src/main.tsx',
        inject: {
          data: { host: env.VITE_APP_HOST_URL },
        },
      }),
      ...(isLocalDevelopment
        ? [
            checker({
              overlay: {
                initialIsOpen: false,
                position: 'br',
              },
              typescript: true,
              eslint: {
                lintCommand: 'eslint "{src,config}/**/*.{js,ts,jsx,tsx}" --cache --max-warnings=0',
              },
            }),
          ]
        : []),
      ...(isAnalyze ? [visualizer({ open: true })] : []),
    ],
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
      dedupe: ['react', 'lodash'],
      alias: {
        '@': `${root}/`,
        'near-api-js': 'near-api-js/dist/near-api-js.js',
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
    build: {
      sourcemap: true,
      target: 'esnext',
      rollupOptions: {
        plugins: [
          // Enable rollup polyfills plugin
          // used during production bundling
          nodePolyfills(),
        ],
      },
    },
  }
})
