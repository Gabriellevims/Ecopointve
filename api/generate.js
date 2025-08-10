// api/generate.js
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// handler exportado (ESM)
export default async function handler(req, res) {
  // CORS básico (aceita chamadas do app mobile/web)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'prompt é obrigatório' });

    // Faz a chamada ao Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',   // ou gemini-2.5-flash, escolha o modelo que você tiver acesso
      contents: prompt
    });

    // response.text costuma ser a string com o texto gerado
    const text = response?.text ?? '';

    return res.status(200).json({ text });
  } catch (err) {
    console.error('Erro ao chamar Gemini:', err);
    return res.status(500).json({ error: 'Falha ao se comunicar com a IA', details: String(err) });
  }
}
