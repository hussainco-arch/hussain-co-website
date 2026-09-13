import { randomUUID } from 'node:crypto';
import { products, retiredProductSlugs } from '../../shared/catalog.js';
import { Product, Inquiry } from './models.js';
export function createRepository(demo) {
  const inquiries = [];
  return {
    demo,
    async listProducts() {
      return demo ? structuredClone(products) : Product.find({slug: {$nin: retiredProductSlugs}}, {
        _id: 0,
        __v: 0
      }).sort({
        order: 1
      }).lean();
    },
    async saveInquiry(data) {
      const record = {
        ...data,
        reference: `HC-${randomUUID().slice(0, 8).toUpperCase()}`
      };
      if (demo) {
        inquiries.push(record);
        if (inquiries.length > 200) inquiries.shift();
      } else await Inquiry.create(record);
      return record.reference;
    }
  };
}
