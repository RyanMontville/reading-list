import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/reading-list/",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        challenges: resolve(__dirname, "challenges.html"),
        stats: resolve(__dirname, "stats.html"),
        vlogbrothers: resolve(__dirname, "vlogbrothers.html")
      },
    },
  },
  plugins: [VitePWA({
    registerType: "autoUpdate",
      injectRegister: "auto",

    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
      name: 'reading',
      short_name: 'reading',
      description: 'Books read since 2021',
      theme_color: '#ffffff',
    },

    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      cleanupOutdatedCaches: true,
      ignoreURLParametersMatching: [/^year$/, /^author$/, /^tag$/, /^utm_/, /^fbclid$/],
      clientsClaim: true,
    },

    devOptions: {
      enabled: false,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
  })],
})
