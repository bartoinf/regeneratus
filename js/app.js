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
  generateButton.textContent = "Gerando...";

  result.innerHTML = `
    <h3>Gerando seu texto...</h3>
    <p>O Regeneratus está consultando a inteligência artificial.</p>
  `;

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ type, tone, length, topic })
    });

    const rawBody = await response.text();
    let data;

    try {
      data = JSON.parse(rawBody);
    } catch (parseError) {
      throw new Error(`O servidor retornou uma resposta inesperada (${response.status}).`);
    }

    if (!response.ok) {
      throw new Error(data.error || "Não foi possível gerar o texto.");
    }

    result.innerHTML = `
      <h3>Texto gerado</h3>
      <p>${data.text}</p>
    `;
  } catch (error) {
    result.innerHTML = `
      <h3>Não foi possível gerar o texto</h3>
      <p>${error.message}</p>
    `;
  } finally {
    generateButton.disabled = false;
    generateButton.textContent = "Gerar texto";
  }
});
