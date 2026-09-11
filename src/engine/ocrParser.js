/**
 * OCR Text & Entity Extraction Parser for Legal Metrology Declarations
 * Extracts manufacturer details, net quantity, MRP, mfg date, consumer care info.
 */

export function parseOCRText(text = '') {
  const cleanText = text.replace(/\r\n/g, '\n');
  const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean);

  let result = {
    rawText: cleanText,
    manufacturerName: '',
    manufacturerAddress: '',
    isImported: false,
    importerName: '',
    importerAddress: '',
    countryOfOrigin: '',
    genericName: '',
    netQuantityValue: 0,
    netQuantityUnit: '',
    mfgMonth: '',
    mfgYear: '',
    mrpValue: 0,
    mrpRawText: '',
    consumerCarePhone: '',
    consumerCareEmail: '',
    consumerCareAddress: '',
    category: '',
    hasMRPSticker: false,
    isMRPStickerLowering: true,
    hasNonStandardWarning: false
  };

  // 1. MRP Extraction
  const mrpRegex = /(?:MRP|Max\.?\s*Retail\s*Price|Price)[:\s]*[₹Rs\.]*\s*([0-9]+(?:\.[0-9]{1,2})?)(?:\s*(.*?))(?=\n|$)/i;
  const mrpMatch = cleanText.match(mrpRegex);
  if (mrpMatch) {
    result.mrpValue = parseFloat(mrpMatch[1]);
    result.mrpRawText = mrpMatch[0];
  } else {
    // Fallback simple MRP match
    const simpleMrp = cleanText.match(/Rs\.?\s*([0-9]+(?:\.[0-9]{1,2})?)/i);
    if (simpleMrp) {
      result.mrpValue = parseFloat(simpleMrp[1]);
      result.mrpRawText = simpleMrp[0];
    }
  }

  // 2. Net Quantity Extraction
  const qtyRegex = /(?:Net\s*Q(?:uan)?t(?:it)?y|Net\s*Weight|Net\s*Vol(?:ume)?|Net\s*Contents?)[:\s]*([0-9]+(?:\.[0-9]+)?)\s*([a-zA-Z\s]+)/i;
  const qtyMatch = cleanText.match(qtyRegex);
  if (qtyMatch) {
    result.netQuantityValue = parseFloat(qtyMatch[1]);
    const rawUnit = qtyMatch[2].trim().toLowerCase();
    if (rawUnit.startsWith('g') || rawUnit.startsWith('gm')) result.netQuantityUnit = 'g';
    else if (rawUnit.startsWith('kg')) result.netQuantityUnit = 'kg';
    else if (rawUnit.startsWith('ml')) result.netQuantityUnit = 'ml';
    else if (rawUnit.startsWith('l')) result.netQuantityUnit = 'l';
    else if (rawUnit.startsWith('n') || rawUnit.startsWith('u') || rawUnit.includes('pc') || rawUnit.includes('unit')) result.netQuantityUnit = 'N';
    else result.netQuantityUnit = rawUnit.split(' ')[0];
  } else {
    // Direct match e.g. "500 g" or "1.5 l"
    const directQty = cleanText.match(/([0-9]+(?:\.[0-9]+)?)\s*(g|kg|ml|l|litre|grams?|N|U)\b/i);
    if (directQty) {
      result.netQuantityValue = parseFloat(directQty[1]);
      result.netQuantityUnit = directQty[2].toLowerCase() === 'grams' ? 'g' : directQty[2];
    }
  }

  // 3. Month & Year of Mfg/Packing
  const dateRegex = /(?:Mfg|Packed|Mfd|Pkg|Manufactured|Imported)\s*(?:Date|on|in)?[:\s]*([0-0]?[1-9]|1[0-2])[\/\-\. ]([2-9][0-9]{3}|[0-9]{2})\b/i;
  const dateMatch = cleanText.match(dateRegex);
  if (dateMatch) {
    result.mfgMonth = dateMatch[1].padStart(2, '0');
    let yr = dateMatch[2];
    if (yr.length === 2) yr = '20' + yr;
    result.mfgYear = yr;
  } else {
    // Check Month names e.g. "AUG 2026" or "08/2026"
    const monthNameRegex = /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s,\/\-]+(20[2-9][0-9])/i;
    const monthMatch = cleanText.match(monthNameRegex);
    if (monthMatch) {
      const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      const mIdx = monthNames.findIndex(m => cleanText.toLowerCase().includes(m));
      if (mIdx !== -1) {
        result.mfgMonth = String(mIdx + 1).padStart(2, '0');
        result.mfgYear = monthMatch[1];
      }
    }
  }

  // 4. Manufacturer & Address
  const mfgNameRegex = /(?:Mfd\s*by|Manufactured\s*by|Packed\s*by|Marketed\s*by)[:\s]*([^\n]+)/i;
  const mfgMatch = cleanText.match(mfgNameRegex);
  if (mfgMatch) {
    result.manufacturerName = mfgMatch[1].trim();
  }

  // Find address with PIN Code
  const pinRegex = /\b([1-9][0-9]{5})\b/;
  const pinMatch = cleanText.match(pinRegex);
  if (pinMatch) {
    // Extract line containing pin code and surrounding lines as address
    const pinIdx = lines.findIndex(l => l.includes(pinMatch[1]));
    if (pinIdx !== -1) {
      const addrLines = lines.slice(Math.max(0, pinIdx - 2), pinIdx + 1);
      result.manufacturerAddress = addrLines.join(', ');
    }
  }

  // 5. Country of Origin & Importer (if imported)
  if (/Country\s*of\s*Origin|Made\s*in|Imported\s*from/i.test(cleanText)) {
    result.isImported = true;
    const countryMatch = cleanText.match(/(?:Country\s*of\s*Origin|Made\s*in)[:\s]*([a-zA-Z\s]+)/i);
    if (countryMatch) result.countryOfOrigin = countryMatch[1].trim();

    const impMatch = cleanText.match(/Imported\s*by[:\s]*([^\n]+)/i);
    if (impMatch) result.importerName = impMatch[1].trim();
  }

  // 6. Consumer Care Contact Details
  const phoneMatch = cleanText.match(/(?:Consumer\s*Care|Helpline|Customer\s*Care|Contact)[:\s]*([0-9\-\+\s]{10,14})/i) ||
                     cleanText.match(/(?:Tel|Phone|Mobile)[:\s]*([0-9\-\+\s]{10,14})/i);
  if (phoneMatch) result.consumerCarePhone = phoneMatch[1].trim();

  const emailMatch = cleanText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (emailMatch) result.consumerCareEmail = emailMatch[1].trim();

  // 7. Generic Commodity Name
  const productWords = ['Biscuit', 'Tea', 'Coffee', 'Oil', 'Soap', 'Detergent', 'Milk Powder', 'Water', 'Atta', 'Rice', 'Salt', 'Spices', 'Chocolate', 'Shampoo'];
  for (const word of productWords) {
    if (cleanText.toLowerCase().includes(word.toLowerCase())) {
      result.genericName = word;
      break;
    }
  }

  // 8. Warning for Non-Standard size check
  if (/Not\s*a\s*standard\s*pack\s*size|non\s*standard\s*size/i.test(cleanText)) {
    result.hasNonStandardWarning = true;
  }

  return result;
}
