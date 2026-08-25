const titleType = document.getElementById("titleType");
const titleTone = document.getElementById("titleTone");
const titleObjective = document.getElementById("titleObjective");
const titleTopic = document.getElementById("titleTopic");
const generateTitles = document.getElementById("generateTitles");
const titleResult = document.getElementById("titleResult");
const TITLE_HISTORY_KEY = "regeneratus_titles_history";
const TITLE_FAVORITES_KEY = "regeneratus_titles_favorites";
function escapeHtml(value) { const div = document.createElement("div"); div.textContent = value; return div.innerHTML; }
function read(key) { try { return JSON.parse(localStorage.getItem(key)) || []; } catch (error) { return []; } }
function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function saveHistory(topic, type, tone, objective, titles) { const history = read(TITLE_HISTORY_KEY); history.unshift({ id: Date.now(), topic, type, tone, objective, titles, createdAt: new Date().toLocaleString("pt-BR") }); write(TITLE_HISTORY_KEY, history.slice(0, 50)); }
function isFavorite(title) { return read(TITLE_FAVORITES_KEY).some(item => item.title === title); }
function toggleFavorite(title, metadata, button) { const favorites = read(TITLE_FAVORITES_KEY); const index = favorites.findIndex(item => item.title === title); if (index >= 0) { favorites.splice(index, 1); button.textContent = "Favoritar"; } else { favorites.unshift({ id: Date.now(), title, ...metadata, createdAt: new Date().toLocaleString("pt-BR") }); button.textContent = "Favoritado!"; } write(TITLE_FAVORITES_KEY, favorites.slice(0, 50)); }

generateTitles.addEventListener("click", async () => {
  const topic = titleTopic.value.trim();
  if (!topic) { titleResult.innerHTML = `<div class="result-card"><h3>Informe o tema</h3><p>Digite o tema, produto, oferta ou assunto para gerar os títulos.</p></div>`; return; }
  generateTitles.disabled = true; generateTitles.textContent = "Gerando...";
  titleResult.innerHTML = `<div class="result-card"><h3>Gerando títulos...</h3><p>Preparando opções para sua demonstração.</p></div>`;
  try {
    const metadata = { topic, type: titleType.value, tone: titleTone.value, objective: titleObjective.value };
    const titles = await window.RegeneratusGenerator.generate({ kind: "titles", ...metadata });
    saveHistory(metadata.topic, metadata.type, metadata.tone, metadata.objective, titles);
    titleResult.innerHTML = `<div class="result-card"><h3>Opções de títulos</h3><p class="edit-hint">Escolha, edite, copie ou favorite a opção que fizer mais sentido.</p><div class="title-options">${titles.map((text, index) => `<div class="title-option"><textarea class="title-edit" rows="2" aria-label="Título ${index + 1}">${escapeHtml(text)}</textarea><div class="result-actions"><button type="button" class="button copy-title">Copiar</button><button type="button" class="button secondary-button favorite-title">${isFavorite(text) ? "Favoritado!" : "Favoritar"}</button></div></div>`).join("")}</div></div>`;
    document.querySelectorAll(".copy-title").forEach(button => button.addEventListener("click", async function () { const textarea = this.closest(".title-option").querySelector(".title-edit"); try { await navigator.clipboard.writeText(textarea.value); this.textContent = "Copiado!"; setTimeout(() => this.textContent = "Copiar", 1500); } catch (error) { alert("Não foi possível copiar o título."); } }));
    document.querySelectorAll(".favorite-title").forEach(button => button.addEventListener("click", function () { const textarea = this.closest(".title-option").querySelector(".title-edit"); toggleFavorite(textarea.value, metadata, this); }));
  } catch (error) { titleResult.innerHTML = `<div class="result-card"><h3>Não foi possível gerar os títulos</h3><p>${escapeHtml(error.message)}</p></div>`; }
  finally { generateTitles.disabled = false; generateTitles.textContent = "Gerar títulos"; }
});
