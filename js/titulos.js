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

function generateDemoTitles(topic, type, tone, objective) {
  const prefix = {
    anuncio: ["Descubra", "Chegou a hora de", "Uma nova forma de", "Transforme seu resultado com"],
    post: ["Você já conhece", "Atenção para esta ideia:", "Por que todo negócio deveria conhecer", "Uma novidade que pode mudar"],
    produto: ["Conheça", "Mais resultado com", "A solução para", "Seu próximo passo começa com"],
    pagina: ["Transforme sua ideia em resultado com", "Tudo o que você precisa para", "Uma solução criada para", "Descubra uma forma mais simples de"],
    artigo: ["Como", "Por que", "O que você precisa saber sobre", "Guia prático para"]
  }[type];
  const suffix = objective === "vender" ? " — aproveite esta oportunidade" : objective === "gerar cliques" ? " — veja como funciona" : objective === "gerar engajamento" ? " — o que você acha?" : objective === "informar" ? " — entenda como funciona" : " — descubra agora";
  const fifth = tone === "criativo" ? `Uma ideia diferente para transformar ${topic} em resultado` : tone === "direto" ? `${topic}: resultados sem complicação` : tone === "curioso" ? `O que ninguém te contou sobre ${topic}?` : `Como ${topic} pode gerar resultados`;
  return [`${prefix[0]} ${topic}${suffix}`, `${prefix[1]} ${topic}`, `${prefix[2]} ${topic} sem complicação`, `${prefix[3]} ${topic}`, fifth];
}

function saveHistory(topic, type, tone, objective, titles) {
  const history = read(TITLE_HISTORY_KEY);
  history.unshift({ id: Date.now(), topic, type, tone, objective, titles, createdAt: new Date().toLocaleString("pt-BR") });
  write(TITLE_HISTORY_KEY, history.slice(0, 50));
}

function isFavorite(title) { return read(TITLE_FAVORITES_KEY).some(item => item.title === title); }
function toggleFavorite(title, metadata, button) {
  const favorites = read(TITLE_FAVORITES_KEY);
  const index = favorites.findIndex(item => item.title === title);
  if (index >= 0) { favorites.splice(index, 1); button.textContent = "Favoritar"; }
  else { favorites.unshift({ id: Date.now(), title, ...metadata, createdAt: new Date().toLocaleString("pt-BR") }); button.textContent = "Favoritado!"; }
  write(TITLE_FAVORITES_KEY, favorites.slice(0, 50));
}

generateTitles.addEventListener("click", async () => {
  const topic = titleTopic.value.trim();
  if (!topic) { titleResult.innerHTML = `<div class="result-card"><h3>Informe o tema</h3><p>Digite o tema, produto, oferta ou assunto para gerar os títulos.</p></div>`; return; }
  generateTitles.disabled = true;
  generateTitles.textContent = "Gerando...";
  titleResult.innerHTML = `<div class="result-card"><h3>Gerando títulos...</h3><p>Preparando opções para sua demonstração.</p></div>`;
  await new Promise(resolve => setTimeout(resolve, 400));
  const metadata = { topic, type: titleType.value, tone: titleTone.value, objective: titleObjective.value };
  const titles = generateDemoTitles(topic, metadata.type, metadata.tone, metadata.objective);
  saveHistory(topic, metadata.type, metadata.tone, metadata.objective, titles);
  titleResult.innerHTML = `<div class="result-card"><h3>Opções de títulos</h3><p class="edit-hint">Escolha, edite, copie ou favorite a opção que fizer mais sentido.</p><div class="title-options">${titles.map((text, index) => `<div class="title-option"><textarea class="title-edit" rows="2" aria-label="Título ${index + 1}">${escapeHtml(text)}</textarea><div class="result-actions"><button type="button" class="button copy-title" data-index="${index}">Copiar</button><button type="button" class="button secondary-button favorite-title" data-index="${index}">${isFavorite(text) ? "Favoritado!" : "Favoritar"}</button></div></div>`).join("")}</div></div>`;
  document.querySelectorAll(".copy-title").forEach(button => button.addEventListener("click", async function () {
    const textarea = this.closest(".title-option").querySelector(".title-edit");
    try { await navigator.clipboard.writeText(textarea.value); this.textContent = "Copiado!"; setTimeout(() => this.textContent = "Copiar", 1500); } catch (error) { alert("Não foi possível copiar o título."); }
  }));
  document.querySelectorAll(".favorite-title").forEach(button => button.addEventListener("click", function () {
    const textarea = this.closest(".title-option").querySelector(".title-edit");
    toggleFavorite(textarea.value, metadata, this);
    window.dispatchEvent(new StorageEvent("storage", { key: TITLE_FAVORITES_KEY }));
  }));
  generateTitles.disabled = false;
  generateTitles.textContent = "Gerar títulos";
});
