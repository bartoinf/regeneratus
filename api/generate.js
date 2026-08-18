// Backend endpoint for the Regeneratus text generator.
// The API key is kept on Vercel as OPENAI_API_KEY and is never exposed to the browser.

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Método não permitido." });
  }

  try {
    const { type, tone, length, topic } = request.body || {};

    if (!type || !tone || !length || !topic) {
      return response.status(400).json({ error: "Informe tipo, tom, tamanho e tema." });
    }

    if (!process.env.OPENAI_API_KEY) {
      return response.status(500).json({ error: "A chave da API não está configurada no servidor." });
    }

    const prompt = `Você é o gerador de textos da plataforma Regeneratus.

Crie um texto original em português do Brasil.
Tipo: ${type}
Tom de voz: ${tone}
Tamanho: ${length}
Tema: ${topic}

Regras:
- Entregue somente o texto final, sem explicar as instruções.
- Não mencione tipo, tom ou tamanho no texto.
- Não use títulos como "Texto gerado".
- Adapte o vocabulário e a estrutura ao tipo de conteúdo solicitado.
- O texto deve soar natural, claro e pronto para uso.
`;

    const openAIResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5.4-nano",
        reasoning: { effort: "none" },
        input: prompt,
        max_output_tokens: 500
      })
    });

    const rawBody = await openAIResponse.text();
    let data;

    try {
      data = JSON.parse(rawBody);
    } catch (parseError) {
      console.error("Invalid OpenAI response:", rawBody);
      return response.status(502).json({ error: "A resposta da IA não pôde ser interpretada." });
    }

    if (!openAIResponse.ok) {
      console.error("OpenAI API error:", data);
      return response.status(openAIResponse.status).json({
        error: data?.error?.message || "A IA não conseguiu gerar o texto neste momento."
      });
    }

    const generatedText = data.output_text?.trim();

    if (!generatedText) {
      return response.status(502).json({ error: "A IA não retornou um texto válido." });
    }

    return response.status(200).json({ success: true, text: generatedText });
  } catch (error) {
    console.error("Regeneratus API error:", error);
    return response.status(500).json({ error: "Não foi possível processar a solicitação." });
  }
}
