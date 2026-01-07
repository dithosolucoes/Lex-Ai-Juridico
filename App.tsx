
import React, { useState, useEffect, useCallback } from 'react';
import { ContractData, Risk } from './types.ts';
import Sidebar from './components/Sidebar.tsx';
import DocumentViewer from './components/DocumentViewer.tsx';
import AIChatPanel from './components/AIChatPanel.tsx';
import UploadModal from './components/UploadModal.tsx';
import { analyzeContract } from './geminiService.ts';
import { Gavel, ShieldCheck, FileSearch, TrendingUp } from 'lucide-react';

const MOCK_CONTRACT: ContractData = {
  id: '1',
  name: 'Contrato Social - TechFlow Solutions 2026.pdf',
  parties: ['TechFlow Solutions Ltda', 'Global Logistics SA'],
  value: 'R$ 2.450.000,00',
  jurisdiction: 'Comarca de São Paulo/SP',
  expiryDate: '20 de Julho de 2028',
  status: 'analyzed',
  content: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE TECNOLOGIA AVANÇADA
  
  CLÁUSULA 1 - OBJETO
  A TechFlow Solutions Ltda, inscrita no CNPJ 12.345.678/0001-99, doravante denominada CONTRATADA, compromete-se a fornecer infraestrutura de IA para a Global Logistics SA, CNPJ 98.765.432/0001-11.
  
  CLÁUSULA 4.2 - DA MULTA RESCISÓRIA
  Fica estabelecido que, em caso de rescisão antecipada por qualquer das partes sem aviso prévio de 360 dias, a parte infratora pagará multa de 100% do valor total do contrato imediatamente em parcela única.
  
  CLÁUSULA 8 - PROTEÇÃO DE DADOS
  As partes declaram estar em conformidade com a LGPD. O tratamento de dados pessoais de funcionários será realizado exclusivamente para fins contratuais e arquivamento legal.
  
  CLÁUSULA 12 - DO FORO
  Para dirimir quaisquer controvérsias oriundas deste pacto, as partes elegem o foro da Comarca de Miami, Flórida, EUA, com renúncia expressa a qualquer outro por mais privilegiado que seja.
  
  São Paulo, 10 de Janeiro de 2024.
  `
};

const App: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<ContractData | null>(MOCK_CONTRACT);
  const [risks, setRisks] = useState<Risk[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedHighlight, setSelectedHighlight] = useState<string | null>(null);

  const performAnalysis = useCallback(async (content: string) => {
    setLoading(true);
    try {
      const result = await analyzeContract(content);
      const mappedRisks: Risk[] = result.risks.map((r: any, idx: number) => ({
        ...r,
        id: `risk-${idx}-${Date.now()}`,
        page: 1,
        validated: false
      }));
      setRisks(mappedRisks);
    } catch (error) {
      console.error("Erro na análise:", error);
    } finally {
      setTimeout(() => setLoading(false), 1200);
    }
  }, []);

  useEffect(() => {
    if (activeDoc) {
      performAnalysis(activeDoc.content);
    }
  }, [activeDoc, performAnalysis]);

  return (
    <div className="flex h-screen w-full bg-[#020617] text-slate-200 selection:bg-indigo-500/30 overflow-hidden">
      <Sidebar onUploadClick={() => setIsUploadOpen(true)} />

      <main className="flex-1 flex overflow-hidden border-l border-slate-800/50 bg-gradient-to-br from-[#020617] to-[#0f172a]">
        {activeDoc ? (
          <>
            <section className="flex-[6.5] flex flex-col min-w-0 border-r border-slate-800/50 shadow-2xl z-10">
              <DocumentViewer 
                document={activeDoc} 
                highlights={risks}
                selectedHighlight={selectedHighlight}
                loading={loading}
              />
            </section>

            <section className="flex-[3.5] flex flex-col min-w-0 bg-slate-950/40 backdrop-blur-md">
              <AIChatPanel 
                doc={activeDoc} 
                risks={risks} 
                onRiskClick={(r) => setSelectedHighlight(r.highlightText)}
                onToggleValidation={(id) => setRisks(prev => prev.map(r => r.id === id ? {...r, validated: !r.validated} : r))}
                loading={loading}
              />
            </section>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
            <div className="w-24 h-24 bg-indigo-500/10 rounded-3xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 mb-8 animate-pulse">
              <Gavel size={48} />
            </div>
            <h1 className="text-4xl font-black text-white mb-4 tracking-tight">LexAI Enterprise <span className="text-indigo-500">2026</span></h1>
            <p className="text-slate-400 max-w-md text-lg mb-12">Plataforma de inteligência jurídica para auditoria de contratos em tempo real com conformidade LGPD nativa.</p>
            
            <div className="grid grid-cols-3 gap-6 w-full max-w-4xl">
              <DashCard icon={<ShieldCheck className="text-green-400"/>} label="Privacidade" desc="Mascaramento local de dados sensíveis." />
              <DashCard icon={<FileSearch className="text-indigo-400"/>} label="Análise Profunda" desc="Detecção de riscos via Gemini 3 Pro." />
              <DashCard icon={<TrendingUp className="text-amber-400"/>} label="Evolutivo" desc="Aprende com as correções do advogado." />
            </div>
            
            <button 
              onClick={() => setIsUploadOpen(true)}
              className="mt-12 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-10 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-3"
            >
              Começar Nova Auditoria
            </button>
          </div>
        )}
      </main>

      {isUploadOpen && (
        <UploadModal 
          onClose={() => setIsUploadOpen(false)} 
          onUpload={(newDoc) => {
            setActiveDoc(newDoc);
            setIsUploadOpen(false);
          }}
        />
      )}
    </div>
  );
};

const DashCard = ({ icon, label, desc }: any) => (
  <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-colors text-left group">
    <div className="mb-4">{icon}</div>
    <h3 className="text-slate-100 font-bold mb-2 group-hover:text-indigo-400 transition-colors">{label}</h3>
    <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

export default App;
