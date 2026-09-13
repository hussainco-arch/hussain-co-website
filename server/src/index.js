import mongoose from 'mongoose';
import { config } from './config.js';
import { createApp } from './app.js';
import { createRepository } from './repository.js';
if (config.production && config.demo) throw new Error('Production requires DEMO_MODE=false and a real MongoDB connection.');
if (!config.demo) {
  if (!config.uri) throw new Error('MONGODB_URI required. Copy server/.env.example to server/.env.');
  await mongoose.connect(config.uri, {
    serverSelectionTimeoutMS: 10_000
  });
}
const app = createApp({
  repository: createRepository(config.demo),
  origins: config.origins,
  trustProxy: config.trustProxy,
  production: config.production
});
const server = app.listen(config.port, '0.0.0.0', () => console.log(`API ready: http://localhost:${config.port} (${config.demo ? 'DEMO — no permanent storage or email delivery' : 'MongoDB connected'})`));
function shutdown() {
  server.close(async () => {
    await mongoose.disconnect();
    process.exit(0);
  });
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
