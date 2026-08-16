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
      <p>Escolha o tipo de texto e informe sobre o que você deseja escrever.</p>
    `;
    return;
  }

  const toneIntro = {
    profissional: "clareza e confiança",
    amigavel: "proximidade e naturalidade",
    persuasivo: "uma comunicação envolvente e focada em benefícios",
    criativo: "criatividade e personalidade"
  }[tone];

  const lengthMode = {
    curto: "curto",
    medio: "equilibrado",
    longo: "detalhado"
  }[length];

  let generatedText = "";

  switch (type) {
    case "produto":
      generatedText = `Conheça ${topic}. Uma solução pensada para quem valoriza ${toneIntro}. Com uma proposta prática e diferenciada, ${topic} pode ajudar você a alcançar melhores resultados no dia a dia. Descubra como essa solução pode fazer a diferença.`;
      break;

    case "anuncio":
      generatedText = `✨ Descubra ${topic}! Se você procura uma solução que combine praticidade, qualidade e ${toneIntro}, esta pode ser a oportunidade que estava procurando. Conheça agora e veja tudo o que ${topic} pode oferecer.`;
      break;

    case "social":
      generatedText = `✨ Conheça ${topic}! Uma solução criada para quem busca praticidade, qualidade e ${toneIntro}. Se você acredita que boas ideias podem transformar resultados, vale a pena conhecer. Experimente, descubra e compartilhe!`;
      break;

    case "email":
      generatedText = `Olá,\n\nGostaria de apresentar ${topic}, uma solução desenvolvida para quem busca praticidade, qualidade e ${toneIntro}.\n\nA proposta é oferecer uma experiência simples e útil, ajudando você a transformar uma necessidade em uma oportunidade de resultado.\n\nSe este assunto fizer sentido para você, podemos conversar melhor e apresentar os próximos detalhes.\n\nAtenciosamente,\nEquipe Regeneratus`;
      break;
  }

  if (lengthMode === "curto") {
    generatedText = generatedText.split(" ").slice(0, 45).join(" ").replace(/[,.!?]$/, "") + ".";
  }

  if (lengthMode === "detalhado") {
    generatedText += "\n\nMais do que uma ferramenta, a proposta é criar uma experiência que una simplicidade, utilidade e resultados reais para quem utiliza a solução.";
  }

  result.innerHTML = `
    <h3>Texto gerado</h3>
    <p>${generatedText.replace(/\n/g, "<br>")}</p>
  `;
});
