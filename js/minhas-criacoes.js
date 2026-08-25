const content = document.getElementById("creationsContent");
const tabs = document.querySelectorAll(".creation-tab");

const TEXT_HISTORY_KEY = "regeneratus_text_history";
const TEXT_FAVORITES_KEY = "regeneratus_text_favorites";
const CHANNEL_HISTORY_KEY = "regeneratus_channels_history";
const CHANNEL_FAVORITES_KEY = "regeneratus_channels_favorites";
const TITLE_HISTORY_KEY = "regeneratus_titles_history";
const TITLE_FAVORITES_KEY = "regeneratus_titles_favorites";

function read(key) { try { return JSON.parse(localStorage.getItem(key)) || []; } catch (error) { return []; } }
function escapeHtml(value) { const div = document.createElement("div"); div.textContent = String(value ?? ""); return div.innerHTML; }
function formatDate(value) { return value || "Data não informada"; }

function collectRecent() {
  const text = read(TEXT_HISTORY_KEY).map(item => ({ kind: "Gerador de Textos", title: item.topic || item.title || "Texto gerado", date: item.createdAt || item.date, content: item.text || item.content || item.generatedText || "" }));
  const channels = read(CHANNEL_HISTORY_KEY).map(item => ({ kind: "Redes e Canais", title: item.topic || "Conteúdo para canais", date: item.createdAt, content: Object.entries(item.channels || {}).map(([key, value]) => `${key}: ${value}`).join("\n\n") }));
  const titles = read(TITLE_HISTORY_KEY).map(item => ({ kind: "Gerador de Títulos", title: item.topic || "Títulos gerados", date: item.createdAt, content: (item.titles || []).join("\n\n") }));
  return [...text, ...channels, ...titles].sort((a, b) => String(b.date || "").localeCompare(String(a.date || ""))).slice(0, 20);
}

function collectFavorites() {
  const text = read(TEXT_FAVORITES_KEY).map(item => ({ kind: "Gerador de Textos", title: item.topic || item.title || "Texto favorito", date: item.createdAt || item.date, content: item.text || item.content || item.generatedText || "" }));
  const channels = read(CHANNEL_FAVORITES_KEY).map(item => ({ kind: `Favorito · ${item.channel || "Canal"}`, title: item.topic || "Conteúdo favorito", date: item.createdAt, content: item.text || "" }));
  const titles = read(TITLE_FAVORITES_KEY).map(item => ({ kind: "Gerador de Títulos", title: item.title || "Título favorito", date: item.createdAt, content: item.title || "" }));
  return [...text, ...channels, ...titles].sort((a, b) => String(b.date || "").localeCompare(String(a.date || ""))).slice(0, 20);
}

function storageStatus() {
  return { textHistory: read(TEXT_HISTORY_KEY).length, textFavorites: read(TEXT_FAVORITES_KEY).length, channelHistory: read(CHANNEL_HISTORY_KEY).length, channelFavorites: read(CHANNEL_FAVORITES_KEY).length, titleHistory: read(TITLE_HISTORY_KEY).length, titleFavorites: read(TITLE_FAVORITES_KEY).length };
}

function renderFileProtocolNotice() {
  content.innerHTML = `<div class="result-card"><h3>Abra o Regeneratus por um servidor local</h3><p>O painel precisa que as páginas compartilhem a mesma origem para enxergar o histórico e os favoritos.</p><p class="edit-hint">Você está abrindo esta página diretamente como arquivo (<strong>file://</strong>). Nesse modo, o navegador pode separar o armazenamento de cada página.</p><div class="history-item"><p><strong>No terminal, dentro da pasta do projeto, execute:</strong></p><p><code>python3 -m http.server 5500</code></p><p>Depois abra <strong>http://localhost:5500/</strong> e use o Regeneratus por esse endereço. A partir daí, todas as ferramentas e Minhas Criações compartilharão o mesmo armazenamento.</p></div></div>`;
}

function render(items, emptyMessage) {
  if (location.protocol === "file:") { renderFileProtocolNotice(); return; }
  if (!items.length) {
    const counts = storageStatus();
    const hasAny = Object.values(counts).some(Number);
    const detail = hasAny ? "Há dados salvos neste navegador, mas nenhum item corresponde à aba selecionada." : "Não encontramos dados salvos neste endereço. Se você criou os conteúdos em outro endereço, como localhost e Vercel, o navegador mantém armazenamentos separados.";
    content.innerHTML = `<div class="result-card"><h3>Nada por aqui ainda</h3><p>${emptyMessage}</p><p class="edit-hint">${detail}</p><button type="button" id="refreshCreations" class="button secondary-button">Atualizar painel</button></div>`;
    document.getElementById("refreshCreations").addEventListener("click", () => renderTab(document.querySelector(".creation-tab.active")?.dataset.tab || "recentes"));
    return;
  }
  content.innerHTML = `<div class="creation-summary"><strong>${items.length}</strong><span>criação(ões) encontrada(s)</span></div><div class="creations-list">${items.map(item => `<article class="creation-item"><div class="creation-item-header"><span class="creation-kind">${escapeHtml(item.kind)}</span><small>${escapeHtml(formatDate(item.date))}</small></div><h3>${escapeHtml(item.title)}</h3><p class="creation-preview">${escapeHtml(item.content).replace(/\n/g, "<br>")}</p><div class="creation-actions"><button type="button" class="button secondary-button copy-creation">Copiar</button></div></article>`).join("")}</div>`;
  content.querySelectorAll(".copy-creation").forEach((button, index) => button.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(items[index].content); button.textContent = "Copiado!"; setTimeout(() => button.textContent = "Copiar", 1500); } catch (error) { alert("Não foi possível copiar o conteúdo."); }
  }));
}

function renderTab(tab) { render(tab === "favoritos" ? collectFavorites() : collectRecent(), tab === "favoritos" ? "Quando você favoritar um conteúdo, ele aparecerá aqui." : "Gere algum conteúdo no Regeneratus para começar seu painel."); }
tabs.forEach(tab => tab.addEventListener("click", () => { tabs.forEach(item => item.classList.remove("active")); tab.classList.add("active"); renderTab(tab.dataset.tab); }));
window.addEventListener("storage", () => renderTab(document.querySelector(".creation-tab.active")?.dataset.tab || "recentes"));
renderTab("recentes");
