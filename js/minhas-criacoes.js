const content = document.getElementById("creationsContent");
const tabs = document.querySelectorAll(".creation-tab");

const TEXT_HISTORY_KEY = "regeneratus_text_history";
const TEXT_FAVORITES_KEY = "regeneratus_text_favorites";
const CHANNEL_HISTORY_KEY = "regeneratus_channels_history";
const CHANNEL_FAVORITES_KEY = "regeneratus_channels_favorites";

function read(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; } catch (error) { return []; }
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = String(value ?? "");
  return div.innerHTML;
}

function formatDate(value) { return value || "Data não informada"; }

function collectRecent() {
  const text = read(TEXT_HISTORY_KEY).map(item => ({
    kind: "Gerador de Textos",
    title: item.topic || item.title || "Texto gerado",
    date: item.createdAt || item.date,
    content: item.text || item.content || item.generatedText || "",
    raw: item
  }));
  const channels = read(CHANNEL_HISTORY_KEY).map(item => ({
    kind: "Redes e Canais",
    title: item.topic || "Conteúdo para canais",
    date: item.createdAt,
    content: Object.entries(item.channels || {}).map(([key, value]) => `${key}: ${value}`).join("\n\n"),
    raw: item
  }));
  return [...text, ...channels].sort((a, b) => String(b.date || "").localeCompare(String(a.date || ""))).slice(0, 20);
}

function collectFavorites() {
  const text = read(TEXT_FAVORITES_KEY).map(item => ({
    kind: "Gerador de Textos",
    title: item.topic || item.title || "Texto favorito",
    date: item.createdAt || item.date,
    content: item.text || item.content || item.generatedText || "",
    raw: item
  }));
  const channels = read(CHANNEL_FAVORITES_KEY).map(item => ({
    kind: `Favorito · ${item.channel || "Canal"}`,
    title: item.topic || "Conteúdo favorito",
    date: item.createdAt,
    content: item.text || "",
    raw: item
  }));
  return [...text, ...channels].sort((a, b) => String(b.date || "").localeCompare(String(a.date || ""))).slice(0, 20);
}

function storageStatus() {
  const counts = {
    textHistory: read(TEXT_HISTORY_KEY).length,
    textFavorites: read(TEXT_FAVORITES_KEY).length,
    channelHistory: read(CHANNEL_HISTORY_KEY).length,
    channelFavorites: read(CHANNEL_FAVORITES_KEY).length
  };
  return counts;
}

function render(items, emptyMessage) {
  if (!items.length) {
    const counts = storageStatus();
    const hasAny = Object.values(counts).some(Number);
    const detail = hasAny
      ? "Há dados salvos neste navegador, mas nenhum item corresponde à aba selecionada."
      : "O painel está no mesmo navegador, mas não encontrou dados salvos neste endereço. Se você criou os conteúdos em outro endereço (por exemplo, localhost e Vercel), o navegador mantém armazenamentos separados.";
    content.innerHTML = `<div class="result-card"><h3>Nada por aqui ainda</h3><p>${emptyMessage}</p><p class="edit-hint">${detail}</p><button type="button" id="refreshCreations" class="button secondary-button">Atualizar painel</button></div>`;
    document.getElementById("refreshCreations").addEventListener("click", () => renderTab(document.querySelector(".creation-tab.active")?.dataset.tab || "recentes"));
    return;
  }

  content.innerHTML = `<div class="creation-summary"><strong>${items.length}</strong><span>criação(ões) encontrada(s)</span></div><div class="creations-list">${items.map((item, index) => `
    <article class="creation-item">
      <div class="creation-item-header"><span class="creation-kind">${escapeHtml(item.kind)}</span><small>${escapeHtml(formatDate(item.date))}</small></div>
      <h3>${escapeHtml(item.title)}</h3>
      <p class="creation-preview">${escapeHtml(item.content).replace(/\n/g, "<br>")}</p>
      <div class="creation-actions"><button type="button" class="button secondary-button copy-creation" data-index="${index}">Copiar</button></div>
    </article>`).join("")}</div>`;

  content.querySelectorAll(".copy-creation").forEach(button => button.addEventListener("click", async () => {
    const currentTab = document.querySelector(".creation-tab.active")?.dataset.tab || "recentes";
    const itemsNow = currentTab === "favoritos" ? collectFavorites() : collectRecent();
    const item = itemsNow[Number(button.dataset.index)];
    if (!item) return;
    try { await navigator.clipboard.writeText(item.content); button.textContent = "Copiado!"; setTimeout(() => button.textContent = "Copiar", 1500); }
    catch (error) { alert("Não foi possível copiar o conteúdo."); }
  }));
}

function renderTab(tab) {
  if (tab === "favoritos") render(collectFavorites(), "Quando você favoritar um conteúdo, ele aparecerá aqui.");
  else render(collectRecent(), "Gere algum conteúdo no Regeneratus para começar seu painel.");
}

tabs.forEach(tab => tab.addEventListener("click", () => {
  tabs.forEach(item => item.classList.remove("active"));
  tab.classList.add("active");
  renderTab(tab.dataset.tab);
}));

window.addEventListener("storage", () => renderTab(document.querySelector(".creation-tab.active")?.dataset.tab || "recentes"));

renderTab("recentes");
