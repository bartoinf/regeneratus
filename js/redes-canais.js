const channel = document.getElementById("channel");
const objective = document.getElementById("objective");
const tone = document.getElementById("tone");
const topic = document.getElementById("topic");
const generateContent = document.getElementById("generateContent");
const contentResult = document.getElementById("contentResult");

const channelNames = {
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  x: "X/Twitter",
  tiktok: "TikTok",
  whatsapp: "WhatsApp"
};

function createDemoContent(channelKey, objectiveValue, toneValue, topicValue) {
  const name = channelNames[channelKey];
  const formats = {
    instagram: `Legenda para Instagram: ${topicValue}. Uma oportunidade para quem busca resultados com uma comunicação ${toneValue}. Objetivo: ${objectiveValue}. ✨ Descubra, compartilhe e participe.`,
    facebook: `Post para Facebook: ${topicValue}. Uma solução pensada para gerar valor e aproximar pessoas. Comunicação ${toneValue}, com foco em ${objectiveValue}. Conheça e compartilhe essa novidade.`,
    linkedin: `Post para LinkedIn: ${topicValue}. Uma proposta voltada a resultados, inovação e eficiência. Em uma abordagem ${toneValue}, o objetivo é ${objectiveValue} e gerar uma conversa relevante com o público.`,
    x: `Post para X/Twitter: ${topicValue}. Comunicação ${toneValue}, objetiva e focada em ${objectiveValue}. Conheça a proposta e acompanhe as novidades.`,
    tiktok: `Legenda/ideia para TikTok: ${topicValue}. Crie um vídeo curto, dinâmico e ${toneValue}, destacando o benefício principal e convidando o público a conhecer mais. Objetivo: ${objectiveValue}.`,
    whatsapp: `Mensagem para WhatsApp: Olá! Gostaria de compartilhar uma novidade: ${topicValue}. A ideia é ajudar você de forma prática, com uma comunicação ${toneValue} e foco em ${objectiveValue}. Se fizer sentido para você, posso te mostrar mais.`
  };
  return `### ${name}\n\n${formats[channelKey]}`;
}

generateContent.addEventListener("click", async () => {
  const topicValue = topic.value.trim();
  if (!topicValue) {
    contentResult.innerHTML = "<div class=\"result-card\"><h3>Informe o tema</h3><p>Digite o assunto que deseja transformar em conteúdo.</p></div>";
    return;
  }

  generateContent.disabled = true;
  generateContent.textContent = "Gerando...";
  contentResult.innerHTML = "<div class=\"result-card\"><h3>Gerando conteúdo...</h3><p>Preparando uma demonstração para o canal escolhido.</p></div>";

  await new Promise(resolve => setTimeout(resolve, 500));

  const selectedChannels = channel.value === "todos" ? Object.keys(channelNames) : [channel.value];
  const texts = selectedChannels.map(key => createDemoContent(key, objective.value, tone.value, topicValue));

  contentResult.innerHTML = `
    <div class="result-card">
      <h3>Conteúdo gerado</h3>
      <div class="generated-text">${texts.join("\n\n")}</div>
    </div>`;

  generateContent.disabled = false;
  generateContent.textContent = "Gerar conteúdo";
});
