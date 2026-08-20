const channel = document.getElementById("channel");
const objective = document.getElementById("objective");
const tone = document.getElementById("tone");
const topic = document.getElementById("topic");
const generateContent = document.getElementById("generateContent");
const contentResult = document.getElementById("contentResult");

const channelNames = { instagram: "Instagram", facebook: "Facebook", linkedin: "LinkedIn", x: "X/Twitter", tiktok: "TikTok", whatsapp: "WhatsApp" };
const demoFormats = {
  instagram: topic => `Legenda para Instagram: ${topic}. Uma oportunidade para quem busca resultados com uma comunicação ${tone.value}. Objetivo: ${objective.value}. ✨ Descubra, compartilhe e participe.`,
  facebook: topic => `Post para Facebook: ${topic}. Uma solução pensada para gerar valor e aproximar pessoas. Comunicação ${tone.value}, com foco em ${objective.value}. Conheça e compartilhe essa novidade.`,
  linkedin: topic => `Post para LinkedIn: ${topic}. Uma proposta voltada a resultados, inovação e eficiência. Em uma abordagem ${tone.value}, o objetivo é ${objective.value} e gerar uma conversa relevante com o público.`,
  x: topic => `Post para X/Twitter: ${topic}. Comunicação ${tone.value}, objetiva e focada em ${objective.value}. Conheça a proposta e acompanhe as novidades.`,
  tiktok: topic => `Legenda/ideia para TikTok: ${topic}. Crie um vídeo curto, dinâmico e ${tone.value}, destacando o benefício principal e convidando o público a conhecer mais. Objetivo: ${objective.value}.`,
  whatsapp: topic => `Mensagem para WhatsApp: Olá! Gostaria de compartilhar uma novidade: ${topic}. A ideia é ajudar você de forma prática, com uma comunicação ${tone.value} e foco em ${objective.value}. Se fizer sentido para você, posso te mostrar mais.`
};

function escapeHtml(value) { const div = document.createElement("div"); div.textContent = value; return div.innerHTML; }

function renderChannelCard(key, text) {
  return `<article class="result-card channel-result" data-channel="${key}"><h3>${channelNames[key]}</h3><textarea class="generated-text editable-channel" data-channel="${key}" aria-label="Editar conteúdo para ${channelNames[key]}">${escapeHtml(text)}</textarea><div class="result-actions"><button type="button" class="button save-channel" data-channel="${key}">Salvar edição</button><button type="button" class="button secondary-button copy-channel" data-channel="${key}">Copiar</button></div><p class="edit-hint">Edite esta versão sem alterar os outros canais.</p></article>`;
}

function bindChannelActions() {
  document.querySelectorAll(".save-channel").forEach(button => button.addEventListener("click", function () {
    const key = this.dataset.channel;
    const textarea = document.querySelector(`.editable-channel[data-channel="${key}"]`);
    if (!textarea || !textarea.value.trim()) return;
    this.textContent = "Edição salva!";
    setTimeout(() => this.textContent = "Salvar edição", 1800);
  }));
  document.querySelectorAll(".copy-channel").forEach(button => button.addEventListener("click", async function () {
    const key = this.dataset.channel;
    const textarea = document.querySelector(`.editable-channel[data-channel="${key}"]`);
    if (!textarea) return;
    try { await navigator.clipboard.writeText(textarea.value); this.textContent = "Copiado!"; setTimeout(() => this.textContent = "Copiar", 1500); }
    catch (error) { alert("Não foi possível copiar o conteúdo."); }
  }));
}

generateContent.addEventListener("click", async () => {
  const topicValue = topic.value.trim();
  if (!topicValue) { contentResult.innerHTML = `<div class="result-card"><h3>Informe o tema</h3><p>Digite o assunto que deseja transformar em conteúdo.</p></div>`; return; }
  generateContent.disabled = true; generateContent.textContent = "Gerando...";
  contentResult.innerHTML = `<div class="result-card"><h3>Gerando conteúdo...</h3><p>Preparando uma demonstração para o canal escolhido.</p></div>`;
  await new Promise(resolve => setTimeout(resolve, 500));
  const selectedChannels = channel.value === "todos" ? Object.keys(channelNames) : [channel.value];
  contentResult.innerHTML = `<div class="results-grid">${selectedChannels.map(key => renderChannelCard(key, demoFormats[key](topicValue))).join("")}</div>`;
  bindChannelActions();
  generateContent.disabled = false; generateContent.textContent = "Gerar conteúdo";
});
