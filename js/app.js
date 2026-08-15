const generateButton = document.getElementById("generateButton");
const textType = document.getElementById("textType");
const textTopic = document.getElementById("textTopic");
const result = document.getElementById("result");

generateButton.addEventListener("click", function () {
  const type = textType.value;
  const topic = textTopic.value.trim();

  if (!type || !topic) {
    result.innerHTML = `
      <h3>Preencha os campos</h3>
      <p>
        Escolha o tipo de texto e informe sobre o que você deseja escrever.
      </p>
    `;
    return;
  }

  let generatedText = "";

  switch (type) {
    case "produto":
      generatedText = `Descrição de produto sobre: ${topic}. Este produto foi desenvolvido para oferecer praticidade, qualidade e uma excelente experiência ao usuário.`;
      break;

    case "anuncio":
      generatedText = `Anúncio: Conheça ${topic}! Uma oportunidade especial para quem busca qualidade, praticidade e excelentes resultados.`;
      break;

    case "social":
      generatedText = `Post para redes sociais: ✨ Conheça ${topic}! Uma solução pensada para tornar sua experiência mais simples, prática e eficiente.`;
      break;

    case "email":
      generatedText = `Olá,\n\nGostaria de apresentar uma oportunidade relacionada a ${topic}. Acreditamos que essa solução pode trazer benefícios e resultados importantes.\n\nAtenciosamente,\nEquipe Regeneratus`;
      break;
  }

  result.innerHTML = `
    <h3>Texto gerado</h3>
    <p>${generatedText.replace(/\n/g, "<br>")}</p>
  `;
});