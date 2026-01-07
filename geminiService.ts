
import { GoogleGenAI, Type } from "@google/genai";

// Inicialização segura - assume que process.env.API_KEY está disponível globalmente no runner
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const LEGAL_SYSTEM_INSTRUCTION = `
Você é o LexAI, analista sênior em Legal Operations.
Sua especialidade é auditoria de contratos complexos.
Foque em: Multas abusivas, Foro estrangeiro, Brechas de rescisão e Conformidade LGPD.
Responda sempre com precisão jurídica e tom profissional 2026.
`;

export async function analyzeContract(content: string) {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analise este extrato de contrato e extraia 3 riscos jurídicos reais. 
      JSON format: { "risks": [{ "clause": "Título", "description": "Explicação", "severity": "high/medium/low", "highlightText": "texto exato no contrato" }], "summary": "texto" }
      Contrato: ${content}`,
      config: {
        systemInstruction: LEGAL_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            risks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  clause: { type: Type.STRING },
                  description: { type: Type.STRING },
                  severity: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
                  highlightText: { type: Type.STRING }
                },
                required: ['clause', 'description', 'severity', 'highlightText']
              }
            },
            summary: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text || '{}';
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return { risks: [], summary: "Erro na conexão com o motor de IA." };
  }
}

export async function chatWithLegalAI(history: any[], message: string, context: string) {
  try {
    const ai = getAI();
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      history: history.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      })),
      config: {
        systemInstruction: `${LEGAL_SYSTEM_INSTRUCTION}\nContexto: ${context}`,
      },
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    return "Desculpe, tive um problema ao processar sua dúvida. Tente novamente.";
  }
}
