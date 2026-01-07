
import React, { useState, useMemo } from 'react';
import { 
  Printer, 
  Download, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Maximize2, 
  Loader2,
  Lock,
  Unlock,
  EyeOff
} from 'lucide-react';
import { ContractData, Risk } from '../types';

interface DocumentViewerProps {
  document: ContractData | null;
  highlights: Risk[];
  selectedHighlight: string | null;
  loading: boolean;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, highlights, selectedHighlight, loading }) => {
  const [lgpdMode, setLgpdMode] = useState(true);

  const processedContent = useMemo(() => {
    if (!document) return "";
    let text = document.content;

    // Simulação de Redação Automática (LGPD)
    if (lgpdMode) {
      // Máscara CPFs e CNPJs
      text = text.replace(/\d{3}\.\d{3}\.\d{3}-\d{2}/g, "[CPF REDIGIDO]");
      text = text.replace(/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/g, "[CNPJ REDIGIDO]");
      // Máscara Nomes Próprios Simples (Simulação)
      text = text.replace(/Global Logistics SA/g, "[EMPRESA REDIGIDA]");
      text = text.replace(/TechFlow Corp/g, "[EMPRESA REDIGIDA]");
    }

    // Aplica Highlights de Riscos
    highlights.forEach(risk => {
      const isSelected = selectedHighlight === risk.highlightText;
      const severityColor = risk.severity === 'high' ? 'bg-red-500/30' : risk.severity === 'medium' ? 'bg-amber-500/30' : 'bg-blue-500/30';
      const borderStyle = isSelected ? 'border-2 border-indigo-500 rounded shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'border-b-2 border-transparent';
      
      const regex = new RegExp(`(${risk.highlightText})`, 'gi');
      text = text.replace(regex, `<mark class="${severityColor} ${borderStyle} px-1 transition-all duration-300 cursor-help" title="${risk.description}">$1</mark>`);
    });

    return text;
  }, [document, highlights, selectedHighlight, lgpdMode]);

  if (!document) return (
    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 bg-slate-900/50">
      <div className="p-10 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center">
        <Lock size={48} className="mb-4 text-slate-700" />
        <p className="text-lg font-medium">Selecione ou faça upload de um contrato</p>
        <p className="text-sm opacity-60">LexAI processará o documento automaticamente</p>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-slate-950">
      {/* Header Toolbar */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/50 bg-slate-900/40 backdrop-blur-xl sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
            <Eye size={20} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 truncate max-w-[250px]">{document.name}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${lgpdMode ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                {lgpdMode ? <Lock size={10}/> : <EyeOff size={10}/>}
                LGPD: {lgpdMode ? 'MODO PRIVACIDADE ON' : 'DADOS EXPOSTOS'}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Último scan: Hoje, 14:20</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setLgpdMode(!lgpdMode)}
            className={`p-2 rounded-lg transition-all ${lgpdMode ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            title="Alternar Máscara LGPD"
          >
            {lgpdMode ? <Lock size={18} /> : <Unlock size={18} />}
          </button>
          <div className="h-6 w-px bg-slate-800 mx-1"></div>
          <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"><Search size={18} /></button>
          <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 transition-colors"><Printer size={18} /></button>
          <button className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white text-sm font-bold px-4 flex items-center gap-2 shadow-lg shadow-indigo-600/20">
            <Download size={16} /> Exportar Relatório
          </button>
        </div>
      </div>

      {/* Metadata Badges */}
      <div className="flex items-center gap-4 px-6 py-4 bg-slate-900/20 border-b border-slate-800/50 overflow-x-auto no-scrollbar">
        <DataPoint label="Partes" value={document.parties.join(' & ')} />
        <DataPoint label="Valor Global" value={document.value} />
        <DataPoint label="Foro Eleito" value={document.jurisdiction} />
        <DataPoint label="Vencimento" value={document.expiryDate} />
      </div>

      {/* Document Viewport */}
      <div className="flex-1 overflow-y-auto bg-slate-900/40 p-10 flex justify-center custom-scrollbar">
        <div className="relative w-full max-w-4xl bg-white text-slate-900 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] rounded-sm min-h-[1400px] p-20 font-serif">
          
          {/* Scan Animation Overlay */}
          {loading && (
            <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden rounded-sm">
              <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 shadow-[0_0_15px_#6366f1] animate-[scan_3s_ease-in-out_infinite]"></div>
              <div className="absolute inset-0 bg-indigo-500/5 backdrop-blur-[1px] flex flex-col items-center justify-center pointer-events-auto">
                <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
                <h3 className="text-2xl font-bold text-slate-900">Analisando Contrato...</h3>
                <p className="text-slate-500 font-medium mt-2">LexAI está identificando cláusulas e riscos críticos</p>
              </div>
            </div>
          )}

          <style>{`
            @keyframes scan {
              0% { top: 0% }
              50% { top: 100% }
              100% { top: 0% }
            }
          `}</style>

          <div className="prose prose-lg max-w-none">
            <pre 
              className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-slate-800"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
          </div>
          
          <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-center opacity-40 italic text-xs">
            <span>LexAI Digital Signature: 8f2b-9d1a-4c5e-7a2b</span>
            <span>Documento Gerado em 2026 - Versão Enterprise</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const DataPoint = ({ label, value }: { label: string, value: string }) => (
  <div className="flex flex-col min-w-[150px] p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/30 transition-all group">
    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mb-1 group-hover:text-indigo-400">{label}</span>
    <span className="text-xs font-semibold text-slate-200 truncate">{value}</span>
  </div>
);

export default DocumentViewer;
