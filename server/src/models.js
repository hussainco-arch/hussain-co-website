import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  grade: String,
  purity: String,
  packaging: String,
  origin: String,
  needsConfirmation: Boolean,
  cas: String,
  image: String,
  imageLabel: String,
  description: String,
  applications: [String],
  moq: String,
  sdsUrl: String,
  tdsUrl: String,
  featured: Boolean,
  order: Number
}, {
  timestamps: true
});
const inquirySchema = new mongoose.Schema({
  reference: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  company: String,
  email: {
    type: String,
    required: true
  },
  phone: String,
  product: String,
  quantity: String,
  destination: String,
  message: {
    type: String,
    required: true
  },
  consent: {
    type: Boolean,
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'closed'],
    default: 'new'
  }
}, {
  timestamps: true
});
export const Product = mongoose.model('Product', productSchema);
export const Inquiry = mongoose.model('Inquiry', inquirySchema);
