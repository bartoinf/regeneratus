// Backend endpoint for the Regeneratus text generator.
// This first version validates the browser-to-backend communication.

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

    return response.status(200).json({
      success: true,
      received: {
        type,
        tone,
        length,
        topic
      }
    });
  } catch (error) {
    return response.status(500).json({
      error: "Não foi possível processar a solicitação."
    });
  }
}
