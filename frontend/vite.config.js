import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa'; // Importer le plugin

export default defineConfig({
  server: {
    host: true, // Permet d'accéder au serveur depuis d'autres appareils sur le réseau local
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    // Configuration du plugin PWA
    VitePWA({
      registerType: 'autoUpdate',
      // Inclure cette ligne pour que le cache soit mis à jour quand tu changes le code
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      // Le "manifest" de ton application
      manifest: {
        name: 'HabitTracker - Suivi d\'Habitudes',
        short_name: 'HabitTracker',
        description: 'Une application simple pour gérer et suivre vos habitudes quotidiennes.',
        theme_color: '#ffffff', // Couleur de la barre d'outils sur Android
        background_color: '#ffffff', // Couleur de l'écran de démarrage
        display: 'standalone', // Pour une expérience d'app native
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png', // Chemin relatif au dossier 'public'
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png', // Chemin relatif au dossier 'public'
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png', // Pour les appareils Apple
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
});