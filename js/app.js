const generateButton = document.getElementById("generateButton");
const textType = document.getElementById("textType");
const textTone = document.getElementById("textTone");
const textLength = document.getElementById("textLength");
const textTopic = document.getElementById("textTopic");
const result = document.getElementById("result");

const HISTORY_KEY = "regeneratus_text_history";
let lastGeneratedText = "";

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveToHistory(text) {
  const history = getHistory();
  history.unshift({
    text,
    topic: textTopic.value.trim(),
    type: textType.value,
    createdAt: new Date().toLocaleString("pt-BR")
  });

  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 10)));
}

function showMessage(title, message) {
  result.innerHTML = `
    <div class="result-card">
      <h3>${title}</h3>
      <p>${message}</p>
    </div>
  `;
}

function showGeneratedText(text) {
  lastGeneratedText = text;
  saveToHistory(text);

  result.innerHTML = `
    <div class="result-card">
      <h3>Texto gerado</h3>
      <div class="generated-text">${text}</div>
      <div class="result-actions">
        <button type="button" id="copyButton" class="button secondary-button">Copiar texto</button>
        <button type="button" id="newTextButton" class="button">Novo texto</button>
      </div>
    </div>
  `;

  document.getElementById("copyButton").addEventListener("click", async function () {
    try {
      await navigator.clipboard.writeText(lastGeneratedText);
      this.textContent = "Texto copiado!";
      setTimeout(() => {
        this.textContent = "Copiar texto";
      }, 1800);
    } catch (error) {
      showMessage("Não foi possível copiar", "Selecione o texto manualmente e copie para a área de transferência.");
    }
  });

  document.getElementById("newTextButton").addEventListener("click", function () {
    textTopic.focus();
    textTopic.select();
  });

  renderHistory();
}

function renderHistory() {
  const history = getHistory();
  let historyContainer = document.getElementById("history");

  if (!historyContainer) {
    historyContainer = document.createElement("section");
    historyContainer.id = "history";
    historyContainer.className = "history";
    result.parentNode.appendChild(historyContainer);
  }

  if (!history.length) {
    historyContainer.innerHTML = "";
    return;
  }

  historyContainer.innerHTML = `
    <div class="history-header">
      <div>
        <h3>Histórico</h3>
        <p>Seus últimos textos ficam salvos neste navegador.</p>
      </div>
      <button type="button" id="clearHistoryButton" class="history-clear">Limpar histórico</button>
    </div>
    <div class="history-list">
      ${history.map((item, index) => `
        <article class="history-item">
          <div class="history-item-info">
            <strong>${item.topic}</strong>
            <small>${item.createdAt}</small>
          </div>
          <p>${item.text}</p>
          <div class="history-actions">
            <button type="button" class="history-copy" data-index="${index}">Copiar</button>
            <button type="button" class="history-use" data-index="${index}">Usar novamente</button>
          </div>
        </article>
      `).join("")}
    </div>
  `;

  document.querySelectorAll(".history-copy").forEach(button => {
    button.addEventListener("click", async function () {
      const item = getHistory()[Number(this.dataset.index)];
      if (!item) return;

      try {
        await navigator.clipboard.writeText(item.text);
        this.textContent = "Copiado!";
        setTimeout(() => {
          this.textContent = "Copiar";
        }, 1500);
      } catch (error) {
        alert("Não foi possível copiar o texto.");
      }
    });
  });

  document.querySelectorAll(".history-use").forEach(button => {
    button.addEventListener("click", function () {
      const item = getHistory()[Number(this.dataset.index)];
      if (!item) return;
      textTopic.value = item.topic;
      textTopic.focus();
      textTopic.select();
    });
  });

  document.getElementById("clearHistoryButton").addEventListener("click", function () {
    if (confirm("Deseja realmente apagar todo o histórico?")) {
      localStorage.removeItem(HISTORY_KEY);
      renderHistory();
    }
  });
}

function generateDemoText(type, tone, length, topic) {
  return `✨ Exemplo de texto do Regeneratus sobre ${topic}. Uma solução pensada para transformar ideias em resultados, com uma comunicação ${tone} e adequada ao formato ${type}. Este é um texto de demonstração para testarmos a experiência da ferramenta enquanto a geração por IA permanece desativada. Tamanho selecionado: ${length}.`;
}

generateButton.addEventListener("click", async function () {
  const type = textType.value;
  const tone = textTone.value;
  const length = textLength.value;
  const topic = textTopic.value.trim();

  if (!type || !tone || !length || !topic) {
    showMessage(
      "Preencha os campos",
      "Escolha o tipo, o tom, o tamanho e informe sobre o que você deseja escrever."
    );
    return;
  }

  generateButton.disabled = true;
  generateButton.textContent = "Gerando...";

  showMessage(
    "Gerando seu texto...",
    "O Regeneratus está preparando sua solicitação."
  );

  try {
    // Modo local de demonstração: não chama a API nem gera custos.
    // Para a geração real, basta trocar DEMO_MODE para false.
    const DEMO_MODE = true;

    if (DEMO_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));
      showGeneratedText(generateDemoText(type, tone, length, topic));
      return;
    }

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ type, tone, length, topic })
    });

    const rawBody = await response.text();
    let data;

    try {
      data = JSON.parse(rawBody);
    } catch (parseError) {
      throw new Error(`O servidor retornou uma resposta inesperada (${response.status}).`);
    }

    if (!response.ok) {
      throw new Error(data.error || "Não foi possível gerar o texto.");
    }

    showGeneratedText(data.text);
  } catch (error) {
    showMessage("Não foi possível gerar o texto", error.message);
  } finally {
    generateButton.disabled = false;
    generateButton.textContent = "Gerar texto";
  }
});

renderHistory();
