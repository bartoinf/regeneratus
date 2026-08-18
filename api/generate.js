// Backend endpoint for the Regeneratus text generator.
// OPENAI_API_KEY is stored securely in Vercel Environment Variables.

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({
      error: "Método não permitido."
    });
  }

  try {
    const { type, tone, length, topic } = request.body || {};

    if (!type || !tone || !length || !topic) {
      return response.status(400).json({
        error: "Informe tipo, tom, tamanho e tema."
      });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return response.status(500).json({
        error: "A chave da API não está configurada no servidor."
      });
    }

    const prompt = `Você é o gerador de textos da plataforma Regeneratus.

Crie um texto original em português do Brasil.
Tipo: ${type}
Tom de voz: ${tone}
Tamanho: ${length}
Tema: ${topic}

Regras:
- Entregue somente o texto final.
- Não explique as instruções.
- Não mencione tipo, tom ou tamanho no texto.
- Não use o título "Texto gerado".
- Adapte o vocabulário e a estrutura ao tipo de conteúdo solicitado.
- O texto deve soar natural, claro e pronto para uso.`;

    const openAIResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-5.4-nano",
        input: prompt,
        max_output_tokens: 500
      })
    });

    const rawBody = await openAIResponse.text();
    let data;

    try {
      data = JSON.parse(rawBody);
    } catch (error) {
      console.error("Resposta não-JSON da OpenAI:", rawBody);
      return response.status(502).json({
        error: "A OpenAI retornou uma resposta inválida."
      });
    }

    if (!openAIResponse.ok) {
      console.error("Erro da OpenAI:", data);
      return response.status(openAIResponse.status).json({
        error: data?.error?.message || "A OpenAI não conseguiu gerar o texto."
      });
    }

    const generatedText = data.output_text?.trim();

    if (!generatedText) {
      console.error("Resposta sem output_text:", data);
      return response.status(502).json({
        error: "A OpenAI não retornou um texto válido."
      });
    }

    return response.status(200).json({
      success: true,
      text: generatedText
    });
  } catch (error) {
    console.error("Erro no backend Regeneratus:", error);
    return response.status(500).json({
      error: error?.message || "Não foi possível processar a solicitação."
    });
  }
}
