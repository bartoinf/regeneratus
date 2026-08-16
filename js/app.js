const generateButton = document.getElementById("generateButton");
const textType = document.getElementById("textType");
const textTone = document.getElementById("textTone");
const textLength = document.getElementById("textLength");
const textTopic = document.getElementById("textTopic");
const result = document.getElementById("result");

generateButton.addEventListener("click", function () {
  const type = textType.value;
  const tone = textTone.value;
  const length = textLength.value;
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

  const toneText = {
    profissional: "com linguagem profissional e objetiva",
    amigavel: "com linguagem amigável e próxima",
    persuasivo: "com linguagem persuasiva e orientada para ação",
    criativo: "com linguagem criativa e envolvente"
  }[tone];

  const lengthText = {
    curto: "em uma versão curta e direta",
    medio: "em uma versão equilibrada e completa",
    longo: "em uma versão detalhada e completa"
  }[length];

  let generatedText = "";

  switch (type) {
    case "produto":
      generatedText = `Descrição de produto sobre ${topic}, ${toneText}, ${lengthText}. Este produto foi pensado para oferecer praticidade, qualidade e uma experiência diferenciada ao cliente.`;
      break;

    case "anuncio":
      generatedText = `Anúncio sobre ${topic}, ${toneText}, ${lengthText}. Conheça uma solução criada para quem busca qualidade, praticidade e resultados. Aproveite esta oportunidade e descubra tudo o que ela pode oferecer.`;
      break;

    case "social":
      generatedText = `Post para redes sociais sobre ${topic}, ${toneText}, ${lengthText}. ✨ Descubra uma solução pensada para tornar sua experiência mais simples, prática e eficiente. Conheça e compartilhe essa novidade!`;
      break;

    case "email":
      generatedText = `Olá,\n\nGostaria de apresentar uma oportunidade relacionada a ${topic}. Este conteúdo foi preparado ${toneText} e ${lengthText}, destacando os principais benefícios e possibilidades.\n\nSe fizer sentido para você, podemos conversar melhor sobre essa oportunidade.\n\nAtenciosamente,\nEquipe Regeneratus`;
      break;
  }

  result.innerHTML = `
    <h3>Texto gerado</h3>
    <p>${generatedText.replace(/\n/g, "<br>")}</p>
  `;
});
