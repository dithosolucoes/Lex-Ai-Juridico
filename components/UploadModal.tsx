
import React, { useState } from 'react';
import { X, Upload, FileText, Check, AlertCircle, Shield } from 'lucide-react';
import { ContractData } from '../types';

interface UploadModalProps {
  onClose: () => void;
  onUpload: (doc: ContractData) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const processUpload = () => {
    if (!file) return;
    
    // Simulate API processing
    const newDoc: ContractData = {
      id: Math.random().toString(),
      name: file.name,
      parties: ['Contracting Party A', 'Contracting Party B'],
      value: 'R$ 500.000,00 (Extracted)',
      jurisdiction: 'Curitiba - PR',
      expiryDate: 'TBD',
      status: 'pending',
      content: `UPLOADED DOCUMENT: ${file.name}\n\n1. INITIAL CLAUSES\nThis document represents a generic agreement...`
    };

    onUpload(newDoc);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
              <Upload size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-100">Ingest New Contract</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          <div 
            className={`relative group border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center transition-all ${
              dragActive ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-800 hover:border-slate-700 bg-slate-900/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => e.target.files && setFile(e.target.files[0])}
            />
            
            <div className={`p-5 rounded-2xl mb-4 transition-all ${file ? 'bg-green-500/10 text-green-400' : 'bg-slate-800 text-slate-500 group-hover:bg-indigo-500/10 group-hover:text-indigo-400'}`}>
              {file ? <Check size={40} /> : <Upload size={40} />}
            </div>

            <div className="text-center">
              <p className="text-slate-200 font-semibold mb-1">
                {file ? file.name : 'Click or drag PDF to this area'}
              </p>
              <p className="text-slate-500 text-sm">
                Max file size: 50MB (PDF, DOCX supported)
              </p>
            </div>

            {file && (
              <button 
                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                className="mt-4 text-xs font-bold text-red-400 hover:underline uppercase tracking-wider"
              >
                Clear File
              </button>
            )}
          </div>

          <div className="mt-8 space-y-4">
             <div className="flex items-start gap-3 p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                <Shield className="text-indigo-400 mt-1" size={18} />
                <div>
                  <p className="text-sm font-semibold text-slate-200">LGPD Safe Processing</p>
                  <p className="text-xs text-slate-500">Sensitive data will be masked locally before AI analysis. Your firm's privacy is guaranteed.</p>
                </div>
             </div>

             <div className="flex items-center gap-3">
               <input type="checkbox" id="ocr" defaultChecked className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-indigo-500" />
               <label htmlFor="ocr" className="text-xs text-slate-400">Perform High-Resolution OCR (Optical Character Recognition)</label>
             </div>
          </div>
        </div>

        <div className="p-6 bg-slate-950/50 border-t border-slate-800 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            disabled={!file}
            onClick={processUpload}
            className="flex-1 py-3 px-4 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all shadow-lg shadow-indigo-500/20"
          >
            Start Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
