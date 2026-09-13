import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { createRepository } from '../src/repository.js';
import { Product, Inquiry } from '../src/models.js';
import { products } from '../../shared/catalog.js';
const setup = () => createApp({
  repository: createRepository(true)
});
const valid = {
  name: 'Test Buyer',
  company: 'Test Company',
  email: 'buyer@example.com',
  product: 'xylene',
  quantity: '1 drum',
  destination: 'Lahore',
  message: 'Please share available packing and specifications.',
  consent: true
};
test('all 52 products and six categories are available', async () => {
  const app = setup();
  const list = await request(app).get('/api/products').expect(200);
  assert.equal(list.body.total, 52);
  assert.equal(new Set(list.body.products.map(p => p.slug)).size, 52);
  const c = await request(app).get('/api/categories').expect(200);
  assert.equal(c.body.length, 6);
  assert.ok(c.body.some(category => category.slug === 'other'));
  assert.ok(c.body.some(category => category.slug === 'carbon'));
  const carbon = await request(app).get('/api/products?category=carbon').expect(200);
  assert.deepEqual(carbon.body.products.map(product => product.name), ['Carbon Black N330']);
  const mode = await request(app).get('/api/health').expect(200);
  assert.equal(mode.body.mode, 'demo');
});
test('industrial parent includes its children while child filters stay specific', async () => {
  const app = setup();
  const parent = await request(app).get('/api/products?category=industrial').expect(200);
  assert.equal(parent.body.total, 40);
  assert.ok(parent.body.products.some(p => p.category === 'glycols'));
  assert.ok(parent.body.products.some(p => p.category === 'solvents'));
  assert.ok(parent.body.products.every(p => p.category !== 'technical'));
  const child = await request(app).get('/api/products?category=glycols').expect(200);
  assert.equal(child.body.total, 5);
  assert.ok(child.body.products.every(p => p.category === 'glycols'));
});
test('replacement list includes supplied grades and origins and removes obsolete solvent', async () => {
  const app = setup();
  const solvents = await request(app).get('/api/products?category=solvents').expect(200);
  assert.equal(solvents.body.total, 26);
  assert.equal(solvents.body.products.find(p => p.slug === 'xylene').name, 'Mix Xylene');
  assert.equal(solvents.body.products.find(p => p.slug === 'np9').origin, 'Thailand / Germany / China');
  assert.equal(solvents.body.products.find(p => p.slug === 'chloroform').packaging, 'Tanker / sealed');
  assert.deepEqual(solvents.body.products.filter(p => p.slug.startsWith('phosphoric-acid')).map(p => p.grade), ['75%', '85%']);
  await request(app).get('/api/products/t20').expect(404);
  const glycol = await request(app).get('/api/products/propylene-glycol-usp').expect(200);
  assert.equal(glycol.body.category, 'glycols');
  assert.equal(glycol.body.grade, 'USP');
  assert.equal(glycol.body.origin, 'China');
  const technical = await request(app).get('/api/products?category=technical').expect(200);
  assert.equal(technical.body.total, 12);
});
test('search and category filters combine correctly', async () => {
  const r = await request(setup()).get('/api/products?category=solvents&q=IPA').expect(200);
  assert.equal(r.body.total, 3);
  assert.ok(r.body.products.every(p => p.category === 'solvents'));
  const empty = await request(setup()).get('/api/products?q=does-not-exist').expect(200);
  assert.equal(empty.body.total, 0);
});
test('detail returns provided specification and 404 for missing items', async () => {
  const r = await request(setup()).get('/api/products/dmf').expect(200);
  assert.equal(r.body.origin, 'Saudi Arabia / China');
  await request(setup()).get('/api/products/nonexistent').expect(404);
  await request(setup()).get('/api/missing').expect(404);
});
test('inquiry validates email, consent, length, and product', async () => {
  const app = setup();
  for (const change of [{
    email: 'bad'
  }, {
    consent: false
  }, {
    message: 'short'
  }, {
    product: 'unknown'
  }, {
    website: 'spam'
  }]) await request(app).post('/api/inquiries').send({
    ...valid,
    ...change
  }).expect(400);
});
test('successful demo inquiry returns a reference and explicit demo flag', async () => {
  const r = await request(setup()).post('/api/inquiries').send(valid).expect(201);
  assert.match(r.body.reference, /^HC-[A-F0-9]{8}$/);
  assert.equal(r.body.demo, true);
  assert.match(r.body.message, /not been sent/);
});
test('database failure never pretends that an inquiry was saved', async () => {
  const repository = {
    demo: false,
    listProducts: async () => products,
    saveInquiry: async () => {
      throw new Error('unavailable');
    }
  };
  const r = await request(createApp({
    repository
  })).post('/api/inquiries').send(valid).expect(503);
  assert.equal(r.body.reference, undefined);
});
test('MongoDB schemas accept catalog records and reject incomplete inquiries', async () => {
  for (const p of products) await new Product(p).validate();
  await assert.rejects(new Inquiry({
    name: 'Incomplete'
  }).validate());
  await new Inquiry({
    ...valid,
    reference: 'HC-TEST0001'
  }).validate();
});
test('malformed JSON produces 400, and oversized bodies produce 413', async () => {
  const app = setup();
  await request(app).post('/api/inquiries').set('Content-Type', 'application/json').send('{oops').expect(400);
  await request(app).post('/api/inquiries').send({
    ...valid,
    message: 'x'.repeat(25_000)
  }).expect(413);
});
