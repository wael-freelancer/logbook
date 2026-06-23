// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 4321,
    hmr: {
      protocol: 'wss',          // use secure WebSocket through HTTPS proxy
      host: 'logbook.test',
      clientPort: 443,           // browser connects on standard HTTPS port
    },
    allowedHosts: ['logbook.test'],
  }
});