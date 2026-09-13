import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Search, ArrowRight, ArrowUpRight, Phone, Mail, MapPin, Check, UserRound, Package, FileText, LoaderCircle, MessageCircle, ChevronDown } from 'lucide-react';
import { company } from '../../shared/company.js';
import { categories, products as catalogProducts } from '../../shared/catalog.js';
import { Arrow, Button, CategoryIcon, Callout } from './App.jsx';
import { useResource } from './api.js';
const categoryImages = {
  solvents: '/images/category-solvents.png',
  glycols: '/images/category-glycols.png',
  industrial: '/images/factory.jpg',
  technical: '/images/category-technical.png',
  other: '/images/laboratory.jpg',
  carbon: '/images/category-carbon.png'
};
export function getContacts() {
  try { const saved = JSON.parse(localStorage.getItem('hussain_contacts') || 'null'); if (Array.isArray(saved)) return saved.filter(c => !['Syed Jawad Zaidi', 'Ali Shan'].includes(c.name)); } catch {}
  return company.contacts;
}
function PageIntro({
  label,
  title,
  children,
  className = ''
}) {
  return <section className={`page-intro ${className}`.trim()}><span className="eyebrow">{label}</span><div><h1>{title}</h1>{children && <p>{children}</p>}</div></section>;
}
function Loading() {
  return <div className="state-panel" role="status"><LoaderCircle className="spin" size={26} /> Loading the catalog…</div>;
}
function ErrorPanel({
  message,
  retry
}) {
  return <div className="state-panel error" role="alert"><h3>We couldn’t load this information.</h3><p>{message}</p><button className="button" onClick={retry}>Try again <Arrow /></button></div>;
}
export function ProductCard({
  product
}) {
  const category = categories.find(c => c.slug === product.category);
  return <article className="product-card"><Link className={`product-image ${product.category}`} to={`/products/${product.slug}`} tabIndex={-1} aria-hidden="true"><img src={`${product.image}?v=2`} alt="" loading="lazy" /><span className="product-category">{category?.short || product.category}</span><span className="product-arrow"><Arrow size={22} /></span></Link><div className="product-copy"><span className="product-meta">{product.origin === 'Confirm with quotation' ? 'SPECIFICATION ON REQUEST' : product.origin}</span><h3><Link to={`/products/${product.slug}`}>{product.name}</Link></h3><p>{product.packaging} <span> / </span> {product.grade}</p><Link className="product-quote" to={`/contact?product=${product.slug}`}>Request a quote <Arrow size={16} /></Link></div></article>;
}
export function Products() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const category = params.get('category') || '';
  const [industrialOpen, setIndustrialOpen] = useState(['industrial', 'glycols', 'solvents'].includes(category));
  useEffect(() => {
    if (['industrial', 'glycols', 'solvents'].includes(category)) setIndustrialOpen(true);
  }, [category]);
  const sort = params.get('sort') || 'catalog';
  const [draft, setDraft] = useState(q);
  useEffect(() => setDraft(q), [q]);
  const {
    data,
    loading,
    error,
    retry
  } = useResource(`/api/products?${new URLSearchParams({
    q,
    category
  })}`);
  const fallbackProducts = catalogProducts.filter(product => {
    const matchesCategory = !category || (category === 'industrial'
      ? ['industrial', 'glycols', 'solvents', 'carbon'].includes(product.category)
      : product.category === category);
    const searchText = `${product.name} ${product.cas || ''} ${product.grade || ''}`.toLowerCase();
    return matchesCategory && (!q || searchText.includes(q.toLowerCase()));
  });
  function update(values) {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(values)) v ? next.set(k, v) : next.delete(k);
    setParams(next);
  }
  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    try {
      Promise.resolve(context.registerTool({
        name: 'search_chemical_catalog',
        title: 'Search chemical catalog',
        description: 'Search the visible chemical catalog and apply the category filter. Does not submit an inquiry.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              maxLength: 100
            },
            category: {
              type: 'string',
              enum: ['', 'solvents', 'glycols', 'industrial', 'technical', 'other', 'carbon']
            }
          },
          additionalProperties: false
        },
        annotations: {
          readOnlyHint: false
        },
        async execute(input) {
          if (!input || typeof input !== 'object' || Object.keys(input).some(k => !['query', 'category'].includes(k)) || input.query !== undefined && (typeof input.query !== 'string' || input.query.length > 100) || input.category !== undefined && !['', ...categories.map(c => c.slug)].includes(input.category)) throw new Error('Invalid search input.');
          const values = {
            q: input.query || '',
            category: input.category || ''
          };
          const response = await fetch(`/api/products?${new URLSearchParams(values)}`);
          if (!response.ok) throw new Error('Catalog unavailable.');
          const result = await response.json();
          setParams(new URLSearchParams(values));
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
          return {
            total: result.total,
            products: result.products.map(p => ({
              name: p.name,
              slug: p.slug
            }))
          };
        }
      }, {
        signal: lifecycle.signal
      })).catch(() => {});
    } catch {/* Optional API: normal website remains fully usable. */}
    return () => lifecycle.abort();
  }, [setParams]);
  const list = [...(data?.products || (error ? fallbackProducts : []))];
  if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
  return <><PageIntro label="OUR CHEMICAL PORTFOLIO" title={<>Materials for<br /><em>what comes next.</em></>}>Explore our product list. Find a material, review the available details, and send your requirements to our team.</PageIntro><section className="catalog-section section"><div className="catalog-layout"><aside className="filters"><span className="eyebrow">CATEGORIES</span><button className={!category ? 'selected' : ''} onClick={() => update({
            category: ''
          })}>All products <Arrow size={15} /></button>
          <button className={category === 'industrial' ? 'selected' : ''} aria-expanded={industrialOpen} aria-controls="industrial-subcategories" onClick={() => {
            if (category !== 'industrial') { setIndustrialOpen(true); update({category: 'industrial'}); }
            else setIndustrialOpen(value => !value);
          }}><CategoryIcon slug="industrial" size={17} />Industrial Chemicals<ChevronDown className={`category-chevron ${industrialOpen ? 'expanded' : ''}`} size={16} aria-hidden="true" /></button>
          <div id="industrial-subcategories" className="category-children" hidden={!industrialOpen}>
            {['glycols', 'solvents'].map(slug => <button key={slug} className={category === slug ? 'selected' : ''} aria-pressed={category === slug} onClick={() => update({category: slug})}><CategoryIcon slug={slug} size={17} />{categories.find(c => c.slug === slug).name}</button>)}
          </div>
          <button className={category === 'technical' ? 'selected' : ''} onClick={() => update({category: 'technical'})}><CategoryIcon slug="technical" size={17} />Technical Products</button>
          <button className={category === 'other' ? 'selected' : ''} onClick={() => update({category: 'other'})}><CategoryIcon slug="other" size={17} />Other Chemicals</button>
          <button className={category === 'carbon' ? 'selected' : ''} onClick={() => update({category: 'carbon'})}><CategoryIcon slug="carbon" size={17} />Carbon</button>
          <div className="help-box"><Package size={25} strokeWidth={1.2} /><h3>Can’t find your material?</h3><p>Send us your specification. Let’s discuss your requirement.</p><a href={`https://wa.me/${company.whatsapp}`} target="_blank" rel="noreferrer">Ask our team <Arrow size={15} /></a></div></aside><div><div className="catalog-top"><span aria-live="polite">{loading ? 'Loading…' : `${data?.total ?? fallbackProducts.length} products${q ? ` for “${q}”` : ''}`}</span><label>Sort by <select value={sort} onChange={e => update({
                sort: e.target.value
              })}><option value="catalog">Catalog order</option><option value="name">Name A–Z</option></select></label></div>{loading ? <Loading /> : list.length ? <div className="product-grid">{list.map(p => <ProductCard key={p.slug} product={p} />)}</div> : <div className="state-panel"><Search size={32} /><h3>No products found</h3><p>Try another name or clear your filters.</p><button className="button" onClick={() => setParams({})}>Show all products <Arrow /></button></div>}{error && <p className="catalog-api-notice" role="status">Showing the bundled catalog while the API is unavailable. <button onClick={retry}>Retry API</button></p>}</div></div></section><Callout /></>;
}
export function Categories() {
  return <><PageIntro label="FIND YOUR CATEGORY" title={<>Different materials.<br /><em>A connected portfolio.</em></>}>From bulk solvents to technical products, start with the category that matches your business.</PageIntro><section className="section category-directory">{categories.map(c => <Link className="category-row" key={c.slug} style={{ '--category-image': `url(${categoryImages[c.slug]})` }} to={`/products?category=${c.slug}`}><span className="category-number">{c.number}</span><span className="category-row-image"><img src={categoryImages[c.slug]} alt="" /></span><CategoryIcon slug={c.slug} size={36} strokeWidth={1} /><div><h2>{c.name}</h2><p>{c.description}</p></div><span className="round-arrow"><Arrow size={24} /></span></Link>)}</section><Callout /></>;
}
export function ProductDetail() {
  const {
    slug
  } = useParams();
  const {
    data: apiProduct,
    loading,
    error,
    retry
  } = useResource(`/api/products/${encodeURIComponent(slug)}`);
  const p = apiProduct || (error ? catalogProducts.find(product => product.slug === slug) : null);
  const related = useResource(p ? `/api/products?category=${p.category}` : null);
  if (loading) return <section className="section"><Loading /></section>;
  if (error && !p) return <section className="section"><ErrorPanel message={error} retry={retry} /><Link className="text-link" to="/products">Return to product catalog <Arrow /></Link></section>;
  if (!p) return null;
  return <><section className="section detail-section"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/products">Products</Link><span>/</span><span>{p.name}</span></nav><div className="detail-grid"><div className="detail-photo"><img src={`${p.image}?v=2`} alt={`${p.imageLabel}; not a product packaging photograph`} /></div><div className="detail-copy"><span className="eyebrow">{categories.find(c => c.slug === p.category)?.name}</span><h1>{p.name}</h1><p>{p.description}</p>{p.origin && p.origin !== 'Confirm with quotation' && <div className="product-origin"><strong>Origin</strong><span>{p.origin}</span></div>}<div className="product-advantages"><h3>Key advantages</h3><ul><li>Reliable sourcing for professional applications</li><li>Consistent quality selected for your requirements</li><li>Flexible supply and documentation support</li></ul></div><Link className="product-contact-link" to={`/contact?product=${p.slug}`}>For further details, contact our team <Arrow /></Link></div></div></section>{related.data?.products.length > 1 && <section className="section related-section"><div className="section-heading"><div><span className="eyebrow">CONTINUE EXPLORING</span><h2>In the same category.</h2></div><Link className="text-link" to={`/products?category=${p.category}`}>View category <Arrow /></Link></div><div className="product-grid">{related.data.products.filter(x => x.slug !== slug).slice(0, 3).map(x => <ProductCard key={x.slug} product={x} />)}</div></section>}<Callout /></>;
}
function AnimatedFact({ value, label, numeric = true }) {
  const [displayValue, setDisplayValue] = useState(numeric ? 0 : value);
  const factRef = useRef(null);
  useEffect(() => {
    if (!numeric) return undefined;
    const node = factRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setDisplayValue(value);
      return undefined;
    }
    let frame;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const started = performance.now();
      const animate = now => {
        const progress = Math.min((now - started) / 1100, 1);
        setDisplayValue(Math.round(value * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
      observer.disconnect();
    }, { threshold: .35 });
    observer.observe(node);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [numeric, value]);
  return <div ref={factRef} className="about-fact-card"><strong>{numeric ? String(displayValue).padStart(2, '0') : value}</strong><span>{label}</span></div>;
}
export function About() {
  return <><PageIntro className="about-page-intro" label="HUSSAIN & CO · LAHORE, PAKISTAN" title={<>Our business.<br />  <em>Your next connection.</em></>}>Hussain &amp; Co connects trusted international chemical manufacturers with local businesses through responsible sourcing, responsive service, and dependable delivery.</PageIntro><section className="about-wide"><img src="/images/factory.jpg" alt="Chemical processing facility" /></section><section className="section about-intro"><div><span className="eyebrow">IMPORTER AND EXPORTER</span><h2>A conversation<br />that starts with<br /><em>your requirements.</em></h2></div><div><p>{company.intro}</p><div className="about-facts"><AnimatedFact value={catalogProducts.length} label="Listed products" /><AnimatedFact value={categories.length} label="Product categories" /><AnimatedFact value="Lahore" label="Our location" numeric={false} /></div></div></section><section className="section leadership"><div className="portrait">{company.founderImage ? <img src={company.founderImage} alt={company.founderName} /> : <div className="portrait-placeholder"><UserRound size={64} strokeWidth={1} /><span>Chief Executive photograph<br />to be provided</span></div>}</div><div className="leader-copy"><span className="eyebrow">THE VISION BEHIND HUSSAIN & CO.</span><h2>{company.founderName}</h2><span className="role">{company.founderRole}</span>{company.founderMessage ? <blockquote>{company.founderMessage}</blockquote> : <p>With a clear vision and hands-on leadership, Naqash Iqbal Butt built Hussain & Co. from the ground up and continues to guide its growth with integrity, determination, and a strong commitment to customer relationships. His industry insight and practical approach help the company connect reliable global sourcing with the needs of local businesses.</p>}</div></section><section className="section company-story"><div className="company-story-layout"><div><span className="eyebrow">OUR STORY</span><h2>Built on trust.<br /><em>Driven by chemistry.</em></h2><div className="chemistry-animation" aria-label="Animated illustration of two chemicals combining"><div className="chemistry-bottle chemistry-bottle-left"><span className="bottle-neck" /><span className="bottle-body"><i /></span></div><div className="reaction-core"><span /><span /><span /></div><div className="chemistry-bottle chemistry-bottle-right"><span className="bottle-neck" /><span className="bottle-body"><i /></span></div></div></div><div className="company-story-copy"><p>Established in 2018, Hussain &amp; Co. is a trusted chemical importing and trading company serving businesses across Pakistan. Backed by more than 17 years of industry experience, we connect reliable international manufacturers with local businesses through responsible sourcing, responsive service, and dependable delivery. Our expertise enables us to understand diverse industrial requirements and provide products that meet the right standards, specifications, and applications. From sourcing and documentation to logistics and timely delivery, we manage every stage with care and professionalism. At Hussain &amp; Co., we believe lasting partnerships are built on trust, consistency, product quality, and a commitment to meeting our customers’ needs.</p></div></div></section><Callout /></>;
}
export function Contact() {
  const [params] = useSearchParams();
  const catalog = useResource('/api/products');
  const health = useResource('/api/health');
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    product: params.get('product') || '',
    quantity: '',
    destination: '',
    message: params.get('documents') ? `Please share the ${params.get('documents')} and available specifications.` : '',
    consent: false,
    website: ''
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);
  useEffect(() => {
    setForm(f => ({
      ...f,
      product: params.get('product') || '',
      ...(params.get('documents') ? {
        message: `Please share the ${params.get('documents')} and available specifications.`
      } : {})
    }));
  }, [params]);
  useEffect(() => {
    if (result) resultRef.current?.focus();
  }, [result]);
  function change(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
    });
  }
  const emailHasText = form.email.length > 0;
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  async function submit(e) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const productName = catalog.data?.products.find(p => p.slug === form.product)?.name || form.product || 'Not specified';
      const message = `Assalam-o-Alaikum Hussain & Co. Team,\n\nI would like to enquire about the following chemical requirement:\n\nName: ${form.name.trim()}\nCompany: ${form.company || 'Not specified'}\nEmail: ${form.email.trim()}\nPhone: ${form.phone || 'Not specified'}\nProduct: ${productName}\nQuantity: ${form.quantity || 'Not specified'}\nAdditional requirements: ${form.destination || 'Not specified'}\nProduct details: ${form.message.trim()}\n\nPlease share the available specification, price, and delivery details.\n\nThank you.`;
      window.open(`https://wa.me/923245121105?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
      setResult({ demo: true, reference: 'WHATSAPP', message: 'Your inquiry has been prepared in WhatsApp. Please press send there to contact Hussain & Co.' });
    } catch (err) {
      setError(err.name === 'TimeoutError' ? 'The request took too long. Please try again or call our team.' : err.message || 'Please try again.');
    } finally {
      setBusy(false);
    }
  }
  return <><PageIntro label="START THE CONVERSATION" title={<>Your requirement.<br /><em>Our next conversation.</em></>}>Tell us what you’re looking for. Include your required grade, quantity, and delivery destination.</PageIntro><section className="section contacts-section compact-contact"><div className="contacts-heading"><div><span className="eyebrow">PEOPLE YOU CAN REACH</span><h2>Let&apos;s talk business.</h2></div><a className="place-order-button" href="#inquiry-form">Place an order <Arrow size={16} /></a></div><div className="team-grid"><div className="contact-card-highlight"><h3>Naqash Iqbal Butt</h3><p>Chief Executive</p><a href="tel:+923245121105"><Phone size={17} />+923245121105<Arrow size={17} /></a><div className="contact-qrs"><a href="https://wa.me/923245121105" target="_blank" rel="noreferrer"><img src="/images/naqash-whatsapp-qr.svg" alt="WhatsApp QR" /><small>WhatsApp</small></a><a href="https://www.facebook.com/people/Hussain-Co/100083149036335/" target="_blank" rel="noreferrer"><img src="/images/hussain-facebook-qr.svg" alt="Facebook QR" /><small>Facebook</small></a><a href="/images/naqash-contact-qr.svg" download><img src="/images/naqash-contact-qr.svg" alt="Save contact QR" /><small>Save contact</small></a></div></div></div></section><section className="section contact-layout"><aside className="contact-info"><h2>Let’s connect.</h2><p>Reach our team directly, or leave the details of your inquiry.</p><a href={`mailto:${company.email}`}><Mail /><span><small>EMAIL US</small>{company.email}</span></a><div><MapPin /><span><small>FIND US</small>{company.address}</span></div>{getContacts().map(c => <a key={c.phone} href={`tel:${c.international}`}><Phone /><span><small>{c.name.toUpperCase()}</small>{c.phone}</span></a>)}<a className="whatsapp-link" target="_blank" rel="noreferrer" href={`https://wa.me/${company.whatsapp}`}><MessageCircle size={19} />Chat on WhatsApp <Arrow />  </a><div className="contact-image"><img src={company.laboratoryImage} alt="Illustrative laboratory glassware" loading="lazy" /></div><div className="contact-chemistry-animation" aria-label="Decorative animation of chemicals mixing"><span className="contact-orb contact-orb-one" /><span className="contact-orb contact-orb-two" /><span className="contact-orb contact-orb-three" /><span className="contact-drop contact-drop-one" /><span className="contact-drop contact-drop-two" /><span className="contact-drop contact-drop-three" /><span className="contact-mixing-core" /></div></aside><div className="inquiry-panel">{result ? <div className="success-panel" ref={resultRef} tabIndex={-1} role="status"><span className="success-icon"><Check size={30} /></span><span className="eyebrow">{result.demo ? 'DEMO SUBMISSION' : 'INQUIRY RECEIVED'}</span><h2>{result.demo ? 'Your form works.' : 'Thank you for your inquiry.'}</h2><p>{result.message}</p><div className="reference">Reference <strong>{result.reference}</strong></div><button className="button" onClick={() => {
            setResult(null);
            setForm({
              ...form,
              name: '',
              company: '',
              email: '',
              phone: '',
              quantity: '',
              destination: '',
              message: '',
              consent: false,
              website: ''
            });
          }}>Send another inquiry <Arrow /></button></div> : <><span className="eyebrow">REQUEST A QUOTATION</span><h2>What can we help<br />you source?</h2>{health.error && <p className="demo-notice">The inquiry service is currently unavailable. You can contact the team directly.</p>}          <form id="inquiry-form" onSubmit={submit} className="inquiry-form"><div className="form-grid"><label>Your name <span>*</span><input name="name" autoComplete="name" value={form.name} onChange={change} required minLength={2} maxLength={100} /></label><label>Company name<input name="company" autoComplete="organization" value={form.company} onChange={change} maxLength={150} /></label>          <label>Email address <span>*</span><input type="email" name="email" autoComplete="email" required value={form.email} onChange={change} maxLength={254} aria-describedby="email-format-help" aria-invalid={emailHasText && !emailIsValid} /><small id="email-format-help" className={`email-format-hint ${emailHasText ? (emailIsValid ? 'valid' : 'invalid') : ''}`}>{emailHasText ? (emailIsValid ? 'Email format looks good.' : 'Please use a format like name@example.com.') : 'Use a format like name@example.com.'}</small></label><label>Phone number<input type="tel" name="phone" autoComplete="tel" value={form.phone} onChange={change} maxLength={40} /></label><label className="full">Product<select name="product" value={form.product} onChange={change} disabled={catalog.loading || !!catalog.error}><option value="">General inquiry / another product</option>{catalog.data?.products.map(p => <option key={p.slug} value={p.slug}>{p.name}</option>)}</select></label>{catalog.error && <div className="full field-error"><p>Product selection could not load.</p><button type="button" className="text-button" onClick={catalog.retry}>Reload products</button></div>}<label>Required quantity<input name="quantity" placeholder="e.g. 1 drum or 5 MT" value={form.quantity} onChange={change} maxLength={100} /></label><label>Additional requirements<input name="destination" placeholder="Any special requirements" value={form.destination} onChange={change} maxLength={150} /></label><label className="full">Your requirements <span>*</span><textarea name="message" rows={5} minLength={10} maxLength={4000} required placeholder="Tell us about your specification, packing, documents, or other requirements." value={form.message} onChange={change} /></label></div><div className="honeypot" aria-hidden="true"><label>Leave this empty<input name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={change} /></label></div><label className="consent"><input type="checkbox" name="consent" checked={form.consent} required onChange={change} /><span>I agree that Hussain & Co may use these details to respond to my inquiry. <span aria-hidden="true">*</span></span></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button submit-button" disabled={busy || health.loading || !!health.error || catalog.loading || !!catalog.error}>{busy ? <><LoaderCircle className="spin" size={18} />Submitting…</> : <>Submit inquiry <Arrow /></>}</button><p className="fine-print">Your inquiry does not place an order. Commercial terms and product details are confirmed separately. Required fields are marked *.</p></form></>}</div></section></>;
}
export function ContactManager() {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('hussain_manager_unlocked') === 'true');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [contacts, setContacts] = useState(() => getContacts());
  const [draft, setDraft] = useState({ name: '', role: 'Company contact', phone: '', international: '' });
  const save = next => { setContacts(next); localStorage.setItem('hussain_contacts', JSON.stringify(next)); };
  const login = e => { e.preventDefault(); if (password === 'HussainNaqash@12345') { sessionStorage.setItem('hussain_manager_unlocked', 'true'); setUnlocked(true); } else setAuthError('Incorrect password. Please try again.'); };
  const add = e => { e.preventDefault(); if (!draft.name.trim() || !draft.phone.trim()) return; save([...contacts, { ...draft, name: draft.name.trim(), phone: draft.phone.trim(), international: draft.international.trim() || draft.phone.trim() }]); setDraft({ name: '', role: 'Company contact', phone: '', international: '' }); };
  if (!unlocked) return <><PageIntro label="CONTACT SETTINGS" title={<>Private contact<br /><em>management.</em></>}>Sign in to manage Hussain &amp; Co contacts.</PageIntro><section className="section manager-auth"><form className="manager-form" onSubmit={login}><h2>Manager login</h2><p>Use your private password to continue.</p><label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required /></label>{authError && <p className="form-error">{authError}</p>}<button className="button" type="submit">Unlock contacts <Arrow /></button><p className="fine-print">Need help? Contact {company.email}</p></form></section></>;
  return <><PageIntro label="CONTACT SETTINGS" title={<>Manage your<br /><em>company contacts.</em></>}>Add, edit, or remove phone contacts without a database. Changes are saved in this browser.</PageIntro><section className="section manager"><div className="manager-list">{contacts.map((c, i) => <div className="manager-row" key={`${c.phone}-${i}`}><div><strong>{c.name}</strong><span>{c.role} · {c.phone}</span></div><button className="text-button" onClick={() => { const phone = window.prompt('Edit phone number', c.phone); if (phone) save(contacts.map((item, index) => index === i ? { ...item, phone } : item)); }}>Edit number</button><button className="text-button danger" onClick={() => save(contacts.filter((_, index) => index !== i))}>Remove</button></div>)}</div><form className="manager-form" onSubmit={add}><h2>Add a contact</h2><div className="form-grid"><label>Name<input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} required /></label><label>Role<input value={draft.role} onChange={e => setDraft({ ...draft, role: e.target.value })} /></label><label>Phone number<input value={draft.phone} onChange={e => setDraft({ ...draft, phone: e.target.value })} required /></label><label>International number<input value={draft.international} onChange={e => setDraft({ ...draft, international: e.target.value })} placeholder="+923..." /></label></div><button className="button" type="submit">Add contact <Arrow /></button></form></section></>;
}
export function NotFound() {
  return <section className="section state-panel"><span className="eyebrow">404 · PAGE NOT FOUND</span><h1>Let’s get you<br /><em>back on track.</em></h1><p>This page does not exist. Explore our catalog or return home.</p><Button to="/">Back to home</Button></section>;
}
