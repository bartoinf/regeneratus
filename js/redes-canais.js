const channel = document.getElementById("channel");
const objective = document.getElementById("objective");
const tone = document.getElementById("tone");
const topic = document.getElementById("topic");
const generateContent = document.getElementById("generateContent");
const contentResult = document.getElementById("contentResult");

const HISTORY_KEY = "regeneratus_channels_history";
const FAVORITES_KEY = "regeneratus_channels_favorites";
const channelNames = { instagram: "Instagram", facebook: "Facebook", linkedin: "LinkedIn", x: "X/Twitter", tiktok: "TikTok", whatsapp: "WhatsApp" };
const demoFormats = {
  instagram: topic => `Legenda para Instagram: ${topic}. Uma oportunidade para quem busca resultados com uma comunicação ${tone.value}. Objetivo: ${objective.value}. ✨ Descubra, compartilhe e participe.`,
  facebook: topic => `Post para Facebook: ${topic}. Uma solução pensada para gerar valor e aproximar pessoas. Comunicação ${tone.value}, com foco em ${objective.value}. Conheça e compartilhe essa novidade.`,
  linkedin: topic => `Post para LinkedIn: ${topic}. Uma proposta voltada a resultados, inovação e eficiência. Em uma abordagem ${tone.value}, o objetivo é ${objective.value} e gerar uma conversa relevante com o público.`,
  x: topic => `Post para X/Twitter: ${topic}. Comunicação ${tone.value}, objetiva e focada em ${objective.value}. Conheça a proposta e acompanhe as novidades.`,
  tiktok: topic => `Legenda/ideia para TikTok: ${topic}. Crie um vídeo curto, dinâmico e ${tone.value}, destacando o benefício principal e convidando o público a conhecer mais. Objetivo: ${objective.value}.`,
  whatsapp: topic => `Mensagem para WhatsApp: Olá! Gostaria de compartilhar uma novidade: ${topic}. A ideia é ajudar você de forma prática, com uma comunicação ${tone.value} e foco em ${objective.value}. Se fizer sentido para você, posso te mostrar mais.`
};

function getHistory() { try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch (error) { return []; } }
function saveHistory(items) { localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, 10))); }
function getFavorites() { try { return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || []; } catch (error) { return []; } }
function saveFavorites(items) { localStorage.setItem(FAVORITES_KEY, JSON.stringify(items.slice(0, 20))); }
function escapeHtml(value) { const div = document.createElement("div"); div.textContent = value; return div.innerHTML; }
function isFavorite(key, text) { return getFavorites().some(item => item.channel === key && item.text === text); }

function addToHistory(channels) {
  const history = getHistory();
  history.unshift({ id: Date.now(), topic: topic.value.trim(), objective: objective.value, tone: tone.value, createdAt: new Date().toLocaleString("pt-BR"), channels });
  saveHistory(history);
}

function toggleFavorite(key, text, metadata = {}) {
  const favorites = getFavorites();
  const index = favorites.findIndex(item => item.channel === key && item.text === text);
  if (index >= 0) favorites.splice(index, 1);
  else favorites.unshift({ id: Date.now(), channel: key, text, topic: metadata.topic || topic.value.trim(), objective: metadata.objective || objective.value, tone: metadata.tone || tone.value, createdAt: new Date().toLocaleString("pt-BR") });
  saveFavorites(favorites);
  renderFavorites();
}

function renderChannelCard(key, text, historyId = null) {
  return `<article class="result-card channel-result" data-channel="${key}" data-history-id="${historyId || ""}"><h3>${channelNames[key]}</h3><textarea class="generated-text editable-channel" data-channel="${key}" aria-label="Editar conteúdo para ${channelNames[key]}">${escapeHtml(text)}</textarea><div class="result-actions"><button type="button" class="button save-channel" data-channel="${key}">Salvar edição</button><button type="button" class="button secondary-button copy-channel" data-channel="${key}">Copiar</button><button type="button" class="button secondary-button favorite-channel" data-channel="${key}">${isFavorite(key, text) ? "★ Favoritado" : "☆ Favoritar"}</button></div><p class="edit-hint">Edite esta versão sem alterar os outros canais.</p></article>`;
}

function bindChannelActions() {
  document.querySelectorAll(".save-channel").forEach(button => button.addEventListener("click", function () {
    const key = this.dataset.channel; const textarea = document.querySelector(`.editable-channel[data-channel="${key}"]`); const card = this.closest(".channel-result");
    if (!textarea || !textarea.value.trim()) return;
    const historyId = Number(card.dataset.historyId); const history = getHistory(); const entry = history.find(item => item.id === historyId);
    if (entry && entry.channels[key]) { entry.channels[key] = textarea.value.trim(); saveHistory(history); }
    this.textContent = "Edição salva!"; setTimeout(() => this.textContent = "Salvar edição", 1800);
  }));
  document.querySelectorAll(".copy-channel").forEach(button => button.addEventListener("click", async function () {
    const key = this.dataset.channel; const textarea = document.querySelector(`.editable-channel[data-channel="${key}"]`); if (!textarea) return;
    try { await navigator.clipboard.writeText(textarea.value); this.textContent = "Copiado!"; setTimeout(() => this.textContent = "Copiar", 1500); } catch (error) { alert("Não foi possível copiar o conteúdo."); }
  }));
  document.querySelectorAll(".favorite-channel").forEach(button => button.addEventListener("click", function () {
    const key = this.dataset.channel; const textarea = document.querySelector(`.editable-channel[data-channel="${key}"]`); if (!textarea || !textarea.value.trim()) return;
    toggleFavorite(key, textarea.value.trim(), { topic: topic.value.trim(), objective: objective.value, tone: tone.value });
    this.textContent = isFavorite(key, textarea.value.trim()) ? "★ Favoritado" : "☆ Favoritar";
  }));
}

function renderHistory() {
  const history = getHistory();
  let container = document.getElementById("channelHistory");
  if (!container) { container = document.createElement("section"); container.id = "channelHistory"; container.className = "history"; contentResult.parentNode.appendChild(container); }
  if (!history.length) { container.innerHTML = ""; return; }
  container.innerHTML = `<div class="history-header"><div><h3>Histórico de conteúdos</h3><p>Últimas gerações salvas neste navegador.</p></div><button type="button" id="clearChannelHistory" class="history-clear">Limpar histórico</button></div><div class="history-list">${history.map((item, index) => `<article class="history-item"><div class="history-item-info"><strong>${escapeHtml(item.topic)}</strong><small>${item.createdAt} · ${item.objective}</small></div><p>${Object.entries(item.channels).map(([key, text]) => `<strong>${channelNames[key]}:</strong> ${escapeHtml(text)}`).join("<br>")}</p><div class="history-actions"><button type="button" class="channel-history-use" data-index="${index}">Usar novamente</button></div></article>`).join("")}</div>`;
  document.querySelectorAll(".channel-history-use").forEach(button => button.addEventListener("click", function () {
    const item = getHistory()[Number(this.dataset.index)]; if (!item) return;
    topic.value = item.topic; objective.value = item.objective; tone.value = item.tone; channel.value = Object.keys(item.channels).length === Object.keys(channelNames).length ? "todos" : Object.keys(item.channels)[0];
    contentResult.innerHTML = `<div class="results-grid">${Object.entries(item.channels).map(([key, text]) => renderChannelCard(key, text, item.id)).join("")}</div>`; bindChannelActions(); window.scrollTo({ top: 0, behavior: "smooth" });
  }));
  document.getElementById("clearChannelHistory").addEventListener("click", function () { if (confirm("Deseja realmente apagar todo o histórico de conteúdos?")) { localStorage.removeItem(HISTORY_KEY); renderHistory(); } });
}

function renderFavorites() {
  const favorites = getFavorites();
  let container = document.getElementById("channelFavorites");
  if (!container) { container = document.createElement("section"); container.id = "channelFavorites"; container.className = "history favorites"; const history = document.getElementById("channelHistory"); (history || contentResult).parentNode.appendChild(container); }
  if (!favorites.length) { container.innerHTML = ""; return; }
  container.innerHTML = `<div class="history-header"><div><h3>Favoritos</h3><p>Versões de canais que você escolheu guardar.</p></div><button type="button" id="clearChannelFavorites" class="history-clear">Limpar favoritos</button></div><div class="history-list">${favorites.map((item, index) => `<article class="history-item"><div class="history-item-info"><strong>${channelNames[item.channel]}</strong><small>${escapeHtml(item.topic)} · ${item.createdAt}</small></div><p>${escapeHtml(item.text)}</p><div class="history-actions"><button type="button" class="favorite-copy" data-index="${index}">Copiar</button><button type="button" class="favorite-remove" data-index="${index}">★ Remover</button><button type="button" class="favorite-use" data-index="${index}">Usar novamente</button></div></article>`).join("")}</div>`;
  document.querySelectorAll(".favorite-copy").forEach(button => button.addEventListener("click", async function () { const item = getFavorites()[Number(this.dataset.index)]; if (!item) return; try { await navigator.clipboard.writeText(item.text); this.textContent = "Copiado!"; setTimeout(() => this.textContent = "Copiar", 1500); } catch (error) { alert("Não foi possível copiar."); } }));
  document.querySelectorAll(".favorite-remove").forEach(button => button.addEventListener("click", function () { const item = getFavorites()[Number(this.dataset.index)]; if (!item) return; toggleFavorite(item.channel, item.text, item); }));
  document.querySelectorAll(".favorite-use").forEach(button => button.addEventListener("click", function () { const item = getFavorites()[Number(this.dataset.index)]; if (!item) return; topic.value = item.topic; objective.value = item.objective; tone.value = item.tone; channel.value = item.channel; contentResult.innerHTML = `<div class="results-grid">${renderChannelCard(item.channel, item.text)}</div>`; bindChannelActions(); window.scrollTo({ top: 0, behavior: "smooth" }); }));
  document.getElementById("clearChannelFavorites").addEventListener("click", function () { if (confirm("Deseja realmente apagar todos os favoritos?")) { localStorage.removeItem(FAVORITES_KEY); renderFavorites(); bindChannelActions(); } });
}

generateContent.addEventListener("click", async () => {
  const topicValue = topic.value.trim();
  if (!topicValue) { contentResult.innerHTML = `<div class="result-card"><h3>Informe o tema</h3><p>Digite o assunto que deseja transformar em conteúdo.</p></div>`; return; }
  generateContent.disabled = true; generateContent.textContent = "Gerando..."; contentResult.innerHTML = `<div class="result-card"><h3>Gerando conteúdo...</h3><p>Preparando uma demonstração para o canal escolhido.</p></div>`;
  await new Promise(resolve => setTimeout(resolve, 500));
  const selectedChannels = channel.value === "todos" ? Object.keys(channelNames) : [channel.value];
  const channels = Object.fromEntries(selectedChannels.map(key => [key, demoFormats[key](topicValue)]));
  const historyId = Date.now(); addToHistory(channels); const historyEntry = getHistory()[0]; historyEntry.id = historyId; saveHistory(getHistory());
  contentResult.innerHTML = `<div class="results-grid">${Object.entries(channels).map(([key, text]) => renderChannelCard(key, text, historyId)).join("")}</div>`; bindChannelActions(); renderHistory(); renderFavorites();
  generateContent.disabled = false; generateContent.textContent = "Gerar conteúdo";
});

renderHistory(); renderFavorites();
