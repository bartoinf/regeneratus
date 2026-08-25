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

function cleanTopic(value) {
  return value.replace(/\s+/g, " ").replace(/[.!?]+$/, "").trim();
}

function buildTitle(topic, type, tone, objective, variant) {
  const t = cleanTopic(topic);
  const starts = {
    anuncio: ["Descubra", "Transforme", "Dê um novo impulso a", "A solução para", "Conheça"],
    post: ["Você já imaginou", "Uma ideia para", "Vale a pena conhecer", "O que muda quando você investe em", "Descubra novas possibilidades para"],
    produto: ["Conheça", "Tenha mais resultados com", "Uma solução pensada para", "Transforme sua experiência com", "Seu próximo passo pode ser"],
    pagina: ["Descubra como", "Uma solução criada para", "Tudo o que você precisa para", "Transforme sua estratégia com", "Encontre uma forma mais simples de"],
    artigo: ["Como", "Por que", "O que você precisa saber sobre", "Guia prático:", "5 ideias para aproveitar melhor"]
  }[type] || ["Descubra", "Transforme", "Conheça", "Uma nova forma de", "Tudo sobre"];

  const endings = {
    "atrair atenção": ["que pode fazer a diferença", "que merece sua atenção", "para alcançar novos resultados"],
    "gerar cliques": ["e veja como funciona", "que pode mudar sua estratégia", "em poucos passos"],
    "vender": ["e aproveite a oportunidade", "para conquistar mais clientes", "com mais valor para o cliente"],
    "gerar engajamento": ["— qual dessas ideias combina com você?", "e compartilhe sua opinião", "para conversar com seu público"],
    "informar": ["— entenda de forma simples", "com os principais pontos explicados", "e veja o que realmente importa"]
  }[objective] || ["para gerar resultados"];

  if (variant === 0) return `${starts[0]} ${t} ${endings[0]}`;
  if (variant === 1) return `${starts[1]} ${t}${tone === "criativo" ? " de um jeito diferente" : tone === "direto" ? " sem complicação" : " com uma abordagem mais estratégica"}`;
  if (variant === 2) return `${starts[2]} ${t} ${endings[1]}`;
  if (variant === 3) return `${starts[3]} ${t} ${endings[2]}`;
  if (tone === "curioso") return `O que você ainda não sabe sobre ${t}?`;
  if (tone === "criativo") return `${starts[4]} ${t} — uma nova perspectiva para gerar resultados`;
  if (tone === "profissional") return `${starts[4]} ${t}: estratégia para gerar resultados`;
  return `${starts[4]} ${t} com mais clareza e resultados`;
}

function generateDemoTitles(topic, type, tone, objective) {
  return Array.from({ length: 5 }, (_, index) => buildTitle(topic, type, tone, objective, index));
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
  const metadata = { topic: cleanTopic(topic), type: titleType.value, tone: titleTone.value, objective: titleObjective.value };
  const titles = generateDemoTitles(metadata.topic, metadata.type, metadata.tone, metadata.objective);
  saveHistory(metadata.topic, metadata.type, metadata.tone, metadata.objective, titles);
  titleResult.innerHTML = `<div class="result-card"><h3>Opções de títulos</h3><p class="edit-hint">Escolha, edite, copie ou favorite a opção que fizer mais sentido.</p><div class="title-options">${titles.map((text, index) => `<div class="title-option"><textarea class="title-edit" rows="2" aria-label="Título ${index + 1}">${escapeHtml(text)}</textarea><div class="result-actions"><button type="button" class="button copy-title">Copiar</button><button type="button" class="button secondary-button favorite-title">${isFavorite(text) ? "Favoritado!" : "Favoritar"}</button></div></div>`).join("")}</div></div>`;
  document.querySelectorAll(".copy-title").forEach(button => button.addEventListener("click", async function () {
    const textarea = this.closest(".title-option").querySelector(".title-edit");
    try { await navigator.clipboard.writeText(textarea.value); this.textContent = "Copiado!"; setTimeout(() => this.textContent = "Copiar", 1500); } catch (error) { alert("Não foi possível copiar o título."); }
  }));
  document.querySelectorAll(".favorite-title").forEach(button => button.addEventListener("click", function () {
    const textarea = this.closest(".title-option").querySelector(".title-edit");
    toggleFavorite(textarea.value, metadata, this);
  }));
  generateTitles.disabled = false;
  generateTitles.textContent = "Gerar títulos";
});
