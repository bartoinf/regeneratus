const generateButton = document.getElementById("generateButton");
const textType = document.getElementById("textType");
const textTone = document.getElementById("textTone");
const textLength = document.getElementById("textLength");
const textTopic = document.getElementById("textTopic");
const result = document.getElementById("result");

generateButton.addEventListener("click", async function () {
  const type = textType.value;
  const tone = textTone.value;
  const length = textLength.value;
  const topic = textTopic.value.trim();

  if (!type || !tone || !length || !topic) {
    result.innerHTML = `
      <h3>Preencha os campos</h3>
      <p>Escolha o tipo, o tom, o tamanho e informe sobre o que você deseja escrever.</p>
    `;
    return;
  }

  generateButton.disabled = true;
  generateButton.textContent = "Enviando...";

  result.innerHTML = `
    <h3>Conectando ao Regeneratus...</h3>
    <p>Estamos enviando suas escolhas para o backend.</p>
  `;

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type,
        tone,
        length,
        topic
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Não foi possível processar a solicitação.");
    }

    result.innerHTML = `
      <h3>Backend conectado</h3>
      <p>Os dados foram enviados com sucesso para a API do Regeneratus.</p>
      <p><strong>Tipo:</strong> ${data.received.type}</p>
      <p><strong>Tom:</strong> ${data.received.tone}</p>
      <p><strong>Tamanho:</strong> ${data.received.length}</p>
      <p><strong>Tema:</strong> ${data.received.topic}</p>
    `;
  } catch (error) {
    result.innerHTML = `
      <h3>Não foi possível conectar</h3>
      <p>${error.message}</p>
    `;
  } finally {
    generateButton.disabled = false;
    generateButton.textContent = "Gerar texto";
  }
});
