/**
 * Legal Metrology (Packaged Commodities) Rules, 2011 - Rule Engine
 * Comprehensive rule-based validator for packaged commodities in India.
 */

// Schedule II Standard Pack Sizes Definition
export const SECOND_SCHEDULE_RULES = {
  'Baby food': {
    units: ['g', 'kg'],
    allowed: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 5000, 10000]
  },
  'Weaning food': {
    units: ['g', 'kg'],
    allowed: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 2000, 5000, 10000]
  },
  'Biscuits': {
    units: ['g', 'kg'],
    allowed: [25, 50, 75, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000]
  },
  'Bread': {
    units: ['g', 'kg'],
    stepAbove: 100
  },
  'Butter and Margarine': {
    units: ['g', 'kg'],
    allowed: [25, 50, 100, 200, 500, 1000, 2000, 5000]
  },
  'Cereals and Pulses': {
    units: ['g', 'kg'],
    allowed: [100, 200, 500, 1000, 2000, 5000]
  },
  'Coffee': {
    units: ['g', 'kg'],
    allowed: [25, 50, 100, 200, 250, 500, 1000]
  },
  'Tea': {
    units: ['g', 'kg'],
    allowed: [25, 50, 100, 125, 250, 500, 1000]
  },
  'Edible Oils, Vanaspati, Ghee': {
    units: ['g', 'kg', 'ml', 'l'],
    allowed: [50, 100, 200, 500, 1000, 2000, 3000, 5000]
  },
  'Milk Powder': {
    units: ['g', 'kg'],
    allowed: [50, 100, 200, 500, 1000],
    allowBelow: 50
  },
  'Salt': {
    units: ['g', 'kg'],
    allowed: [10, 20, 30, 40, 50, 100, 200, 500, 750, 1000, 2000, 5000]
  },
  'Soaps': {
    units: ['g'],
    allowed: [25, 50, 75, 100, 125, 150, 200, 250, 300]
  },
  'Mineral water and drinking water': {
    units: ['ml', 'l'],
    allowed: [100, 150, 200, 250, 300, 500, 750, 1000, 1500, 2000, 3000, 4000, 5000]
  },
  'Cement': {
    units: ['kg'],
    allowed: [1000, 2000, 5000, 10000, 20000, 25000, 40000, 50000]
  }
};

/**
 * Calculates Maximum Permissible Error (MPE) under First Schedule
 * @param {number} value - Declared quantity value
 * @param {string} unit - Unit ('g', 'kg', 'ml', 'l', 'N', 'm', etc.)
 * @returns {object} - { mpeValue, mpeUnit, mpePercentage, text }
 */
export function calculateMPE(value, unit) {
  let valInGramsOrMl = value;
  const lowerUnit = (unit || '').toLowerCase();
  
  if (lowerUnit === 'kg' || lowerUnit === 'l' || lowerUnit === 'litre') {
    valInGramsOrMl = value * 1000;
  }

  // Weight / Volume MPE (Table I)
  if (['g', 'kg', 'ml', 'l', 'litre', 'gram'].includes(lowerUnit)) {
    if (valInGramsOrMl <= 50) {
      const err = valInGramsOrMl * 0.09;
      return { mpeValue: Number(err.toFixed(2)), mpeUnit: lowerUnit.includes('l') ? 'ml' : 'g', mpePercentage: 9.0, text: '9.0% of declared quantity' };
    } else if (valInGramsOrMl <= 100) {
      return { mpeValue: 4.5, mpeUnit: lowerUnit.includes('l') ? 'ml' : 'g', mpePercentage: (4.5 / valInGramsOrMl) * 100, text: '4.5 g/ml' };
    } else if (valInGramsOrMl <= 200) {
      const err = valInGramsOrMl * 0.045;
      return { mpeValue: Number(err.toFixed(2)), mpeUnit: lowerUnit.includes('l') ? 'ml' : 'g', mpePercentage: 4.5, text: '4.5% of declared quantity' };
    } else if (valInGramsOrMl <= 300) {
      return { mpeValue: 9, mpeUnit: lowerUnit.includes('l') ? 'ml' : 'g', mpePercentage: (9 / valInGramsOrMl) * 100, text: '9.0 g/ml' };
    } else if (valInGramsOrMl <= 500) {
      const err = valInGramsOrMl * 0.03;
      return { mpeValue: Number(err.toFixed(2)), mpeUnit: lowerUnit.includes('l') ? 'ml' : 'g', mpePercentage: 3.0, text: '3.0% of declared quantity' };
    } else if (valInGramsOrMl <= 1000) {
      return { mpeValue: 15, mpeUnit: lowerUnit.includes('l') ? 'ml' : 'g', mpePercentage: (15 / valInGramsOrMl) * 100, text: '15.0 g/ml' };
    } else if (valInGramsOrMl <= 10000) {
      const err = valInGramsOrMl * 0.015;
      return { mpeValue: Number(err.toFixed(2)), mpeUnit: lowerUnit.includes('l') ? 'ml' : 'g', mpePercentage: 1.5, text: '1.5% of declared quantity' };
    } else if (valInGramsOrMl <= 15000) {
      return { mpeValue: 150, mpeUnit: lowerUnit.includes('l') ? 'ml' : 'g', mpePercentage: (150 / valInGramsOrMl) * 100, text: '150 g/ml' };
    } else {
      const err = valInGramsOrMl * 0.01;
      return { mpeValue: Number(err.toFixed(2)), mpeUnit: lowerUnit.includes('l') ? 'ml' : 'g', mpePercentage: 1.0, text: '1.0% of declared quantity' };
    }
  }

  // Count / Number MPE (Table II)
  if (['n', 'u', 'number', 'count', 'pcs', 'pieces'].includes(lowerUnit)) {
    const err = value * 0.02;
    return { mpeValue: Number(err.toFixed(1)), mpeUnit: 'units', mpePercentage: 2.0, text: '2.0% of declared count' };
  }

  return { mpeValue: 0, mpeUnit: unit, mpePercentage: 0, text: 'Standard tolerance' };
}

/**
 * Calculates Required Minimum Height for Numerals/Letters under Rule 7 (Table I & II)
 * @param {number} netQtyValue - Declared net quantity value
 * @param {string} unit - Unit of measurement
 * @param {number} pdpAreaCm2 - Principal Display Panel Area in sq cm (optional)
 * @param {boolean} isBlownOrEmbossed - Whether text is blown/molded/embossed on container
 * @returns {object} - { minNumeralHeightMm, minLetterHeightMm, ruleRef }
 */
export function getRequiredFontDimensions(netQtyValue = 0, unit = 'g', pdpAreaCm2 = 0, isBlownOrEmbossed = false) {
  let qtyInGramsOrMl = netQtyValue;
  const lowerUnit = (unit || '').toLowerCase();

  if (lowerUnit === 'kg' || lowerUnit === 'l' || lowerUnit === 'litre') {
    qtyInGramsOrMl = netQtyValue * 1000;
  }

  let minNumeralHeight = 1;

  if (pdpAreaCm2 > 0) {
    // Table II (Based on PDP Area)
    if (pdpAreaCm2 <= 100) {
      minNumeralHeight = isBlownOrEmbossed ? 2 : 1;
    } else if (pdpAreaCm2 <= 500) {
      minNumeralHeight = isBlownOrEmbossed ? 4 : 2;
    } else if (pdpAreaCm2 <= 2500) {
      minNumeralHeight = isBlownOrEmbossed ? 6 : 4;
    } else {
      minNumeralHeight = 6;
    }
  } else {
    // Table I (Based on Net Quantity Weight/Volume)
    if (qtyInGramsOrMl <= 200) {
      minNumeralHeight = isBlownOrEmbossed ? 2 : 1;
    } else if (qtyInGramsOrMl <= 500) {
      minNumeralHeight = isBlownOrEmbossed ? 4 : 2;
    } else {
      minNumeralHeight = isBlownOrEmbossed ? 6 : 4;
    }
  }

  const minLetterHeight = isBlownOrEmbossed ? 2 : 1;

  return {
    minNumeralHeightMm: minNumeralHeight,
    minLetterHeightMm: minLetterHeight,
    ruleRef: pdpAreaCm2 > 0 ? 'Rule 7(2) Table-II' : 'Rule 7(2) Table-I'
  };
}

/**
 * Main Legal Metrology Compliance Validation Function
 * Evaluates extracted product fields against Legal Metrology Rules, 2011.
 * @param {object} product - Product details extracted or provided
 * @returns {object} - Full compliance breakdown report
 */
export function evaluateCompliance(product) {
  const violations = [];
  const warnings = [];
  const ruleResults = [];
  let totalPoints = 100;

  const {
    manufacturerName,
    manufacturerAddress,
    isImported,
    importerName,
    importerAddress,
    countryOfOrigin,
    genericName,
    netQuantityValue,
    netQuantityUnit,
    mfgMonth,
    mfgYear,
    mrpValue,
    mrpRawText,
    consumerCarePhone,
    consumerCareEmail,
    consumerCareAddress,
    fontHeightMm,
    pdpAreaCm2,
    isEmbossed,
    surroundingPaddingTopBottomMm,
    surroundingPaddingLeftRightMm,
    hasMRPSticker,
    isMRPStickerLowering,
    slackFillPercent,
    category,
    hasNonStandardWarning
  } = product;

  // --- 1. RULE 6(1)(a) & RULE 10: Manufacturer / Packer / Importer Details ---
  let rule6aPass = true;
  let rule6aDetails = [];

  if (!manufacturerName || manufacturerName.trim().length < 2) {
    rule6aPass = false;
    rule6aDetails.push('Missing manufacturer/packer name.');
  }
  if (!manufacturerAddress || manufacturerAddress.trim().length < 5) {
    rule6aPass = false;
    rule6aDetails.push('Missing complete postal address (street, city, state, PIN code required under Rule 10).');
  }

  if (isImported) {
    if (!importerName || !importerAddress) {
      rule6aPass = false;
      rule6aDetails.push('Imported package must declare name & complete address of importer in India.');
    }
    if (!countryOfOrigin) {
      rule6aPass = false;
      rule6aDetails.push('Imported package must declare Country of Origin.');
    }
  }

  if (!rule6aPass) {
    totalPoints -= 15;
    violations.push({
      rule: 'Rule 6(1)(a) & Rule 10',
      title: 'Missing Manufacturer/Packer/Importer Details',
      description: rule6aDetails.join(' '),
      penalty: 'Rule 32(2) - Fine up to ₹2,000',
      severity: 'HIGH'
    });
  }
  ruleResults.push({
    rule: 'Rule 6(1)(a) & Rule 10',
    name: 'Manufacturer & Packer Identification',
    passed: rule6aPass,
    details: rule6aPass ? 'Manufacturer/Packer identity & complete address present.' : rule6aDetails.join(' ')
  });

  // --- 2. RULE 6(1)(b): Generic / Common Commodity Name ---
  const rule6bPass = Boolean(genericName && genericName.trim().length >= 2);
  if (!rule6bPass) {
    totalPoints -= 10;
    violations.push({
      rule: 'Rule 6(1)(b)',
      title: 'Missing Generic Commodity Name',
      description: 'Common or generic name of the commodity is missing or invalid.',
      penalty: 'Rule 32(2) - Fine up to ₹2,000',
      severity: 'MEDIUM'
    });
  }
  ruleResults.push({
    rule: 'Rule 6(1)(b)',
    name: 'Generic Commodity Name',
    passed: rule6bPass,
    details: rule6bPass ? `Generic name declared: "${genericName}".` : 'Generic/common name of commodity missing.'
  });

  // --- 3. RULE 6(1)(c) & RULE 13: Net Quantity & Standard SI Units ---
  let rule6cPass = true;
  let rule6cDetails = [];
  const validUnits = ['g', 'kg', 'ml', 'l', 'litre', 'n', 'u', 'm', 'cm', 'sq m', 'sq cm', 'mm'];
  const unitLower = (netQuantityUnit || '').toLowerCase();

  if (!netQuantityValue || netQuantityValue <= 0) {
    rule6cPass = false;
    rule6cDetails.push('Net quantity value is missing or zero.');
  }

  if (!validUnits.includes(unitLower)) {
    rule6cPass = false;
    rule6cDetails.push(`Invalid non-SI unit "${netQuantityUnit}". Must use standard SI units (g, kg, ml, l, N, U under Rule 13).`);
  }

  // Check Rule 13(4) prohibited words (dozen, gross, etc.)
  const rawQtyText = `${netQuantityValue} ${netQuantityUnit}`.toLowerCase();
  if (['dozen', 'gross', 'score'].some(word => rawQtyText.includes(word))) {
    rule6cPass = false;
    rule6cDetails.push('Use of prohibited count words like "dozen", "gross", or "score" violates Rule 13(4).');
  }

  // Check Rule 13(6) misleading terms ("minimum", "approx", "about", "not less than")
  if (['minimum', 'approx', 'about', 'not less than', 'avg', 'average'].some(word => rawQtyText.includes(word))) {
    rule6cPass = false;
    rule6cDetails.push('Use of misleading expressions like "approx", "minimum", "not less than" violates Rule 13(6).');
  }

  if (!rule6cPass) {
    totalPoints -= 15;
    violations.push({
      rule: 'Rule 6(1)(c) & Rule 13',
      title: 'Non-Compliant Net Quantity Declaration',
      description: rule6cDetails.join(' '),
      penalty: 'Rule 32(2) - Fine up to ₹2,000',
      severity: 'HIGH'
    });
  }
  ruleResults.push({
    rule: 'Rule 6(1)(c) & Rule 13',
    name: 'Net Quantity & SI Unit Standard',
    passed: rule6cPass,
    details: rule6cPass ? `Declared Net Qty: ${netQuantityValue} ${netQuantityUnit} in standard SI unit.` : rule6cDetails.join(' ')
  });

  // --- 4. RULE 6(1)(d): Month & Year of Manufacture / Packing ---
  let rule6dPass = true;
  let rule6dDetails = [];

  const currentYear = new Date().getFullYear();
  const mfgYrNum = parseInt(mfgYear, 10);
  const mfgMthNum = parseInt(mfgMonth, 10);

  if (!mfgYrNum || !mfgMthNum || mfgMthNum < 1 || mfgMthNum > 12 || mfgYrNum < 2000 || mfgYrNum > currentYear + 1) {
    rule6dPass = false;
    rule6dDetails.push('Month & Year of packing/manufacture missing or invalid format (MM/YYYY required).');
  }

  if (!rule6dPass) {
    totalPoints -= 10;
    violations.push({
      rule: 'Rule 6(1)(d)',
      title: 'Missing / Invalid Packing Date',
      description: rule6dDetails.join(' '),
      penalty: 'Rule 32(2) - Fine up to ₹2,000',
      severity: 'MEDIUM'
    });
  }
  ruleResults.push({
    rule: 'Rule 6(1)(d)',
    name: 'Month & Year of Packing/Import',
    passed: rule6dPass,
    details: rule6dPass ? `Mfg/Packing Date: ${String(mfgMthNum).padStart(2, '0')}/${mfgYrNum}.` : rule6dDetails.join(' ')
  });

  // --- 5. RULE 6(1)(e): Maximum Retail Price (MRP Format) ---
  let rule6ePass = true;
  let rule6eDetails = [];

  if (!mrpValue || mrpValue <= 0) {
    rule6ePass = false;
    rule6eDetails.push('MRP value missing or zero.');
  }

  const mrpTextLower = (mrpRawText || '').toLowerCase();
  const hasTaxMention = mrpTextLower.includes('incl') || mrpTextLower.includes('inclusive') || mrpTextLower.includes('all taxes');

  if (!hasTaxMention && mrpRawText) {
    rule6ePass = false;
    rule6eDetails.push('MRP declaration must explicitly mention "incl. of all taxes" or "inclusive of all taxes" under Rule 6(1)(e).');
  }

  if (hasMRPSticker && !isMRPStickerLowering) {
    rule6ePass = false;
    rule6eDetails.push('Rule 6(3) Violation: Using stickers to increase MRP or cover original price declaration is illegal. Stickers are ONLY permitted for reducing MRP.');
  }

  if (!rule6ePass) {
    totalPoints -= 20;
    violations.push({
      rule: 'Rule 6(1)(e) & Rule 6(3)',
      title: 'Non-Compliant MRP Declaration / Price Sticker',
      description: rule6eDetails.join(' '),
      penalty: 'Rule 32(2) - Fine up to ₹2,000',
      severity: 'HIGH'
    });
  }
  ruleResults.push({
    rule: 'Rule 6(1)(e) & Rule 6(3)',
    name: 'MRP Declaration & Tax Disclaimer',
    passed: rule6ePass,
    details: rule6ePass ? `MRP declared: ₹${mrpValue} (incl. of all taxes).` : rule6eDetails.join(' ')
  });

  // --- 6. RULE 6(2): Consumer Care Details ---
  let rule6_2Pass = true;
  let rule6_2Details = [];

  if (!consumerCarePhone && !consumerCareEmail && !consumerCareAddress) {
    rule6_2Pass = false;
    rule6_2Details.push('Consumer complaint cell contact details (Phone/Email/Address) completely missing.');
  } else if (!consumerCarePhone || (!consumerCareEmail && !consumerCareAddress)) {
    rule6_2Details.push('Consumer care details incomplete. Must provide name, address, helpline phone and email.');
  }

  if (!rule6_2Pass) {
    totalPoints -= 10;
    violations.push({
      rule: 'Rule 6(2)',
      title: 'Missing Consumer Grievance Contact',
      description: rule6_2Details.join(' '),
      penalty: 'Rule 32(2) - Fine up to ₹2,000',
      severity: 'MEDIUM'
    });
  }
  ruleResults.push({
    rule: 'Rule 6(2)',
    name: 'Consumer Complaint Helpline Contact',
    passed: rule6_2Pass,
    details: rule6_2Pass ? `Consumer Care helpline active: ${consumerCarePhone || consumerCareEmail || consumerCareAddress}.` : rule6_2Details.join(' ')
  });

  // --- 7. RULE 7 & TABLES I / II: Font & Numeral Height ---
  const requiredFont = getRequiredFontDimensions(netQuantityValue, netQuantityUnit, pdpAreaCm2, isEmbossed);
  let rule7Pass = true;
  let rule7Details = [];

  if (fontHeightMm && fontHeightMm < requiredFont.minNumeralHeightMm) {
    rule7Pass = false;
    rule7Details.push(`Font height is ${fontHeightMm} mm, which is below the mandatory minimum height of ${requiredFont.minNumeralHeightMm} mm prescribed under ${requiredFont.ruleRef}.`);
  }

  if (!rule7Pass) {
    totalPoints -= 10;
    violations.push({
      rule: 'Rule 7 & Tables I/II',
      title: 'Insufficient Font / Numeral Size',
      description: rule7Details.join(' '),
      penalty: 'Rule 32(2) - Fine up to ₹2,000',
      severity: 'MEDIUM'
    });
  }
  ruleResults.push({
    rule: 'Rule 7(2)',
    name: 'Numeral & Letter Height Compliance',
    passed: rule7Pass,
    details: rule7Pass
      ? `Font height (${fontHeightMm || requiredFont.minNumeralHeightMm} mm) complies with ${requiredFont.ruleRef} (min ${requiredFont.minNumeralHeightMm} mm).`
      : rule7Details.join(' ')
  });

  // --- 8. RULE 8: Surrounding Free Space around Net Qty ---
  let rule8Pass = true;
  const currentHeight = fontHeightMm || requiredFont.minNumeralHeightMm;
  if (surroundingPaddingTopBottomMm !== undefined && surroundingPaddingTopBottomMm < currentHeight) {
    rule8Pass = false;
  }
  if (surroundingPaddingLeftRightMm !== undefined && surroundingPaddingLeftRightMm < 2 * currentHeight) {
    rule8Pass = false;
  }

  if (!rule8Pass) {
    totalPoints -= 5;
    warnings.push({
      rule: 'Rule 8',
      title: 'Inadequate Surrounding Free Space',
      description: `Quantity declaration must have free padding of at least ${currentHeight} mm above/below and ${2 * currentHeight} mm left/right.`
    });
  }
  ruleResults.push({
    rule: 'Rule 8',
    name: 'Surrounding Area Clearance',
    passed: rule8Pass,
    details: rule8Pass ? 'Clearance around net quantity numeral meets Rule 8 criteria.' : `Padding surrounding net quantity numeral is below ${currentHeight} mm top/bottom or ${2 * currentHeight} mm left/right.`
  });

  // --- 9. RULE 5 & SECOND SCHEDULE: Standard Pack Sizes ---
  let rule5Pass = true;
  let rule5Details = '';

  if (category && SECOND_SCHEDULE_RULES[category]) {
    const catRule = SECOND_SCHEDULE_RULES[category];
    let qtyInGramOrMl = netQuantityValue;
    if (['kg', 'l', 'litre'].includes((netQuantityUnit || '').toLowerCase())) {
      qtyInGramOrMl = netQuantityValue * 1000;
    }

    const isAllowedSize = catRule.allowed && catRule.allowed.includes(qtyInGramOrMl);
    if (!isAllowedSize) {
      if (!hasNonStandardWarning) {
        rule5Pass = false;
        rule5Details = `Pack size ${netQuantityValue} ${netQuantityUnit} is not a standard quantity for ${category} under Second Schedule (Rule 5). Missing mandatory warning: "Not a standard pack size under Legal Metrology Rules, 2011".`;
      } else {
        rule5Details = `Pack size ${netQuantityValue} ${netQuantityUnit} is non-standard but bears required exemption warning.`;
      }
    }
  }

  if (!rule5Pass) {
    totalPoints -= 10;
    violations.push({
      rule: 'Rule 5 & Second Schedule',
      title: 'Non-Standard Pack Size Violation',
      description: rule5Details,
      penalty: 'Rule 32(2) - Fine up to ₹2,000',
      severity: 'MEDIUM'
    });
  }
  ruleResults.push({
    rule: 'Rule 5',
    name: 'Second Schedule Standard Pack Size',
    passed: rule5Pass,
    details: rule5Pass ? (rule5Details || 'Product net quantity complies with Second Schedule prescribed pack sizes.') : rule5Details
  });

  // --- 10. RULE 23: Deceptive Packaging & Slack Fill ---
  let rule23Pass = true;
  if (slackFillPercent && slackFillPercent > 25) {
    rule23Pass = false;
    totalPoints -= 15;
    violations.push({
      rule: 'Rule 23',
      title: 'Deceptive Packaging / Excessive Slack Fill',
      description: `Package container has ${slackFillPercent}% empty air space (slack fill > 25%), which deliberately gives a misleading impression of quantity under Rule 23.`,
      penalty: 'Rule 23(1) - Package Seizure and Repacking Order',
      severity: 'HIGH'
    });
  }
  ruleResults.push({
    rule: 'Rule 23',
    name: 'Deceptive Packaging & Slack Fill',
    passed: rule23Pass,
    details: rule23Pass ? `Container fill ratio is compliant (${slackFillPercent || 10}% slack fill).` : `Excessive slack fill (${slackFillPercent}% empty volume).`
  });

  // Calculate MPE reference
  const mpeInfo = calculateMPE(netQuantityValue || 0, netQuantityUnit || 'g');

  const finalScore = Math.max(0, totalPoints);
  let complianceGrade = 'NON_COMPLIANT';
  if (finalScore >= 95 && violations.length === 0) {
    complianceGrade = 'COMPLIANT';
  } else if (finalScore >= 70 && violations.length <= 1) {
    complianceGrade = 'PARTIALLY_COMPLIANT';
  }

  return {
    complianceScore: finalScore,
    status: complianceGrade,
    violations,
    warnings,
    ruleResults,
    mpeInfo,
    requiredFont,
    evaluatedAt: new Date().toISOString()
  };
}
