import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Upload, 
  Camera, 
  Scan, 
  Sparkles, 
  Ruler, 
  RefreshCw,
  Eye,
  FileSearch,
  Zap,
  X,
  ImagePlus,
  CheckCircle2,
  AlertCircle,
  Loader2,
  CameraOff,
  FlipHorizontal
} from 'lucide-react';
import { SAMPLE_PRODUCTS } from '../data/sampleProducts';
import { parseOCRText } from '../engine/ocrParser';
import { evaluateCompliance } from '../engine/legalMetrologyRules';

export default function ProductScanner({ onAuditComplete }) {
  const [scanMode, setScanMode] = useState('preset');
  const [selectedSampleId, setSelectedSampleId] = useState('sample-1');
  const [imageUrl, setImageUrl] = useState('');
  const [customSvg, setCustomSvg] = useState(SAMPLE_PRODUCTS[0].svgLabel);
  const [isScanning, setIsScanning] = useState(false);
  const [isOCRRunning, setIsOCRRunning] = useState(false);
  const [ocrText, setOcrText] = useState('');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [measureMode, setMeasureMode] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [selectedBboxId, setSelectedBboxId] = useState(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    ...SAMPLE_PRODUCTS[0].productData,
    name: SAMPLE_PRODUCTS[0].name,
    category: SAMPLE_PRODUCTS[0].category
  });
  const [boundingBoxes, setBoundingBoxes] = useState(SAMPLE_PRODUCTS[0].boundingBoxes);
  const [measuredHeightMm, setMeasuredHeightMm] = useState(SAMPLE_PRODUCTS[0].productData.fontHeightMm || 2.0);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Load sample when selection changes
  useEffect(() => {
    const sample = SAMPLE_PRODUCTS.find(s => s.id === selectedSampleId);
    if (sample) {
      setCustomSvg(sample.svgLabel);
      setFormData({ ...sample.productData, name: sample.name, category: sample.category });
      setBoundingBoxes(sample.boundingBoxes);
      setMeasuredHeightMm(sample.productData.fontHeightMm || 2.0);
      setImageUrl('');
    }
  }, [selectedSampleId]);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Start camera
  const startCamera = async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      setCameraError('Camera access denied. Please allow camera permission or use file upload.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setImageUrl(dataUrl);
    setCustomSvg(null);
    setBoundingBoxes([]);
    stopCamera();
    runOCROnImageUrl(dataUrl);
  };

  // Run Tesseract OCR on image
  const runOCROnImageUrl = async (url) => {
    setIsOCRRunning(true);
    setOcrProgress(0);
    try {
      // Dynamic import of Tesseract to avoid initial bundle bloat
      const Tesseract = await import('tesseract.js');
      const result = await Tesseract.recognize(url, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(m.progress * 100));
          }
        }
      });
      const rawText = result.data.text;
      setOcrText(rawText);
      const parsed = parseOCRText(rawText);
      setFormData(prev => ({
        ...prev,
        ...parsed,
        name: prev.name || parsed.genericName || 'Scanned Product',
        category: prev.category || 'General Packaged Commodity'
      }));
    } catch (err) {
      console.error('OCR failed:', err);
    } finally {
      setIsOCRRunning(false);
      setOcrProgress(100);
    }
  };

  // Handle File Upload
  const handleFileUpload = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setCustomSvg(null);
    setBoundingBoxes([]);
    setScanMode('upload');
    runOCROnImageUrl(url);
  };

  // Drag & drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);
  const handleDragLeave = useCallback(() => setIsDragOver(false), []);
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  }, []);

  // Trigger Audit
  const handleRunAudit = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const fullProduct = { ...formData, fontHeightMm: measuredHeightMm };
      const auditResult = evaluateCompliance(fullProduct);
      onAuditComplete({
        product: fullProduct,
        audit: auditResult,
        svgLabel: customSvg,
        imageUrl,
        boundingBoxes
      });
    }, 900);
  };

  // Update formData field helper
  const updateField = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-5">
      
      {/* Header */}
      <div className="glass-card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-heading text-slate-100 flex items-center gap-2">
            <Scan className="w-5 h-5 text-indigo-400" />
            Product &amp; Label Scanner Workspace
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Upload product packaging, use camera, or choose benchmark presets to run a Legal Metrology (2011) compliance audit.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 shrink-0">
          {[
            { id: 'preset', label: 'Sample Presets', icon: Sparkles },
            { id: 'upload', label: 'File Upload', icon: Upload },
            { id: 'camera', label: 'Camera', icon: Camera }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setScanMode(id);
                if (id === 'upload') fileInputRef.current?.click();
                if (id === 'camera' && !cameraActive) startCamera();
                if (id !== 'camera' && cameraActive) stopCamera();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                scanMode === id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* Preset Selector */}
      {scanMode === 'preset' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {SAMPLE_PRODUCTS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => setSelectedSampleId(sample.id)}
              className={`p-3 rounded-xl text-left border transition-all glass-panel flex flex-col gap-2 group ${
                selectedSampleId === sample.id
                  ? 'border-indigo-500 bg-indigo-950/40 ring-2 ring-indigo-500/25'
                  : 'border-slate-800 hover:border-indigo-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 truncate max-w-[70%]">
                  {sample.category.split(',')[0]}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                  sample.isCompliantTarget
                    ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30'
                    : 'text-red-400 border-red-500/30 bg-red-950/30'
                }`}>
                  {sample.isCompliantTarget ? '✓ OK' : '✕ VIOL'}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-100 line-clamp-1 group-hover:text-indigo-200 transition">{sample.name}</div>
              <div className="text-[11px] text-slate-500 line-clamp-2">{sample.description}</div>
            </button>
          ))}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* LEFT: Visual Inspector (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-card p-4 flex flex-col gap-3">
            
            {/* Inspector Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-cyan-400" />
                Label Inspection View &amp; OCR Bounding Box Highlights
              </span>
              <button
                onClick={() => setMeasureMode(!measureMode)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition border ${
                  measureMode
                    ? 'bg-cyan-900/40 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600'
                }`}
              >
                <Ruler className="w-3.5 h-3.5" />
                {measureMode ? 'Font Gauge Active' : 'Measure Font (Rule 7)'}
              </button>
            </div>

            {/* Label Canvas */}
            <div
              className={`relative w-full rounded-xl border overflow-hidden flex items-center justify-center transition-colors ${
                isDragOver
                  ? 'border-indigo-400 bg-indigo-950/30'
                  : 'border-slate-800 bg-slate-950'
              }`}
              style={{ minHeight: '360px' }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {/* Scanning Laser */}
              {isScanning && <div className="laser-scanner" />}

              {/* OCR Progress Overlay */}
              {isOCRRunning && (
                <div className="absolute inset-0 z-30 bg-slate-950/85 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
                  <p className="text-sm font-semibold text-slate-100">Running OCR Analysis...</p>
                  <div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all" style={{ width: `${ocrProgress}%` }} />
                  </div>
                  <p className="text-xs font-mono text-cyan-400">{ocrProgress}% complete</p>
                </div>
              )}

              {/* Camera view */}
              {scanMode === 'camera' && (
                <div className="relative w-full h-full min-h-[360px] flex items-center justify-center">
                  {cameraActive ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-contain rounded-xl"
                        style={{ minHeight: '320px', maxHeight: '360px' }}
                      />
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                        <button
                          onClick={capturePhoto}
                          className="btn-primary px-5 py-2.5 text-sm shadow-2xl shadow-indigo-500/40"
                        >
                          <Camera className="w-4 h-4" /> Capture &amp; Scan Label
                        </button>
                        <button onClick={stopCamera} className="btn-secondary py-2.5 px-4">
                          <CameraOff className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                      <canvas ref={canvasRef} className="hidden" />
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-4 p-8 text-center">
                      {cameraError ? (
                        <>
                          <AlertCircle className="w-12 h-12 text-red-400 stroke-1" />
                          <p className="text-sm text-red-400">{cameraError}</p>
                          <button onClick={startCamera} className="btn-secondary text-xs">Retry Camera</button>
                        </>
                      ) : (
                        <>
                          <Camera className="w-14 h-14 text-slate-600 stroke-1" />
                          <p className="text-sm text-slate-400">Click "Camera" to start live camera feed</p>
                          <button onClick={startCamera} className="btn-primary text-xs">
                            <Camera className="w-4 h-4" /> Start Camera
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* SVG Label Preview */}
              {scanMode !== 'camera' && customSvg && (
                <div className="w-full h-full p-2 min-h-[360px] flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: customSvg }}
                />
              )}

              {/* Uploaded image preview */}
              {scanMode !== 'camera' && !customSvg && imageUrl && (
                <img
                  src={imageUrl}
                  alt="Uploaded product packaging label"
                  className="max-h-[360px] max-w-full object-contain rounded-xl p-2"
                />
              )}

              {/* Empty state (no image, not camera) */}
              {scanMode !== 'camera' && !customSvg && !imageUrl && (
                <div className="flex flex-col items-center gap-3 p-10 text-center">
                  <ImagePlus className="w-14 h-14 text-slate-700 stroke-1" />
                  <p className="text-slate-500 text-sm">Drag &amp; drop a product label image here</p>
                  <p className="text-slate-600 text-xs">or use the File Upload / Camera buttons above</p>
                </div>
              )}

              {/* Bounding Box Overlays */}
              {scanMode !== 'camera' && customSvg && boundingBoxes.map((bbox) => (
                <div
                  key={bbox.id}
                  onClick={() => setSelectedBboxId(selectedBboxId === bbox.id ? null : bbox.id)}
                  style={{
                    left: `${(bbox.x / 600) * 100}%`,
                    top: `${(bbox.y / 400) * 100}%`,
                    width: `${(bbox.w / 600) * 100}%`,
                    height: `${(bbox.h / 400) * 100}%`,
                    borderColor: bbox.color || '#06b6d4'
                  }}
                  className={`bbox-highlight ${selectedBboxId === bbox.id ? 'selected' : ''}`}
                  title={bbox.label}
                >
                  {selectedBboxId === bbox.id && (
                    <span
                      className="absolute -top-6 left-0 px-2 py-0.5 rounded-md text-[9px] font-mono font-bold text-white whitespace-nowrap shadow-lg z-10"
                      style={{ backgroundColor: bbox.color || '#06b6d4' }}
                    >
                      {bbox.label}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* OCR Raw Text Panel */}
            {ocrText && (
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-cyan-400 font-semibold">OCR Raw Extracted Text</span>
                  <button onClick={() => setOcrText('')} className="text-slate-500 hover:text-slate-300">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <pre className="text-[11px] text-slate-400 whitespace-pre-wrap font-mono max-h-24 overflow-y-auto">{ocrText}</pre>
              </div>
            )}

            {/* Font Gauge Bar */}
            {measureMode && (
              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-cyan-200">Rule 7 Numeral Height Gauge</p>
                  <p className="text-[10px] text-slate-400">Adjust slider to match measured font height on label</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <input
                    type="range" min="0.3" max="10.0" step="0.1"
                    value={measuredHeightMm}
                    onChange={(e) => setMeasuredHeightMm(parseFloat(e.target.value))}
                    className="w-28 accent-cyan-400"
                  />
                  <div className="text-center w-16">
                    <span className="text-lg font-extrabold font-mono text-cyan-300">{measuredHeightMm.toFixed(1)}</span>
                    <span className="text-xs text-slate-400 block">mm</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Declarations Form (5 cols) */}
        <div className="lg:col-span-5">
          <div className="glass-card p-5 flex flex-col gap-4 h-full">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold font-heading text-slate-100 flex items-center gap-2">
                <FileSearch className="w-4 h-4 text-indigo-400" />
                Mandatory Declarations (Rules 2011)
              </h3>
              <span className="text-[10px] font-mono text-slate-500">Rule 6 Required Fields</span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[480px] pr-1 flex-1">

              {/* Product Identity */}
              <fieldset className="space-y-2">
                <legend className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider mb-1">
                  Product Identity
                </legend>
                <input
                  value={formData.genericName || ''}
                  onChange={(e) => updateField('genericName', e.target.value)}
                  placeholder="Generic / Common Name of Commodity (Rule 6(1)(b))"
                  className="input-field text-xs"
                />
              </fieldset>

              {/* Manufacturer / Packer */}
              <fieldset className="space-y-2">
                <legend className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider mb-1">
                  Manufacturer / Packer — Rule 6(1)(a) &amp; Rule 10
                </legend>
                <input
                  value={formData.manufacturerName || ''}
                  onChange={(e) => updateField('manufacturerName', e.target.value)}
                  placeholder="Company / Firm Name"
                  className="input-field text-xs"
                />
                <input
                  value={formData.manufacturerAddress || ''}
                  onChange={(e) => updateField('manufacturerAddress', e.target.value)}
                  placeholder="Full Postal Address including PIN Code"
                  className="input-field text-xs"
                />
              </fieldset>

              {/* Net Quantity */}
              <fieldset>
                <legend className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider mb-1">
                  Net Quantity — Rule 6(1)(c) &amp; Rule 13
                </legend>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={formData.netQuantityValue || ''}
                    onChange={(e) => updateField('netQuantityValue', parseFloat(e.target.value) || 0)}
                    placeholder="Value"
                    className="input-field text-xs w-2/3"
                  />
                  <select
                    value={formData.netQuantityUnit || 'g'}
                    onChange={(e) => updateField('netQuantityUnit', e.target.value)}
                    className="input-field text-xs w-1/3 cursor-pointer"
                  >
                    <option value="g">g (gram)</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="l">l (litre)</option>
                    <option value="N">N (number)</option>
                    <option value="m">m (metre)</option>
                  </select>
                </div>
              </fieldset>

              {/* MRP */}
              <fieldset>
                <legend className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider mb-1">
                  MRP Declaration — Rule 6(1)(e)
                </legend>
                <div className="flex gap-2 mb-1.5">
                  <div className="relative w-1/3">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">₹</span>
                    <input
                      type="number"
                      value={formData.mrpValue || ''}
                      onChange={(e) => updateField('mrpValue', parseFloat(e.target.value) || 0)}
                      className="input-field text-xs pl-7"
                    />
                  </div>
                  <input
                    value={formData.mrpRawText || ''}
                    onChange={(e) => updateField('mrpRawText', e.target.value)}
                    placeholder='Raw text e.g. "MRP Rs 99.00 incl. of all taxes"'
                    className="input-field text-xs w-2/3"
                  />
                </div>
              </fieldset>

              {/* Manufacturing Date */}
              <fieldset>
                <legend className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider mb-1">
                  Month &amp; Year of Mfg/Packing — Rule 6(1)(d)
                </legend>
                <div className="flex gap-2">
                  <input
                    value={formData.mfgMonth || ''}
                    onChange={(e) => updateField('mfgMonth', e.target.value)}
                    placeholder="MM (01–12)"
                    maxLength={2}
                    className="input-field text-xs w-1/2"
                  />
                  <input
                    value={formData.mfgYear || ''}
                    onChange={(e) => updateField('mfgYear', e.target.value)}
                    placeholder="YYYY"
                    maxLength={4}
                    className="input-field text-xs w-1/2"
                  />
                </div>
              </fieldset>

              {/* Consumer Care */}
              <fieldset className="space-y-2">
                <legend className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider mb-1">
                  Consumer Grievance Helpline — Rule 6(2)
                </legend>
                <input
                  value={formData.consumerCarePhone || ''}
                  onChange={(e) => updateField('consumerCarePhone', e.target.value)}
                  placeholder="Toll-Free / Helpline Number"
                  className="input-field text-xs"
                />
                <input
                  value={formData.consumerCareEmail || ''}
                  onChange={(e) => updateField('consumerCareEmail', e.target.value)}
                  placeholder="Grievance Email Address"
                  className="input-field text-xs"
                />
              </fieldset>

              {/* Advanced Attributes */}
              <fieldset className="pt-3 border-t border-slate-800 space-y-3">
                <legend className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider mb-1">
                  Package Attributes &amp; Advanced Parameters
                </legend>

                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center justify-between gap-2 bg-slate-900/70 rounded-lg px-3 py-2 cursor-pointer border border-slate-800 hover:border-slate-700 transition">
                    <span className="text-xs text-slate-300">Imported Product?</span>
                    <input
                      type="checkbox"
                      checked={Boolean(formData.isImported)}
                      onChange={(e) => updateField('isImported', e.target.checked)}
                      className="accent-indigo-500 w-4 h-4 cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between gap-2 bg-slate-900/70 rounded-lg px-3 py-2 cursor-pointer border border-slate-800 hover:border-slate-700 transition">
                    <span className="text-xs text-slate-300">MRP Sticker Overlay?</span>
                    <input
                      type="checkbox"
                      checked={Boolean(formData.hasMRPSticker)}
                      onChange={(e) => updateField('hasMRPSticker', e.target.checked)}
                      className="accent-indigo-500 w-4 h-4 cursor-pointer"
                    />
                  </label>
                </div>

                {formData.hasMRPSticker && (
                  <label className="flex items-center justify-between gap-2 bg-slate-900/70 rounded-lg px-3 py-2 border border-amber-700/40">
                    <span className="text-xs text-amber-300">Sticker is LOWERING the price? (Only legal use)</span>
                    <input
                      type="checkbox"
                      checked={Boolean(formData.isMRPStickerLowering)}
                      onChange={(e) => updateField('isMRPStickerLowering', e.target.checked)}
                      className="accent-amber-500 w-4 h-4 cursor-pointer"
                    />
                  </label>
                )}

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Container Slack Fill Air Space (Rule 23)</span>
                    <span className={`font-mono font-bold ${(formData.slackFillPercent || 0) > 25 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {formData.slackFillPercent || 0}%
                      {(formData.slackFillPercent || 0) > 25 && ' ⚠ Deceptive'}
                    </span>
                  </div>
                  <input
                    type="range" min="0" max="70" step="1"
                    value={formData.slackFillPercent || 0}
                    onChange={(e) => updateField('slackFillPercent', parseInt(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Product Category (Schedule II check)</span>
                  </div>
                  <select
                    value={formData.category || ''}
                    onChange={(e) => updateField('category', e.target.value)}
                    className="input-field text-xs cursor-pointer"
                  >
                    <option value="">— Select Category —</option>
                    <option>Biscuits</option>
                    <option>Tea</option>
                    <option>Coffee</option>
                    <option>Edible Oils, Vanaspati, Ghee</option>
                    <option>Soaps</option>
                    <option>Salt</option>
                    <option>Milk Powder</option>
                    <option>Cereals and Pulses</option>
                    <option>Cement</option>
                    <option>Mineral water and drinking water</option>
                    <option>Baby food</option>
                    <option>Butter and Margarine</option>
                    <option>Confectionery</option>
                    <option>Non-soapy detergents</option>
                    <option>General Packaged Commodity</option>
                  </select>
                </div>

              </fieldset>
            </div>

            {/* Audit Button */}
            <button
              onClick={handleRunAudit}
              disabled={isScanning || isOCRRunning}
              className="w-full btn-primary justify-center py-3.5 text-sm font-bold mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isScanning ? (
                <><RefreshCw className="w-4 h-4 animate-spin text-cyan-300" /> Running Compliance Audit...</>
              ) : isOCRRunning ? (
                <><Loader2 className="w-4 h-4 animate-spin text-cyan-300" /> OCR in progress... ({ocrProgress}%)</>
              ) : (
                <><Zap className="w-4 h-4 text-cyan-300" /> Run Legal Metrology Compliance Audit</>
              )}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
