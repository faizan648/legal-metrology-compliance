/**
 * Benchmark Sample Products Dataset for Legal Metrology Inspection System
 * Pre-configured realistic product packaging test cases for instant analysis.
 */

export const SAMPLE_PRODUCTS = [
  {
    id: 'sample-1',
    name: 'PureGold Refined Sunflower Oil (5 L)',
    category: 'Edible Oils, Vanaspati, Ghee',
    brand: 'PureGold Agri Foods',
    description: 'Fully compliant 5 Litre edible oil container with all Legal Metrology declarations.',
    isCompliantTarget: true,
    labelBgColor: '#1e293b',
    svgLabel: `<svg viewBox="0 0 600 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="400" fill="#0f172a" rx="16"/>
      <rect x="20" y="20" width="560" height="360" fill="#1e293b" stroke="#eab308" stroke-width="3" rx="12"/>
      <!-- Header -->
      <text x="300" y="60" font-family="Outfit" font-size="26" font-weight="bold" fill="#facc15" text-anchor="middle">PUREGOLD REFINED SUNFLOWER OIL</text>
      <text x="300" y="85" font-family="Inter" font-size="14" fill="#94a3b8" text-anchor="middle">Generic Name: Edible Sunflower Oil</text>
      
      <!-- Net Quantity (Rule 6 & 7) -->
      <rect x="40" y="110" width="240" height="90" fill="#0f172a" stroke="#6366f1" stroke-width="2" rx="8"/>
      <text x="50" y="135" font-family="Inter" font-size="12" fill="#818cf8">NET QUANTITY (Rule 6 &amp; 7)</text>
      <text x="50" y="175" font-family="Outfit" font-size="32" font-weight="bold" fill="#38bdf8">5 L</text>
      <text x="125" y="175" font-family="Inter" font-size="12" fill="#94a3b8">(5000 ml)</text>

      <!-- MRP (Rule 6(1)(e)) -->
      <rect x="320" y="110" width="240" height="90" fill="#0f172a" stroke="#10b981" stroke-width="2" rx="8"/>
      <text x="330" y="135" font-family="Inter" font-size="12" fill="#34d399">MAX RETAIL PRICE</text>
      <text x="330" y="170" font-family="Outfit" font-size="26" font-weight="bold" fill="#f8fafc">MRP Rs 750.00</text>
      <text x="330" y="190" font-family="Inter" font-size="12" fill="#94a3b8">incl. of all taxes</text>

      <!-- Manufacturer & Date (Rule 6 & 10) -->
      <rect x="40" y="220" width="240" height="140" fill="#0f172a" stroke="#334155" rx="8"/>
      <text x="50" y="245" font-family="Inter" font-size="12" font-weight="bold" fill="#f8fafc">MANUFACTURED &amp; PACKED BY:</text>
      <text x="50" y="265" font-family="Inter" font-size="12" fill="#cbd5e1">PureGold Foods Pvt Ltd</text>
      <text x="50" y="285" font-family="Inter" font-size="11" fill="#94a3b8">Plot 45, GIDC Industrial Estate,</text>
      <text x="50" y="300" font-family="Inter" font-size="11" fill="#94a3b8">Ahmedabad, Gujarat - 382445</text>
      <text x="50" y="325" font-family="Inter" font-size="12" fill="#facc15">Mfg Date: 08/2026</text>
      <text x="50" y="345" font-family="Inter" font-size="11" fill="#94a3b8">Batch No: PG-2026-08A</text>

      <!-- Consumer Care (Rule 6(2)) -->
      <rect x="320" y="220" width="240" height="140" fill="#0f172a" stroke="#334155" rx="8"/>
      <text x="330" y="245" font-family="Inter" font-size="12" font-weight="bold" fill="#f8fafc">FOR CONSUMER COMPLAINTS:</text>
      <text x="330" y="265" font-family="Inter" font-size="11" fill="#cbd5e1">Consumer Care Cell Officer</text>
      <text x="330" y="285" font-family="Inter" font-size="11" fill="#94a3b8">Address: PureGold HQ, Ahmedabad</text>
      <text x="330" y="305" font-family="Inter" font-size="11" fill="#38bdf8">Toll-Free: 1800-123-4567</text>
      <text x="330" y="325" font-family="Inter" font-size="11" fill="#38bdf8">Email: care@puregoldfoods.in</text>
    </svg>`,
    productData: {
      manufacturerName: 'PureGold Foods Pvt Ltd',
      manufacturerAddress: 'Plot 45, GIDC Industrial Estate, Ahmedabad, Gujarat - 382445',
      isImported: false,
      genericName: 'Edible Sunflower Oil',
      netQuantityValue: 5,
      netQuantityUnit: 'l',
      mfgMonth: '08',
      mfgYear: '2026',
      mrpValue: 750,
      mrpRawText: 'MRP Rs 750.00 incl. of all taxes',
      consumerCarePhone: '1800-123-4567',
      consumerCareEmail: 'care@puregoldfoods.in',
      consumerCareAddress: 'PureGold HQ, Ahmedabad - 382445',
      fontHeightMm: 4.5,
      pdpAreaCm2: 450,
      isEmbossed: false,
      surroundingPaddingTopBottomMm: 6,
      surroundingPaddingLeftRightMm: 12,
      hasMRPSticker: false,
      isMRPStickerLowering: true,
      slackFillPercent: 8,
      category: 'Edible Oils, Vanaspati, Ghee',
      hasNonStandardWarning: false
    },
    boundingBoxes: [
      { id: 'bb-1', label: 'Net Quantity (Rule 6(1)(c))', x: 40, y: 110, w: 240, h: 90, color: '#6366f1' },
      { id: 'bb-2', label: 'MRP & Tax (Rule 6(1)(e))', x: 320, y: 110, w: 240, h: 90, color: '#10b981' },
      { id: 'bb-3', label: 'Manufacturer & Address (Rule 6 & 10)', x: 40, y: 220, w: 240, h: 140, color: '#3b82f6' },
      { id: 'bb-4', label: 'Consumer Helpline (Rule 6(2))', x: 320, y: 220, w: 240, h: 140, color: '#06b6d4' }
    ]
  },
  {
    id: 'sample-2',
    name: 'CrunchyBite Butter Biscuits (175 g)',
    category: 'Biscuits',
    brand: 'CrunchyBite Bakers',
    description: 'Non-compliant biscuit package with missing tax declaration, tiny font height (0.7mm), and illegal price sticker.',
    isCompliantTarget: false,
    labelBgColor: '#271c19',
    svgLabel: `<svg viewBox="0 0 600 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="400" fill="#18100e" rx="16"/>
      <rect x="20" y="20" width="560" height="360" fill="#291a18" stroke="#f97316" stroke-width="2" rx="12"/>
      <!-- Header -->
      <text x="300" y="55" font-family="Outfit" font-size="28" font-weight="bold" fill="#fdba74" text-anchor="middle">CRUNCHYBITE BUTTER BISCUITS</text>

      <!-- Net Quantity (Violates Rule 7 - Font Height 0.7mm) -->
      <rect x="40" y="90" width="240" height="70" fill="#18100e" stroke="#ef4444" stroke-width="2" rx="8"/>
      <text x="50" y="110" font-family="Inter" font-size="10" fill="#f87171">NET QUANTITY (VIOLATION: Font size 0.7mm)</text>
      <text x="50" y="140" font-family="Inter" font-size="10" fill="#fdba74">Net Qty: 175 g (Non-standard pack size)</text>

      <!-- MRP (Violates Rule 6(1)(e) - Missing Tax disclaimer) -->
      <rect x="320" y="90" width="240" height="70" fill="#18100e" stroke="#ef4444" stroke-width="2" rx="8"/>
      <text x="330" y="110" font-family="Inter" font-size="10" fill="#f87171">PRICE DECLARATION (VIOLATION)</text>
      <text x="330" y="135" font-family="Outfit" font-size="20" font-weight="bold" fill="#f8fafc">MRP: Rs. 65.00</text>
      <text x="330" y="150" font-family="Inter" font-size="9" fill="#ef4444">[MISSING: "incl. of all taxes"]</text>

      <!-- Illegal Price Over-Sticker (Violates Rule 6(3)) -->
      <rect x="420" y="115" width="130" height="40" fill="#dc2626" stroke="#f8fafc" stroke-width="1.5" rx="4"/>
      <text x="485" y="132" font-family="Inter" font-size="10" font-weight="bold" fill="#ffffff" text-anchor="middle">STICKER: Rs. 75.00</text>
      <text x="485" y="146" font-family="Inter" font-size="8" fill="#fef08a" text-anchor="middle">Rule 6(3) Illegal Overlay</text>

      <!-- Manufacturer & Date -->
      <rect x="40" y="180" width="240" height="180" fill="#18100e" stroke="#ef4444" stroke-width="1.5" rx="8"/>
      <text x="50" y="205" font-family="Inter" font-size="11" font-weight="bold" fill="#f8fafc">PACKED BY:</text>
      <text x="50" y="225" font-family="Inter" font-size="11" fill="#cbd5e1">CrunchyBite Confectioners</text>
      <text x="50" y="245" font-family="Inter" font-size="9" fill="#ef4444">Address: Industrial Area, Jaipur</text>
      <text x="50" y="260" font-family="Inter" font-size="9" fill="#ef4444">[VIOLATION: Incomplete address, No PIN]</text>
      <text x="50" y="290" font-family="Inter" font-size="11" fill="#fdba74">Mfg: 06/2026</text>

      <!-- Consumer Care -->
      <rect x="320" y="180" width="240" height="180" fill="#18100e" stroke="#ef4444" stroke-width="1.5" rx="8"/>
      <text x="330" y="205" font-family="Inter" font-size="11" font-weight="bold" fill="#f8fafc">CUSTOMER CARE:</text>
      <text x="330" y="230" font-family="Inter" font-size="10" fill="#ef4444">[MISSING: Email &amp; Complete Address]</text>
      <text x="330" y="255" font-family="Inter" font-size="11" fill="#cbd5e1">Ph: 0141-998877</text>
    </svg>`,
    productData: {
      manufacturerName: 'CrunchyBite Confectioners',
      manufacturerAddress: 'Industrial Area, Jaipur',
      isImported: false,
      genericName: 'Butter Biscuits',
      netQuantityValue: 175,
      netQuantityUnit: 'g',
      mfgMonth: '06',
      mfgYear: '2026',
      mrpValue: 65,
      mrpRawText: 'MRP: Rs. 65.00',
      consumerCarePhone: '0141-998877',
      consumerCareEmail: '',
      consumerCareAddress: '',
      fontHeightMm: 0.7,
      pdpAreaCm2: 220,
      isEmbossed: false,
      surroundingPaddingTopBottomMm: 0.5,
      surroundingPaddingLeftRightMm: 1.0,
      hasMRPSticker: true,
      isMRPStickerLowering: false,
      slackFillPercent: 18,
      category: 'Biscuits',
      hasNonStandardWarning: false
    },
    boundingBoxes: [
      { id: 'bb-1', label: 'Font Height Violation (Rule 7)', x: 40, y: 90, w: 240, h: 70, color: '#ef4444' },
      { id: 'bb-2', label: 'MRP Tax & Sticker Violation (Rule 6(1)(e) & 6(3))', x: 320, y: 90, w: 240, h: 70, color: '#ef4444' },
      { id: 'bb-3', label: 'Address PIN Missing (Rule 10)', x: 40, y: 180, w: 240, h: 180, color: '#f59e0b' },
      { id: 'bb-4', label: 'Incomplete Consumer Care (Rule 6(2))', x: 320, y: 180, w: 240, h: 180, color: '#ef4444' }
    ]
  },
  {
    id: 'sample-3',
    name: 'Sparkle Clean Washing Powder (1.2 kg)',
    category: 'Non-soapy detergents',
    brand: 'Sparkle Clean',
    description: 'Deceptive packaging violation container with 55% empty slack fill air space.',
    isCompliantTarget: false,
    labelBgColor: '#0f2942',
    svgLabel: `<svg viewBox="0 0 600 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="400" fill="#0b192c" rx="16"/>
      <rect x="20" y="20" width="560" height="360" fill="#152c48" stroke="#38bdf8" stroke-width="2" rx="12"/>

      <!-- Header -->
      <text x="300" y="55" font-family="Outfit" font-size="28" font-weight="bold" fill="#38bdf8" text-anchor="middle">SPARKLE CLEAN DETERGENT</text>

      <!-- Deceptive Fill Box Diagram -->
      <rect x="40" y="85" width="220" height="270" fill="#0b192c" stroke="#ef4444" stroke-width="2" rx="8"/>
      <text x="150" y="110" font-family="Inter" font-size="12" font-weight="bold" fill="#f87171" text-anchor="middle">CONTAINER SLACK FILL ANALYSIS</text>
      <!-- Container Visual -->
      <rect x="80" y="125" width="140" height="200" fill="#1e293b" stroke="#94a3b8" stroke-width="2" rx="6"/>
      <rect x="82" y="127" width="136" height="110" fill="rgba(239,68,68,0.25)" stroke="#ef4444" stroke-dasharray="4"/>
      <text x="150" y="180" font-family="Outfit" font-size="14" font-weight="bold" fill="#f87171" text-anchor="middle">55% EMPTY AIR</text>
      <rect x="82" y="237" width="136" height="86" fill="rgba(56,189,248,0.4)"/>
      <text x="150" y="280" font-family="Inter" font-size="12" fill="#38bdf8" text-anchor="middle">45% Powder Content</text>

      <!-- Declarations -->
      <rect x="280" y="85" width="280" height="270" fill="#0b192c" stroke="#334155" rx="8"/>
      <text x="295" y="115" font-family="Inter" font-size="12" fill="#cbd5e1">Generic: Washing Powder Detergent</text>
      <text x="295" y="145" font-family="Outfit" font-size="22" font-weight="bold" fill="#38bdf8">Net Qty: 1.2 kg</text>
      <text x="295" y="180" font-family="Outfit" font-size="20" font-weight="bold" fill="#34d399">MRP Rs 240.00 incl. of all taxes</text>
      <text x="295" y="210" font-family="Inter" font-size="11" fill="#cbd5e1">Mfd: Sparkle Detergents Ltd</text>
      <text x="295" y="230" font-family="Inter" font-size="11" fill="#94a3b8">MIDC Estate, Thane, MH - 400601</text>
      <text x="295" y="255" font-family="Inter" font-size="11" fill="#facc15">Mfg Date: 07/2026</text>
      <text x="295" y="285" font-family="Inter" font-size="11" fill="#ef4444" font-weight="bold">VIOLATION: Rule 23 Deceptive Packaging</text>
      <text x="295" y="305" font-family="Inter" font-size="10" fill="#f87171">Excessive slack fill misleads consumer</text>
    </svg>`,
    productData: {
      manufacturerName: 'Sparkle Detergents Ltd',
      manufacturerAddress: 'MIDC Estate, Thane, MH - 400601',
      isImported: false,
      genericName: 'Washing Powder Detergent',
      netQuantityValue: 1.2,
      netQuantityUnit: 'kg',
      mfgMonth: '07',
      mfgYear: '2026',
      mrpValue: 240,
      mrpRawText: 'MRP Rs 240.00 incl. of all taxes',
      consumerCarePhone: '1800-888-9999',
      consumerCareEmail: 'care@sparkleclean.com',
      consumerCareAddress: 'Thane, MH - 400601',
      fontHeightMm: 3.0,
      pdpAreaCm2: 380,
      isEmbossed: false,
      surroundingPaddingTopBottomMm: 4,
      surroundingPaddingLeftRightMm: 8,
      hasMRPSticker: false,
      isMRPStickerLowering: true,
      slackFillPercent: 55,
      category: 'Non-soapy detergents',
      hasNonStandardWarning: false
    },
    boundingBoxes: [
      { id: 'bb-1', label: 'Rule 23 Deceptive Slack Fill (55% Air)', x: 40, y: 85, w: 220, h: 270, color: '#ef4444' }
    ]
  },
  {
    id: 'sample-4',
    name: 'Alps Luxury Dark Chocolate Bar (100 g)',
    category: 'Confectionery',
    brand: 'Alps Chocolatier',
    description: 'Imported product missing Indian Importer Name/Address, PIN code & Country of Origin (Rule 6 & 10 Violation).',
    isCompliantTarget: false,
    labelBgColor: '#2a1a24',
    svgLabel: `<svg viewBox="0 0 600 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="400" fill="#1a0f16" rx="16"/>
      <rect x="20" y="20" width="560" height="360" fill="#2d1726" stroke="#c084fc" stroke-width="2" rx="12"/>

      <!-- Header -->
      <text x="300" y="55" font-family="Outfit" font-size="28" font-weight="bold" fill="#e9d5ff" text-anchor="middle">ALPS LUXURY DARK CHOCOLATE 70%</text>

      <!-- Declarations -->
      <rect x="40" y="90" width="240" height="120" fill="#1a0f16" stroke="#c084fc" rx="8"/>
      <text x="50" y="115" font-family="Inter" font-size="12" fill="#e9d5ff">Generic: Dark Chocolate</text>
      <text x="50" y="145" font-family="Outfit" font-size="24" font-weight="bold" fill="#38bdf8">Net Qty: 100 g</text>
      <text x="50" y="180" font-family="Outfit" font-size="18" font-weight="bold" fill="#34d399">MRP Rs 350.00 incl. of all taxes</text>

      <!-- Foreign Manufacturer -->
      <rect x="320" y="90" width="240" height="120" fill="#1a0f16" stroke="#334155" rx="8"/>
      <text x="330" y="115" font-family="Inter" font-size="11" font-weight="bold" fill="#f8fafc">MANUFACTURED IN SWITZERLAND BY:</text>
      <text x="330" y="135" font-family="Inter" font-size="11" fill="#cbd5e1">Alps Chocolatier SA, Zurich</text>
      <text x="330" y="165" font-family="Inter" font-size="11" fill="#facc15">Pkg Date: 05/2026</text>

      <!-- Import Violation Warning Box -->
      <rect x="40" y="230" width="520" height="120" fill="#1a0f16" stroke="#ef4444" stroke-width="2" rx="8"/>
      <text x="50" y="255" font-family="Inter" font-size="12" font-weight="bold" fill="#f87171">IMPORT RULE VIOLATIONS (Rule 6(1)(a) &amp; Rule 10):</text>
      <text x="50" y="280" font-family="Inter" font-size="11" fill="#ef4444">1. Missing Name &amp; Complete Address of Indian Importer.</text>
      <text x="50" y="300" font-family="Inter" font-size="11" fill="#ef4444">2. Missing Postal Index Number (PIN Code) of importer office in India.</text>
      <text x="50" y="320" font-family="Inter" font-size="11" fill="#ef4444">3. Missing explicit "Country of Origin" declaration.</text>
    </svg>`,
    productData: {
      manufacturerName: 'Alps Chocolatier SA, Zurich',
      manufacturerAddress: 'Zurich, Switzerland',
      isImported: true,
      importerName: '',
      importerAddress: '',
      countryOfOrigin: '',
      genericName: 'Dark Chocolate',
      netQuantityValue: 100,
      netQuantityUnit: 'g',
      mfgMonth: '05',
      mfgYear: '2026',
      mrpValue: 350,
      mrpRawText: 'MRP Rs 350.00 incl. of all taxes',
      consumerCarePhone: '',
      consumerCareEmail: 'care@alpschocolatier.ch',
      consumerCareAddress: '',
      fontHeightMm: 2.0,
      pdpAreaCm2: 180,
      isEmbossed: false,
      surroundingPaddingTopBottomMm: 3,
      surroundingPaddingLeftRightMm: 6,
      hasMRPSticker: false,
      isMRPStickerLowering: true,
      slackFillPercent: 5,
      category: 'Confectionery',
      hasNonStandardWarning: false
    },
    boundingBoxes: [
      { id: 'bb-1', label: 'Import Rule Violations (Rule 6 & 10)', x: 40, y: 230, w: 520, h: 120, color: '#ef4444' }
    ]
  },
  {
    id: 'sample-5',
    name: 'Royal Aroma Assam CTC Tea (175 g)',
    category: 'Tea',
    brand: 'Royal Aroma Tea',
    description: 'Packed in non-standard quantity (175g) without Second Schedule mandatory warning declaration.',
    isCompliantTarget: false,
    labelBgColor: '#172554',
    svgLabel: `<svg viewBox="0 0 600 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <rect width="600" height="400" fill="#0f172a" rx="16"/>
      <rect x="20" y="20" width="560" height="360" fill="#1e293b" stroke="#3b82f6" stroke-width="2" rx="12"/>

      <!-- Header -->
      <text x="300" y="55" font-family="Outfit" font-size="28" font-weight="bold" fill="#60a5fa" text-anchor="middle">ROYAL AROMA ASSAM CTC TEA</text>

      <!-- Net Qty (Non-Standard Pack Size) -->
      <rect x="40" y="90" width="240" height="100" fill="#0f172a" stroke="#ef4444" stroke-width="2" rx="8"/>
      <text x="50" y="115" font-family="Inter" font-size="11" fill="#f87171">NET QTY: 175 g (VIOLATION)</text>
      <text x="50" y="145" font-family="Outfit" font-size="28" font-weight="bold" fill="#ef4444">175 g</text>
      <text x="50" y="170" font-family="Inter" font-size="10" fill="#f87171">Prescribed Tea Sizes: 100g, 125g, 250g, 500g</text>

      <!-- MRP -->
      <rect x="320" y="90" width="240" height="100" fill="#0f172a" stroke="#10b981" rx="8"/>
      <text x="330" y="115" font-family="Inter" font-size="11" fill="#34d399">MAX RETAIL PRICE</text>
      <text x="330" y="150" font-family="Outfit" font-size="22" font-weight="bold" fill="#f8fafc">MRP Rs 140.00</text>
      <text x="330" y="170" font-family="Inter" font-size="11" fill="#94a3b8">incl. of all taxes</text>

      <!-- Details -->
      <rect x="40" y="210" width="520" height="140" fill="#0f172a" stroke="#ef4444" stroke-width="1.5" rx="8"/>
      <text x="50" y="235" font-family="Inter" font-size="11" font-weight="bold" fill="#f8fafc">MANUFACTURER DETAILS:</text>
      <text x="50" y="255" font-family="Inter" font-size="11" fill="#cbd5e1">Royal Aroma Tea Estates Ltd, Dibrugarh, Assam - 786001</text>
      <text x="50" y="275" font-family="Inter" font-size="11" fill="#facc15">Mfg Date: 08/2026 | Helpline: 1800-444-5555</text>
      <text x="50" y="305" font-family="Inter" font-size="11" font-weight="bold" fill="#ef4444">MISSING DECLARATION (Rule 5 &amp; Second Schedule):</text>
      <text x="50" y="325" font-family="Inter" font-size="10" fill="#f87171">Missing warning: "Not a standard pack size under Legal Metrology (Packaged Commodities) Rules, 2011"</text>
    </svg>`,
    productData: {
      manufacturerName: 'Royal Aroma Tea Estates Ltd',
      manufacturerAddress: 'Dibrugarh, Assam - 786001',
      isImported: false,
      genericName: 'Assam CTC Tea',
      netQuantityValue: 175,
      netQuantityUnit: 'g',
      mfgMonth: '08',
      mfgYear: '2026',
      mrpValue: 140,
      mrpRawText: 'MRP Rs 140.00 incl. of all taxes',
      consumerCarePhone: '1800-444-5555',
      consumerCareEmail: 'care@royalaromatea.com',
      consumerCareAddress: 'Dibrugarh, Assam - 786001',
      fontHeightMm: 3.5,
      pdpAreaCm2: 250,
      isEmbossed: false,
      surroundingPaddingTopBottomMm: 5,
      surroundingPaddingLeftRightMm: 10,
      hasMRPSticker: false,
      isMRPStickerLowering: true,
      slackFillPercent: 12,
      category: 'Tea',
      hasNonStandardWarning: false
    },
    boundingBoxes: [
      { id: 'bb-1', label: 'Rule 5 & 2nd Schedule Non-Standard Pack Size', x: 40, y: 90, w: 240, h: 100, color: '#ef4444' },
      { id: 'bb-2', label: 'Missing Non-Standard Warning Notice', x: 40, y: 210, w: 520, h: 140, color: '#ef4444' }
    ]
  }
];
