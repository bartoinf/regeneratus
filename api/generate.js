// Backend endpoint for the Regeneratus text generator.
// The API key is kept on Vercel as OPENAI_API_KEY and is never exposed to the browser.

export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return Response.json(
        { error: "Método não permitido." },
        { status: 405 }
      );
    }

    try {
      const body = await request.json();
      const { type, tone, length, topic } = body || {};

      if (!type || !tone || !length || !topic) {
        return Response.json(
          { error: "Informe tipo, tom, tamanho e tema." },
          { status: 400 }
        );
      }

      if (!process.env.OPENAI_API_KEY) {
        return Response.json(
          { error: "A chave da API não está configurada no servidor." },
          { status: 500 }
        );
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
        return Response.json(
          { error: "A resposta da IA não pôde ser interpretada." },
          { status: 502 }
        );
      }

      if (!openAIResponse.ok) {
        console.error("OpenAI API error:", data);
        return Response.json(
          { error: data?.error?.message || "A IA não conseguiu gerar o texto neste momento." },
          { status: openAIResponse.status }
        );
      }

      const generatedText = data.output_text?.trim();

      if (!generatedText) {
        return Response.json(
          { error: "A IA não retornou um texto válido." },
          { status: 502 }
        );
      }

      return Response.json({
        success: true,
        text: generatedText
      });
    } catch (error) {
      console.error("Regeneratus API error:", error);
      return Response.json(
        { error: "Não foi possível processar a solicitação." },
        { status: 500 }
      );
    }
  }
};
