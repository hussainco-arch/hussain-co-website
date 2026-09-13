import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { company } from '../../shared/company.js';
import { categories } from '../../shared/catalog.js';
const inquiryInput = z.object({
  name: z.string().trim().min(2).max(100),
  company: z.string().trim().max(150).default(''),
  email: z.email().max(254),
  phone: z.string().trim().max(40).default(''),
  product: z.string().trim().max(120).default(''),
  quantity: z.string().trim().max(100).default(''),
  destination: z.string().trim().max(150).default(''),
  message: z.string().trim().min(10).max(4000),
  consent: z.literal(true),
  website: z.string().max(0).optional()
});
export function createApp({
  repository,
  origins = [],
  trustProxy = 0,
  production = false
}) {
  const app = express();
  app.disable('x-powered-by');
  if (trustProxy) app.set('trust proxy', trustProxy);
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        upgradeInsecureRequests: production ? [] : null
      }
    }
  }));
  app.use(cors({
    origin(origin, done) {
      done(null, !origin || origins.includes(origin));
    }
  }));
  app.use(express.json({
    limit: '20kb'
  }));
  app.use('/api', rateLimit({
    windowMs: 60_000,
    limit: 120,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
      error: 'Too many requests. Please try again shortly.'
    }
  }));
  app.get('/api/health', (_req, res) => res.json({
    ok: true,
    mode: repository.demo ? 'demo' : 'mongodb'
  }));
  app.get('/api/company', (_req, res) => res.json(company));
  app.get('/api/categories', (_req, res) => res.json(categories));
  app.get('/api/products', async (req, res) => {
    const q = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase().slice(0, 100) : '';
    const category = typeof req.query.category === 'string' ? req.query.category : '';
    let data = await repository.listProducts();
    if (category) data = data.filter(p => category === 'industrial'
      ? ['industrial', 'glycols', 'solvents', 'carbon'].includes(p.category)
      : p.category === category);
    if (q) data = data.filter(p => `${p.name} ${p.cas || ''} ${p.grade || ''}`.toLowerCase().includes(q));
    res.json({
      products: data,
      total: data.length
    });
  });
  app.get('/api/products/:slug', async (req, res) => {
    const product = (await repository.listProducts()).find(p => p.slug === req.params.slug);
    if (!product) return res.status(404).json({
      error: 'Product not found.'
    });
    res.json(product);
  });
  app.post('/api/inquiries', rateLimit({
    windowMs: 15 * 60_000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
      error: 'Please wait before sending another inquiry, or contact our team by phone.'
    }
  }), async (req, res) => {
    const parsed = inquiryInput.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({
      error: 'Please check your name, email, message, and consent.',
      fields: parsed.error.flatten().fieldErrors
    });
    const {
      website,
      ...data
    } = parsed.data;
    if (data.product && !(await repository.listProducts()).some(p => p.slug === data.product)) return res.status(400).json({
      error: 'Please select a valid product or choose General inquiry.'
    });
    const reference = await repository.saveInquiry(data);
    res.status(201).json({
      reference,
      demo: repository.demo,
      message: repository.demo ? 'Demo inquiry recorded for this session. It has not been sent to the company.' : 'Your inquiry has been saved. Keep your reference for follow-up.'
    });
  });
  app.use('/api', (_req, res) => res.status(404).json({
    error: 'API route not found.'
  }));
  const dist = fileURLToPath(new URL('../../client/dist/', import.meta.url));
  if (existsSync(`${dist}/index.html`)) {
    app.use(express.static(dist));
    app.get('/{*splat}', (_req, res) => res.sendFile(`${dist}/index.html`));
  }
  app.use((err, _req, res, _next) => {
    if (err.type === 'entity.too.large') return res.status(413).json({
      error: 'Your request is too large.'
    });
    if (err instanceof SyntaxError && 'body' in err) return res.status(400).json({
      error: 'Invalid JSON request.'
    });
    console.error('Request failed:', err.name);
    res.status(503).json({
      error: 'We could not save or load this information. Please try again or contact the team directly.'
    });
  });
  return app;
}
