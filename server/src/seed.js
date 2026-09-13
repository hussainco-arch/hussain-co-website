import mongoose from 'mongoose';
import { config } from './config.js';
import { Product } from './models.js';
import { products } from '../../shared/catalog.js';
if (!config.uri) throw new Error('Set MONGODB_URI in server/.env before seeding.');
try {
  await mongoose.connect(config.uri, {
    serverSelectionTimeoutMS: 10_000
  });
  await Product.bulkWrite(products.map(p => ({
    updateOne: {
      filter: {
        slug: p.slug
      },
      update: {
        $set: p
      },
      upsert: true
    }
  })));
  console.log(`Upserted ${products.length} products. No inquiries deleted.`);
} finally {
  await mongoose.disconnect();
}
