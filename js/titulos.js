const titleType = document.getElementById("titleType");
const titleTone = document.getElementById("titleTone");
const titleObjective = document.getElementById("titleObjective");
const titleTopic = document.getElementById("titleTopic");
const generateTitles = document.getElementById("generateTitles");
const titleResult = document.getElementById("titleResult");

function escapeHtml(value) { const div = document.createElement("div"); div.textContent = value; return div.innerHTML; }

function generateDemoTitles(topic, type, tone, objective) {
  const prefix = {
    anuncio: ["Descubra", "Chegou a hora de", "Uma nova forma de", "Transforme seu resultado com"],
    post: ["Você já conhece", "Atenção para esta ideia:", "Por que todo negócio deveria conhecer", "Uma novidade que pode mudar"],
    produto: ["Conheça", "Mais resultado com", "A solução para", "Seu próximo passo começa com"],
    pagina: ["Transforme sua ideia em resultado", "Tudo o que você precisa para", "Uma solução criada para", "Descubra uma forma mais simples de"],
    artigo: ["Como", "Por que", "O que você precisa saber sobre", "Guia prático para"]
  }[type];
  const suffix = objective === "vender" ? " — aproveite esta oportunidade" : objective === "gerar cliques" ? " — veja como funciona" : objective === "gerar engajamento" ? " — o que você acha?" : objective === "informar" ? " — entenda como funciona" : " — descubra agora";
  return [
    `${prefix[0]} ${topic}${suffix}`,
    `${prefix[1]} ${topic}`,
    `${prefix[2]} ${topic} sem complicação`,
    `${prefix[3]} ${topic}`,
    `${topic}: uma ideia ${tone} para gerar resultados`
  ];
}

generateTitles.addEventListener("click", async () => {
  const topic = titleTopic.value.trim();
  if (!topic) { titleResult.innerHTML = `<div class="result-card"><h3>Informe o tema</h3><p>Digite o tema, produto, oferta ou assunto para gerar os títulos.</p></div>`; return; }
  generateTitles.disabled = true;
  generateTitles.textContent = "Gerando...";
  titleResult.innerHTML = `<div class="result-card"><h3>Gerando títulos...</h3><p>Preparando opções para sua demonstração.</p></div>`;
  await new Promise(resolve => setTimeout(resolve, 400));
  const titles = generateDemoTitles(topic, titleType.value, titleTone.value, titleObjective.value);
  titleResult.innerHTML = `<div class="result-card"><h3>Opções de títulos</h3><p class="edit-hint">Escolha, edite ou copie a opção que fizer mais sentido.</p><div class="title-options">${titles.map((text, index) => `<div class="title-option"><textarea class="title-edit" rows="2" aria-label="Título ${index + 1}">${escapeHtml(text)}</textarea><div class="result-actions"><button type="button" class="button copy-title" data-index="${index}">Copiar</button></div></div>`).join("")}</div></div>`;
  document.querySelectorAll(".copy-title").forEach(button => button.addEventListener("click", async function () {
    const textarea = this.closest(".title-option").querySelector(".title-edit");
    try { await navigator.clipboard.writeText(textarea.value); this.textContent = "Copiado!"; setTimeout(() => this.textContent = "Copiar", 1500); } catch (error) { alert("Não foi possível copiar o título."); }
  }));
  generateTitles.disabled = false;
  generateTitles.textContent = "Gerar títulos";
});
