// Backend endpoint for the Regeneratus text generator.
// The AI integration will be added after the endpoint structure is validated.

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({
      error: "Método não permitido."
    });
  }

  return response.status(200).json({
    success: true,
    message: "Endpoint do Regeneratus funcionando."
  });
}
