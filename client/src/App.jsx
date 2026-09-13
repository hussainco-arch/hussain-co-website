import { useEffect, useState, useRef } from 'react';
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Menu, X, Globe2, FlaskConical, Factory, Droplets, Leaf, MoveUpRight, Search, ChevronDown, Check, ShieldCheck, Handshake } from 'lucide-react';
import { company } from '../../shared/company.js';
import { categories, products as catalogProducts } from '../../shared/catalog.js';
import { ChemistryIndustryBand } from './components/ui/chemistry-industry-band.jsx';
import { ChemicalTicker } from './components/ui/ChemicalTicker.jsx';
const categoryImages = { solvents: '/images/category-solvents.png', glycols: '/images/category-glycols.png', industrial: '/images/factory.jpg', technical: '/images/category-technical.png', other: '/images/laboratory.jpg', carbon: '/images/category-carbon.png' };
export const Arrow = ({
  size = 18
}) => <ArrowUpRight size={size} aria-hidden="true" />;
export const Button = ({
  to,
  children,
  outline = false,
  ...props
}) => <Link to={to} className={`button ${outline ? 'outline' : ''}`} {...props}>{children}<Arrow /></Link>;
export const FlowButton = ({ to, text }) => <Link to={to} className="flow-button"><ArrowRight className="flow-button-arrow flow-button-arrow-left" size={16} /><span>{text}</span><span className="flow-button-circle" aria-hidden="true" /><ArrowRight className="flow-button-arrow flow-button-arrow-right" size={16} /></Link>;
const CarbonMark = ({ size = 24, ...props }) => <svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...props} aria-hidden="true"><path d="M24 2 44 13.5v21L24 46 4 34.5v-21L24 2Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/><path d="M32 16.5A12 12 0 1 0 32 31.5" stroke="currentColor" strokeWidth="5" strokeLinecap="square"/></svg>;
export const CategoryIcon = ({
  slug,
  ...props
}) => {
  const Icon = {
    industrial: Factory,
    glycols: Droplets,
    technical: Leaf,
    solvents: FlaskConical,
    carbon: CarbonMark
  }[slug] || FlaskConical;
  return <Icon {...props} aria-hidden="true" />;
};
function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const close = e => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProducts = catalogProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      {company.isTemplate && <div className="template-strip">Website template · Sample company & product information</div>}
      <div className="pill-header-container">
        <header className="pill-header">
          <Link className="brand" to="/" aria-label={`${company.name} home`}>
            <span className="logo-frame"><img src="/images/logo.png" alt={`${company.name} logo`} /></span>
            <span>{company.shortName}<small>IMPORTER &amp; EXPORTER</small></span>
          </Link>
          <nav id="navigation" className={open ? 'pill-nav open' : 'pill-nav'} aria-label="Main navigation">
            <NavLink to="/" end onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink to="/about">Our company</NavLink>
            <NavLink to="/products">Products</NavLink>
            <div className="nav-category-menu">
              <NavLink to="/categories" className="nav-category-trigger">Categories <ChevronDown className="nav-category-arrow" size={16} strokeWidth={2} aria-hidden="true" /></NavLink>
              <div className="nav-category-dropdown" aria-label="Product categories">
                {categories.map(category => (
                  <NavLink
                    key={category.slug}
                    to={`/products?category=${category.slug}`}
                    onClick={() => setOpen(false)}
                  >
                    {category.name}
                  </NavLink>
                ))}
              </div>
            </div>
            <NavLink to="/contact">Contact Us</NavLink>
          </nav>
          <div className="pill-actions">
            <div className="pill-search-container" ref={searchRef}>
              <form className="pill-search" onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
                  setSearchQuery('');
                  setShowSuggestions(false);
                  setOpen(false);
                }
              }}>
                 <input 
                   type="text" 
                   placeholder="Search..." 
                   value={searchQuery}
                   onChange={(e) => {
                     setSearchQuery(e.target.value);
                     setShowSuggestions(true);
                   }}
                   onFocus={() => setShowSuggestions(true)}
                 />
                 <button type="submit" aria-label="Search" className="pill-search-btn">Search <Search size={14} /></button>
              </form>
              {showSuggestions && searchQuery && filteredProducts.length > 0 && (
                <div className="search-suggestions">
                  {filteredProducts.map(p => (
                    <button 
                      key={p.slug}
                      type="button" 
                      className="suggestion-item"
                      onClick={() => {
                        navigate(`/products/${p.slug}`);
                        setSearchQuery('');
                        setShowSuggestions(false);
                        setOpen(false);
                      }}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="pill-menu-toggle" aria-expanded={open} aria-controls="navigation" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>
              {open ? <X color="white" /> : <Menu color="white" />}
            </button>
          </div>
        </header>
      </div>
    </>
  );
}
function Footer() {
  return <footer className="footer"><div className="footer-top"><div><Link className="brand" to="/"><span className="logo-frame"><img src="/images/business-card.jpg" alt="" /></span><span>{company.shortName}<small>IMPORTER &amp; EXPORTER</small></span></Link><p>Chemistry connects us.<br />Partnership moves us forward.</p></div><div><span className="eyebrow">EXPLORE</span><Link to="/about">Our company</Link><Link to="/products">Chemical catalog</Link><Link to="/categories">Product categories</Link></div><div><span className="eyebrow">LET’S TALK</span><Link to="/contact">Discuss your requirements <Arrow size={14} /></Link>{company.email && <a href={`mailto:${company.email}`}>{company.email}</a>}{company.phone && <a href={`tel:${company.phone.replace(/[^+\d]/g, '')}`}>{company.phone}</a>}</div><div><span className="eyebrow">YOUR NEXT INGREDIENT</span><p>Find the right material<br />for what comes next.</p><Button to="/contact" outline>Start an inquiry</Button></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {company.name}</span><span>{company.isTemplate ? 'Sample brand · Stock photography for illustration' : 'Lahore, Pakistan · Private Limited Company'}</span></div></footer>;
}
function Home() {
  return <>
    <section className="mobile-chemistry-hero" aria-label="Hussain and Co chemistry mobile introduction">
      <div className="mobile-hero-logo">
        <img src="/images/logo.png" alt="Hussain & Co logo" />
      </div>
      <h2 className="mobile-hero-title">
        <span>Hussain & Co</span>
        <small>IMPORTER & EXPORTER</small>
      </h2>
      <p className="mobile-hero-tagline">
        A world of chemistry. A partner for progress.
      </p>
      <Link to="/products" className="mobile-hero-btn">
        Explore Our Products <ArrowRight size={20} strokeWidth={2} />
      </Link>
      <div className="mobile-hero-features">
        <div className="feature-badge">
          <Globe2 size={24} strokeWidth={1.5} />
          <span>Global<br/>Sourcing</span>
        </div>
        <div className="feature-divider" />
        <div className="feature-badge">
          <ShieldCheck size={24} strokeWidth={1.5} />
          <span>Quality<br/>Assured</span>
        </div>
        <div className="feature-divider" />
        <div className="feature-badge">
          <Handshake size={24} strokeWidth={1.5} />
          <span>Trusted<br/>Partner</span>
        </div>
      </div>
    </section>
    <section className="uploaded-chemistry-hero" aria-label="Hussain and Co chemistry introduction">
      <img src="/images/home-hero-chemistry.png" alt="Hussain and Co importer and exporter chemistry introduction" fetchPriority="high" />
      <Link to="/products" className="image-overlay-btn">Explore Our Products <ArrowRight size={22} strokeWidth={2} /></Link>
    </section>
    <section className="hero"><div className="hero-copy"><h1>A world of chemistry.<br /><em>A partner</em><br />for progress.</h1><p>Established in 2018, Hussain &amp; Co brings 17 years of experience in the chemical industry. We import goods from various countries, supply the market, and trade locally. We offer a wide range of quality chemicals at competitive prices. Our vision is to deliver quality products and ensure timely delivery to our customers.</p><div className="hero-actions"><Button to="/products">Explore our products</Button><Link className="text-link" to="/about">Meet {company.shortName} <Arrow /></Link></div><div className="hero-note"><Globe2 size={26} strokeWidth={1.2} /><span>Built around your business.<br /><strong>From inquiry to import.</strong></span></div></div><div className="hero-visual"><img src={company.heroImage} alt="Industrial processing tanks — illustrative stock photograph" fetchPriority="high" /><div className="hero-image-shade" /><span className="image-caption">THE BUILDING BLOCKS OF BETTER BUSINESS</span><div className="orbit-badge"><Globe2 size={34} strokeWidth={1} /><span>GLOBAL THINKING<br />PERSONAL SERVICE</span></div><div className="visual-label"><span>01 / THE CONNECTION</span><strong>Good chemistry.<br />Stronger connections.</strong><Link to="/contact" aria-label="Discuss your sourcing requirements"><Arrow size={26} /></Link></div></div></section>
    <ChemicalTicker />
    <section className="section category-section"><div className="section-heading"><div><span className="eyebrow">OUR CHEMICAL PORTFOLIO</span><h2>Many industries.<br /><em>One connection.</em></h2></div><p>Find what you need.<br />Choose the products that fit your application.</p></div>        <div className="category-grid">{categories.map(c => <Link key={c.slug} className={`category-card ${categoryImages[c.slug] ? 'has-category-image' : ''}`} style={categoryImages[c.slug] ? { '--category-image': `url(${categoryImages[c.slug]})` } : undefined} to={`/products?category=${c.slug}`}><span className="category-number">{c.number}</span><CategoryIcon slug={c.slug} size={42} strokeWidth={1} /><h3>{c.name}</h3><p>{c.description}</p><span className="category-bottom">Explore category <span className="category-action"><Arrow /></span></span></Link>)}</div></section>    <section className="split-story section"><div className="story-image"><img src={company.companyImage} alt="Warehouse shelves — illustrative stock photograph" loading="lazy" /><span>THE PEOPLE BEHIND THE PROCESS</span></div><div className="story-copy"><span className="eyebrow">MORE THAN MATERIALS</span><h2>Business built on<br /><em>good chemistry.</em></h2><p>Established in 2018 and backed by over 17 years of industry expertise, Hussain &amp; Co. is a chemical importing and trading company connecting global manufacturers with the local market. For us, good chemistry extends beyond the materials we supply—it is reflected in the trust we earn and the lasting relationships we build.</p><p>We source and supply a comprehensive portfolio of high-purity chemicals, combining consistent quality with competitive pricing to support our customers’ evolving industrial needs.</p><p><strong>Our Vision:</strong> To advance our partners’ success through a steadfast commitment to product quality, dependable service, and timely delivery.</p>    <FlowButton to="/about" text="Get to know us" /></div></section>
    
    <section className="section process"><div className="section-heading"><div><span className="eyebrow">A CLEAR WAY FORWARD</span><h2>Your requirements.<br /><em>Our starting point.</em></h2></div><Button to="/contact" outline>Let’s talk sourcing</Button></div><div className="process-grid">{[['01', 'Share your brief', 'Tell us the chemical, grade, quantity, and delivery destination.'], ['02', 'Explore the fit', 'Review sourcing options, specifications, and required documentation.'], ['03', 'Plan the next step', 'Confirm commercial terms and logistics before placing an order.']].map(([n, t, d]) => <div key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}</div></section>
    <Callout /></>;
}
export function Callout() {
  return <section className="callout"><div><span className="eyebrow">LET’S MAKE THE CONNECTION</span><h2>What are you<br /><em>looking to source?</em></h2></div><div className="callout-whatsapp"><a className="whatsapp-qr" href="https://wa.me/923245121105" target="_blank" rel="noreferrer" aria-label="Open WhatsApp chat with Hussain & Co at +923245121105"><img src="/images/whatsapp-qr.svg" width="164" height="164" alt="Scan to chat on WhatsApp at +923245121105" /></a><div><span className="eyebrow whatsapp-heading"><img src="/images/whatsapp-logo.svg" width="22" height="22" alt="" aria-hidden="true" />CHAT ON WHATSAPP</span><p>Scan the QR code or tap it<br />to discuss your requirements.</p><a className="whatsapp-number" href="https://wa.me/923245121105" target="_blank" rel="noreferrer">+923245121105 <Arrow size={18} /></a></div></div><MoveUpRight className="callout-arrow" aria-hidden="true" /></section>;
}

// Shared route components.
import { Products, Categories, ProductDetail, About, Contact, ContactManager, NotFound } from './Pages.jsx';
export default function App() {
  const {
    pathname
  } = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
    document.title = `${{
      '/': 'Chemical Sourcing',
      '/products': 'Products',
      '/categories': 'Categories',
      '/about': 'Our Company',
      '/contact': 'Request a Quote', '/contact-manager': 'Contact Settings'
    }[pathname] || 'Product Details'} | ${company.name}`;
  }, [pathname]);
  return <><Header /><main id="main"><Routes><Route path="/" element={<Home />} /><Route path="/products" element={<Products />} /><Route path="/products/:slug" element={<ProductDetail />} /><Route path="/categories" element={<Categories />} /><Route path="/about" element={<About />} /><Route path="/contact" element={<Contact />} /><Route path="/contact-manager" element={<ContactManager />} /><Route path="*" element={<NotFound />} /></Routes></main><Footer /></>;
}
