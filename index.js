import express from 'express';
import cors from 'cors';
import 'dotenv/config'; // Forma mais moderna de carregar o dotenv
import { GoogleGenerativeAI } from '@google/genai';

// 1. Inicialização do Express
const app = express();
app.use(cors());
app.use(express.json());

// 2. Inicialização da API do Gemini com a chave do ambiente
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 3. Criação da rota que seu app EcoPoint vai chamar
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'O prompt é obrigatório.' });
    }

    // Pega o modelo generativo desejado
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Gera o conteúdo a partir do prompt
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Retorna o texto gerado como JSON
    res.json({ text });

  } catch (error) {
    console.error('Erro ao chamar a API do Gemini:', error);
    res.status(500).json({ error: 'Falha ao se comunicar com a IA.' });
  }
});

// 4. Exporta o app para a Vercel (substitui o app.listen)
export default app;