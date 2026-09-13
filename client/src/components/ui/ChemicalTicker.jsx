const chemicalCards = [
  { name: 'Mix Xylene', label: 'Solvent', variant: 'xylene' },
  { name: 'Methanol Sabic', label: 'Solvent', variant: 'methanol' },
  { name: 'DMF', label: 'Solvent', variant: 'dmf' },
  { name: 'Cyclohexanone', label: 'Solvent', variant: 'cyclohexanone' },
  { name: 'Chloroform', label: 'Solvent', variant: 'chloroform' },
  { name: 'IPA 99.9%', label: 'Cleaning', variant: 'ipa' },
  { name: 'IPA 98%', label: 'Cleaning', variant: 'ipa' },
  { name: 'N-Butanol', label: 'Solvent', variant: 'butanol' },
  { name: 'ISO Butanol', label: 'Solvent', variant: 'butanol' },
  { name: 'Methyl Acetate', label: 'Solvent', variant: 'acetate' }
];

const chemicalRows = [
  chemicalCards.slice(0, 5),
  chemicalCards.slice(5)
];

const rowConfig = [
  { key: 'row-1', direction: 'ltr', duration: '36s' },
  { key: 'row-2', direction: 'rtl', duration: '42s' }
];

function BrandMark({ variant }) {
  const sharedProps = {
    viewBox: '0 0 64 64',
    fill: 'none',
    role: 'img',
    'aria-hidden': 'true'
  };

  switch (variant) {
    case 'xylene':
      return (
        <svg {...sharedProps}>
          <rect x="12" y="12" width="40" height="40" rx="12" fill="#F2F5FF" />
          <path d="M23 22h18v12c0 7-5 14-13 17-8-3-13-10-13-17V22Z" fill="#9AB7FF" opacity="0.25" />
          <path d="M24 24h16v10c0 5-4 10-8 12-4-2-8-7-8-12V24Z" fill="#5B7CFA" />
          <path d="M30 28h4v8h-4z" fill="#fff" opacity="0.9" />
          <path d="M28 32h8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'methanol':
      return (
        <svg {...sharedProps}>
          <rect x="12" y="12" width="40" height="40" rx="12" fill="#EAFBFF" />
          <path d="M22 22h20v22c0 6-5 11-12 11s-12-5-12-11V22Z" fill="#66C2FF" opacity="0.25" />
          <path d="M24 18h16v20c0 5-4 9-8 9s-8-4-8-9V18Z" fill="#26A9FF" />
          <path d="M27 36h10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          <path d="M32 25v16" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'dmf':
      return (
        <svg {...sharedProps}>
          <rect x="12" y="12" width="40" height="40" rx="12" fill="#FFF5E8" />
          <path d="M32 18v28M22 26h20M22 38h20" stroke="#FF9F43" strokeWidth="3" strokeLinecap="round" />
          <circle cx="32" cy="32" r="10" fill="#F9C784" opacity="0.35" />
        </svg>
      );
    case 'cyclohexanone':
      return (
        <svg {...sharedProps}>
          <rect x="12" y="12" width="40" height="40" rx="12" fill="#EFFBF3" />
          <path d="M22 22h20v22H22z" fill="#7AD19A" opacity="0.22" />
          <path d="M26 18h12v9h-12zM24 28h16v10H24z" fill="#2FBF71" />
          <path d="M28 32h8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'chloroform':
      return (
        <svg {...sharedProps}>
          <rect x="12" y="12" width="40" height="40" rx="12" fill="#F9F3FF" />
          <path d="M22 20h20v16c0 8-5 14-10 18-5-4-10-10-10-18V20Z" fill="#C6A4FF" opacity="0.25" />
          <path d="M24 22h16v14c0 5-3 9-8 12-5-3-8-7-8-12V22Z" fill="#8C5CFF" />
          <path d="M29 28h6v8h-6z" fill="#fff" opacity="0.9" />
        </svg>
      );
    case 'ipa':
      return (
        <svg {...sharedProps}>
          <rect x="12" y="12" width="40" height="40" rx="12" fill="#F1F9F5" />
          <path d="M20 18h24v28H20z" fill="#B4E7C9" opacity="0.35" />
          <path d="M26 22h12v20H26z" fill="#27B26A" />
          <path d="M30 26h4v12h-4z" fill="#fff" opacity="0.9" />
        </svg>
      );
    case 'butanol':
      return (
        <svg {...sharedProps}>
          <rect x="12" y="12" width="40" height="40" rx="12" fill="#FFF3F3" />
          <path d="M22 18h20v28H22z" fill="#FBB3B3" opacity="0.4" />
          <path d="M24 22h16v20H24z" fill="#F66B6B" />
          <path d="M28 26h8v12h-8z" fill="#fff" opacity="0.9" />
        </svg>
      );
    case 'acetate':
      return (
        <svg {...sharedProps}>
          <rect x="12" y="12" width="40" height="40" rx="12" fill="#FFF8EE" />
          <path d="M22 24c0-3 2-5 5-5h10c3 0 5 2 5 5v16c0 6-5 11-11 11s-11-5-11-11V24Z" fill="#FFB84D" opacity="0.24" />
          <path d="M26 22h12v18c0 4-3 7-7 7s-7-3-7-7V22Z" fill="#FF9D1A" />
          <path d="M30 27h4v10h-4z" fill="#fff" opacity="0.9" />
        </svg>
      );
    default:
      return null;
  }
}

function TickerCard({ name, label, variant }) {
  return (
    <div className="chemical-ticker-item" aria-label={`${name} ${label}`}>
      <span className="chemical-ticker-icon" aria-hidden="true">
        <BrandMark variant={variant} />
      </span>
      <div className="logo-block-text">
        <span className="chemical-ticker-name">{name}</span>
        <span className="chemical-ticker-category">{label}</span>
      </div>
    </div>
  );
}

export function ChemicalTicker() {
  return (
    <section className="chemical-ticker-section" aria-label="Chemical product ticker">
      {rowConfig.map(({ key, direction, duration }, rowIndex) => {
        // Repeat each sequence enough times that either animation direction stays filled.
        const rowItems = Array.from({ length: 4 }, () => chemicalRows[rowIndex]).flat();

        return (
          <div
            key={key}
            className={`chemical-ticker-row chemical-ticker-row--${direction}`}
            style={{ '--ticker-duration': duration }}
          >
            <div className="chemical-ticker-track" aria-hidden="true">
              {rowItems.map((item, index) => (
                <TickerCard
                  key={`${key}-${item.name}-${index}`}
                  name={item.name}
                  label={item.label}
                  variant={item.variant}
                />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
