
import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Zap, 
  AlertCircle, 
  CheckCircle2, 
  History, 
  Send,
  Loader2,
  MoreVertical,
  ChevronDown,
  ShieldCheck,
  Target,
  Brain
} from 'lucide-react';
import { Risk, ChatMessage, ContractData } from '../types';
import { chatWithLegalAI } from '../geminiService';

interface AIChatPanelProps {
  doc: ContractData | null;
  risks: Risk[];
  onRiskClick: (risk: Risk) => void;
  onToggleValidation: (id: string) => void;
  loading: boolean;
}

const AIChatPanel: React.FC<AIChatPanelProps> = ({ doc, risks, onRiskClick, onToggleValidation, loading }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, chatLoading]);

  const handleSend = async () => {
    if (!input.trim() || !doc) return;
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setChatLoading(true);

    try {
      const response = await chatWithLegalAI(messages, input, doc.content);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response || 'Não consegui processar sua dúvida jurídica no momento.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat error", error);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border-l border-slate-800 shadow-2xl">
      {/* Dynamic Summary Section */}
      <div className="p-6 border-b border-slate-800 bg-slate-900/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Brain size={18} />
            </div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-widest">Inteligência LexAI</h3>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            SISTEMA ATIVO
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <InsightBox 
            label="Nível de Risco" 
            value={risks.filter(r => r.severity === 'high').length > 0 ? 'CRÍTICO' : 'CONTROLADO'} 
            color={risks.filter(r => r.severity === 'high').length > 0 ? 'text-red-400' : 'text-green-400'}
            icon={<Target size={14}/>}
          />
          <InsightBox 
            label="Validação IA" 
            value={`${Math.round((risks.filter(r => r.validated).length / (risks.length || 1)) * 100)}%`} 
            color="text-indigo-400"
            icon={<CheckCircle2 size={14}/>}
          />
        </div>
      </div>

      {/* Main Content: Risks & Chat */}
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
        {/* Risks Section */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Cláusulas sob Auditoria</h4>
            <span className="text-[10px] text-slate-600 font-bold">{risks.length} ALERTAS</span>
          </div>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse shadow-inner"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {risks.map((risk) => (
                <RiskItem 
                  key={risk.id} 
                  risk={risk} 
                  onSelect={() => onRiskClick(risk)}
                  onValidate={() => onToggleValidation(risk.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Chat Section */}
        <div className="mt-auto p-6 bg-slate-900/30 border-t border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare size={14} className="text-indigo-400" />
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Consultoria Imediata</h4>
          </div>

          <div className="space-y-4 min-h-[200px]" ref={scrollRef}>
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 opacity-40">
                <Brain size={32} className="mb-2 text-slate-700" />
                <p className="text-xs text-center px-6">Pergunte à LexAI sobre validade, multas ou conformidade deste contrato.</p>
              </div>
            )}
            
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[90%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                }`}>
                  {m.content}
                </div>
                <span className="text-[9px] text-slate-600 mt-1.5 font-bold uppercase tracking-widest px-1">
                  {m.role === 'user' ? 'Advogado' : 'LexAI Bot'} • {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            
            {chatLoading && (
              <div className="flex items-center gap-2 text-slate-500 animate-pulse">
                <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center">
                  <Loader2 size={12} className="animate-spin" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider">LexAI está processando...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Digite sua dúvida jurídica..."
            className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-4 px-5 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-600"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || chatLoading}
            className="absolute right-2 top-2 p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-[9px] text-center text-slate-600 mt-3 font-medium">
          Powered by Gemini 3 Pro • Conformidade LGPD & ISO 27001
        </p>
      </div>
    </div>
  );
};

const InsightBox = ({ label, value, color, icon }: any) => (
  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col gap-1">
    <div className="flex items-center gap-2 text-slate-500">
      {icon}
      <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
    </div>
    <span className={`text-lg font-black tracking-tight ${color}`}>{value}</span>
  </div>
);

const RiskItem = ({ risk, onSelect, onValidate }: any) => {
  const colors = {
    high: 'border-red-500/20 text-red-400 bg-red-500/5',
    medium: 'border-amber-500/20 text-amber-400 bg-amber-500/5',
    low: 'border-blue-500/20 text-blue-400 bg-blue-500/5'
  };

  return (
    <div 
      onClick={onSelect}
      className={`relative p-5 rounded-2xl border transition-all cursor-pointer group hover:bg-slate-900/80 ${
        risk.validated ? 'opacity-60 border-slate-800 bg-slate-950/40 grayscale-[0.5]' : `border-slate-800 bg-slate-900/40 hover:border-indigo-500/40`
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${colors[risk.severity as keyof typeof colors]}`}>
          {risk.severity} Severity
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); onValidate(); }}
            className={`p-1.5 rounded-lg transition-all ${risk.validated ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-green-400'}`}
            title="Validar Cláusula (Human-in-the-loop)"
          >
            <CheckCircle2 size={16} />
          </button>
          <button className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-100"><MoreVertical size={16} /></button>
        </div>
      </div>

      <h5 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
        {risk.clause}
        {risk.validated && <ShieldCheck size={14} className="text-green-400" />}
      </h5>
      <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 italic mb-3">"{risk.highlightText}"</p>
      <p className="text-xs text-slate-300 font-medium leading-relaxed">{risk.description}</p>
      
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] font-bold">
        <span className="text-slate-600">PAGINA {risk.page}</span>
        <span className="text-indigo-400 group-hover:underline">VER NO CONTRATO →</span>
      </div>
    </div>
  );
};

export default AIChatPanel;
