import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { formatApiError } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UploadCloud, Loader2, ScanLine, Zap, Info, X, Camera, Key, Settings2 } from "lucide-react";

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Scanner() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [drag, setDrag] = useState(false);
  const [hint, setHint] = useState("");
  const [notes, setNotes] = useState("");
  const [customApiKey, setCustomApiKey] = useState(localStorage.getItem("lm_gemini_api_key") || "");
  const [showSettings, setShowSettings] = useState(false);
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const handleFile = async (f) => {
    if (!f) return;
    if (!/(jpeg|jpg|png|webp)/i.test(f.type)) {
      toast.error("Please use a JPEG / PNG / WEBP image");
      return;
    }
    setFile(f);
    const dataUrl = await fileToBase64(f);
    setPreview(dataUrl);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }, []);

  const handleSaveKey = (val) => {
    setCustomApiKey(val);
    if (val) {
      localStorage.setItem("lm_gemini_api_key", val);
    } else {
      localStorage.removeItem("lm_gemini_api_key");
    }
  };

  const analyze = async () => {
    if (!preview) return;
    setBusy(true);
    try {
      const { data } = await api.post("/scans", {
        image_base64: preview,
        mime_type: file?.type || "image/jpeg",
        product_hint: hint || null,
        notes: notes || null,
        api_key: customApiKey.trim() || null,
      });
      toast.success("Real OCR & Compliance inspection complete");
      nav(`/scans/${data.id}`);
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-6 lg:p-10">
      <header className="mb-8 flex items-start justify-between gap-6 flex-wrap">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mb-1">Product Label Scanner</p>
          <h1 className="font-display text-4xl font-extrabold text-slate-900 tracking-tight">
            New Compliance Inspection
          </h1>
          <p className="text-slate-600 mt-1 max-w-2xl">
            Upload a photograph of any packaged product label. The multi-tiered OCR engine extracts every mandatory declaration and validates it against the Legal Metrology (Packaged Commodities) Rules, 2011.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            <Settings2 className="w-3.5 h-3.5 text-blue-600" />
            {showSettings ? "Hide Settings" : "OCR Settings"}
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
            <div className="w-2 h-2 rounded-full bg-emerald-500 pulse-ring" />
            <span className="text-xs font-medium text-emerald-700 font-mono">
              {customApiKey ? "Gemini Vision AI · Active" : "Vision AI & PyTesseract OCR · Ready"}
            </span>
          </div>
        </div>
      </header>

      {showSettings && (
        <Card className="mb-6 border-blue-200 bg-blue-50/50">
          <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Custom Gemini API Key (Optional)</p>
                <p className="text-xs text-slate-500">Provide your own Google AI Studio key for cloud vision analysis. If left blank, local PyTesseract & EasyOCR image processing engine is used.</p>
              </div>
            </div>
            <div className="w-full md:w-80 flex gap-2">
              <Input
                type="password"
                placeholder="AIzaSy..."
                value={customApiKey}
                onChange={(e) => handleSaveKey(e.target.value)}
                className="bg-white border-blue-200 text-xs font-mono"
              />
              {customApiKey && (
                <Button size="sm" variant="ghost" onClick={() => handleSaveKey("")}>Clear</Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <Card className="border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <UploadCloud className="w-4 h-4 text-slate-600" />
                <p className="font-semibold text-slate-900">Upload Product Image</p>
              </div>
              {!preview ? (
                <label
                  htmlFor="file-input"
                  onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={onDrop}
                  className={`dropzone ${drag ? "drag" : ""} border-2 border-dashed border-slate-300 rounded-xl block cursor-pointer p-12 text-center hover:border-blue-400 transition-colors`}
                  data-testid="upload-product-image-dropzone"
                >
                  <div className="w-16 h-16 rounded-full bg-slate-900 mx-auto grid place-items-center mb-4">
                    <ScanLine className="w-8 h-8 text-white" />
                  </div>
                  <p className="font-display text-lg font-semibold text-slate-900">
                    Drop label image here
                  </p>
                  <p className="text-sm text-slate-500 mt-1">or click to browse · JPG / PNG / WEBP</p>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                    data-testid="file-input"
                  />
                </label>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img src={preview} alt="Product" className="w-full max-h-[480px] object-contain" data-testid="preview-image" />
                  <button
                    onClick={() => { setFile(null); setPreview(null); }}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 backdrop-blur border border-slate-200 grid place-items-center hover:bg-white shadow-sm"
                    data-testid="clear-image-button"
                  >
                    <X className="w-4 h-4 text-slate-700" />
                  </button>
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur text-xs font-mono border border-slate-200">
                    <Camera className="w-3 h-3 inline mr-1" /> {file?.name || "Uploaded Image"}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <Info className="w-4 h-4 text-slate-600" />
                <p className="font-semibold text-slate-900">Inspection Metadata</p>
              </div>
              <div className="space-y-2">
                <Label>Product Hint (optional)</Label>
                <Input
                  placeholder="e.g. Organic Oats 500g"
                  value={hint}
                  onChange={(e) => setHint(e.target.value)}
                  data-testid="product-hint-input"
                />
              </div>
              <div className="space-y-2">
                <Label>Inspection Notes (optional)</Label>
                <Textarea
                  placeholder="Retailer name, location, batch tested…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  data-testid="inspection-notes-input"
                />
              </div>
              <Button
                onClick={analyze}
                disabled={!preview || busy}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                data-testid="run-compliance-scan-button"
              >
                {busy ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Performing OCR Scan…</>
                ) : (
                  <><Zap className="w-4 h-4 mr-2" /> Run Compliance Scan</>
                )}
              </Button>
              <p className="text-xs text-slate-500 leading-relaxed">
                On submit, the image pixels are scanned via real OCR to extract mandatory declarations under PCR 2011 Rule 6 (name, address, quantity, MRP, date, consumer care).
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-slate-900 text-white">
            <CardContent className="p-6">
              <p className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-3">Rule Coverage</p>
              <ul className="space-y-2 text-sm">
                {[
                  "Rule 6(1)(a) — Manufacturer / Packer / Importer name & address",
                  "Rule 6(1)(b) — Common or generic name of commodity",
                  "Rule 6(1)(c) — Net quantity in standard unit",
                  "Rule 6(1)(d) — Month & year of manufacture / import",
                  "Rule 6(1)(e) — MRP inclusive of all taxes",
                  "Rule 6(1)(f) — Consumer care details (phone / email)",
                ].map((r) => (
                  <li key={r} className="flex gap-2 text-slate-200">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
