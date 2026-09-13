import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
dotenv.config({
  path: fileURLToPath(new URL('../.env', import.meta.url)),
  quiet: true
});
export const config = {
  port: Number(process.env.PORT || 5000),
  production: process.env.NODE_ENV === 'production',
  demo: process.env.DEMO_MODE === 'true' || !process.env.MONGODB_URI && process.env.NODE_ENV !== 'production',
  uri: process.env.MONGODB_URI,
  origins: (process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173').split(',').map(s => s.trim()),
  trustProxy: Number(process.env.TRUST_PROXY || 0)
};
