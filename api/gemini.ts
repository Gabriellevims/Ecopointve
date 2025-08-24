import { GoogleGenerativeAI } from "@google/generative-ai";

// Exporta uma função assíncrona para lidar com pedidos GET e POST
export async function POST(request: Request) {
  // 1. Instanciar o cliente da API Gemini com a chave de API a partir das variáveis de ambiente
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

  try {
    // 2. Extrair o 'prompt' do corpo do pedido JSON
    const { prompt } = await request.json();

    // Validar a entrada
    if (!prompt) {
      return new Response(
        JSON.stringify({ success: false, error: "Prompt is required" }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Obter o modelo generativo
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 4. Chamar a API Gemini para gerar conteúdo
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // 5. Retornar a resposta da Gemini para o cliente
    return new Response(
      JSON.stringify({ success: true, data: text }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    // 6. Lidar com erros de forma graciosa
    console.error("Error processing Gemini request:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal Server Error" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}