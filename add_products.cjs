const fs = require('fs');
const path = 'c:/Users/IBS TRADER/Downloads/hussain-co-mern/shared/catalog.js';
let content = fs.readFileSync(path, 'utf8');

const items = [
  'PVA Bp26 china', 'CMC china', 'HEC', 'HPMC', 'Para formaldehyde saudia',
  'Sodium formate taiwan', 'Sodium Hyrosulphite 90%', 'Xanthum gum china',
  'Chromic acid', 'Oxalic acid', 'Titanium dioxide R996', 'Titanium dioxide 6618',
  'Magnesium sulphate', 'Magnese sulphate', 'Copper sulphate', 'Nitrosol',
  'Potassium Carbonate', 'Potassium Hydroxide', 'Citric Acid', 'Boric Acid',
  'Sulphur Elemental', 'Maleic Anhydrous', 'Pathalic Anhydrous'
];

let newProducts = items.map((name, idx) => {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `  {
    "slug": "${slug}",
    "name": "${name}",
    "category": "other",
    "grade": "Confirm with our team",
    "purity": "Specification on request",
    "packaging": "On request",
    "origin": "Confirm with quotation",
    "needsConfirmation": false,
    "cas": "",
    "image": "/images/drum.png",
    "imageLabel": "Illustrative category photograph",
    "description": "${name} is part of the Hussain & Co product list. Send your required specification, quantity, and destination for a quotation.",
    "applications": [],
    "moq": "Confirm with quotation",
    "sdsUrl": "",
    "tdsUrl": "",
    "featured": false,
    "order": ${53 + idx}
  }`;
}).join(',\n');

content = content.substring(0, content.lastIndexOf('}')) + '},\n' + newProducts + '\n];\n';
fs.writeFileSync(path, content, 'utf8');
console.log('Appended items to catalog.js correctly');
