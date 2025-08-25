import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  // 1. Garante que a variável de ambiente existe
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("❌ Erro: GEMINI_API_KEY não encontrada no ambiente.");
    return new Response(
      JSON.stringify({ success: false, error: "API Key not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    // 2. Extrair o prompt do corpo da requisição
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return new Response(
        JSON.stringify({ success: false, error: "Prompt is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Pega o modelo
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 4. Gera a resposta
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // 5. Retorna para o cliente
    return new Response(
      JSON.stringify({ success: true, data: text }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Erro no Gemini:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
