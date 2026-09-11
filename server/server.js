import express from 'express';
import cors from 'cors';
import { evaluateCompliance } from '../src/engine/legalMetrologyRules.js';
import { SAMPLE_PRODUCTS } from '../src/data/sampleProducts.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// In-memory inspection database initialized with sample products
let inspectionRepository = SAMPLE_PRODUCTS.map(sample => ({
  id: sample.id,
  product: sample.productData,
  audit: evaluateCompliance(sample.productData),
  svgLabel: sample.svgLabel,
  timestamp: new Date().toISOString()
}));

// API: Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', engine: 'Legal Metrology Rules 2011 Compliance Engine' });
});

// API: Run compliance audit
app.post('/api/audit', (req, res) => {
  try {
    const product = req.body;
    const auditResult = evaluateCompliance(product);
    res.json({ success: true, audit: auditResult });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// API: Get all inspections
app.get('/api/inspections', (req, res) => {
  res.json({ success: true, total: inspectionRepository.length, data: inspectionRepository });
});

// API: Save new inspection
app.post('/api/inspections', (req, res) => {
  try {
    const record = {
      id: `insp-${Date.now()}`,
      ...req.body,
      timestamp: new Date().toISOString()
    };
    inspectionRepository.unshift(record);
    res.json({ success: true, record });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Legal Metrology Server running on http://localhost:${PORT}`);
});
