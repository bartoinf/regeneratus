/* Regeneratus — motor compartilhado de geração.
 * Modo atual: IA por padrão; o modo local continua disponível como fallback manual.
 */
(function (global) {
  const channelNames = { instagram: "Instagram", facebook: "Facebook", linkedin: "LinkedIn", x: "X/Twitter", tiktok: "TikTok", whatsapp: "WhatsApp" };
  const AI_MODE_KEY = "regeneratus_ai_mode";

  function cleanTopic(value) { return String(value || "").trim().replace(/\s+/g, " ").replace(/[.!?]+$/g, ""); }
  function localText({ type, tone, length, topic }) {
    const subject = cleanTopic(topic);
    const intros = { produto: `Conheça ${subject}, uma solução pensada para facilitar sua rotina e entregar mais valor.`, anuncio: `${subject} pode ser o próximo passo para melhorar seus resultados.`, social: `Uma ideia simples pode abrir novas possibilidades: ${subject}.`, email: `Olá! Quero apresentar uma oportunidade relacionada a ${subject}.` };
    const toneText = { profissional: "A proposta é comunicar o benefício com clareza, credibilidade e foco em resultados.", amigavel: "A ideia é tornar essa experiência mais simples, próxima e fácil de entender.", persuasivo: "O objetivo é mostrar o valor da solução e incentivar uma decisão com confiança.", criativo: "A comunicação busca uma abordagem original, leve e memorável." }[tone] || "A comunicação foi pensada para ser clara e adequada ao público.";
    const extra = length === "longo" ? `\n\nMais do que apresentar uma ideia, o conteúdo deve destacar benefícios concretos, reduzir dúvidas e mostrar por que ${subject} pode fazer diferença.` : length === "curto" ? "" : `\n\nA mensagem combina benefício, clareza e uma chamada natural para conhecer melhor a proposta.`;
    return `✨ ${intros[type] || `Uma nova possibilidade para ${subject}.`} ${toneText}${extra}`;
  }
  function localTitle({ topic, type, tone, objective }) {
    const subject = cleanTopic(topic);
    const starts = { anuncio: ["Descubra", "Transforme", "Dê um novo impulso a", "Encontre uma forma mais inteligente de", "Conheça"], post: ["Você já conhece", "Uma ideia que merece atenção:", "Por que vale a pena conhecer", "Descubra uma nova possibilidade com", "O que muda quando você conhece"], produto: ["Conheça", "Tenha mais resultado com", "A solução para", "Seu próximo passo começa com", "Descubra o valor de"], pagina: ["Transforme sua ideia com", "Tudo o que você precisa para", "Uma solução criada para", "Descubra uma forma mais simples de", "Leve sua estratégia para o próximo nível com"], artigo: ["Como", "Por que", "O que você precisa saber sobre", "Guia prático para entender", "Descubra como"] }[type] || ["Descubra", "Conheça", "Explore", "Transforme", "Entenda"];
    const endings = { vender: ["e aproveite a oportunidade", "para conquistar mais clientes", "com mais valor para o cliente", "e transforme interesse em resultado", "para gerar mais vendas"], "gerar cliques": ["e veja como funciona", "em poucos passos", "com uma abordagem mais clara", "e descubra os detalhes", "sem complicação"], "gerar engajamento": ["e conte o que você acha", "para abrir uma conversa", "que merece a sua atenção", "e compartilhe sua opinião", "para gerar novas ideias"], informar: ["com clareza e contexto", "de forma simples e prática", "sem complicação", "com os pontos mais importantes", "para entender melhor"] }[objective] || ["com mais clareza", "de forma simples", "para gerar resultados", "com uma abordagem estratégica", "sem complicação"];
    const toneLead = tone === "criativo" ? "Uma ideia diferente:" : tone === "curioso" ? "O que você ainda não percebeu sobre" : tone === "direto" ? "Resultados com" : "";
    return [`${starts[0]} ${subject} ${endings[0]}`, `${starts[1]} ${subject} ${endings[1]}`, `${starts[2]} ${subject} ${endings[2]}`, `${starts[3]} ${subject} ${endings[3]}`, toneLead ? `${toneLead} ${subject} ${endings[4]}` : `${starts[4]} ${subject} ${endings[4]}`].map(cleanTopic);
  }
  function localChannel({ channel, objective, tone, topic }) {
    const subject = cleanTopic(topic); const name = channelNames[channel] || channel;
    const byChannel = { instagram: `Legenda para Instagram: ${subject}. Destaque o principal benefício de forma visual, ${tone}, e convide o público a conhecer mais. Objetivo: ${objective}. ✨`, facebook: `Post para Facebook: ${subject}. Apresente a proposta de maneira ${tone}, aproximando a marca do público e reforçando o objetivo de ${objective}.`, linkedin: `Post para LinkedIn: ${subject}. Uma abordagem ${tone}, orientada a resultados e relevante para profissionais, com foco em ${objective}.`, x: `Post para X/Twitter: ${subject}. Uma mensagem ${tone}, direta e fácil de compartilhar, com foco em ${objective}.`, tiktok: `Ideia para TikTok: mostre ${subject} em um vídeo curto, ${tone} e dinâmico, começando pelo benefício principal e terminando com um convite à ação. Objetivo: ${objective}.`, whatsapp: `Mensagem para WhatsApp: Olá! Quero compartilhar uma novidade sobre ${subject}. A proposta é apresentar o benefício de forma ${tone} e convidar você a conhecer melhor. Objetivo: ${objective}.` };
    return byChannel[channel] || `Conteúdo para ${name}: ${subject}. Comunicação ${tone}, com foco em ${objective}.`;
  }
  function aiEnabled() { return localStorage.getItem(AI_MODE_KEY) !== "disabled"; }
  async function aiGenerate(request) {
    const response = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(request) });
    let data = null; try { data = await response.json(); } catch (_) {}
    if (!response.ok) throw new Error(data?.error || `Servidor retornou ${response.status}.`);
    return data.text || data.result;
  }
  async function generate(request) {
    if (aiEnabled() && request.kind === "text") return aiGenerate(request);
    if (request.kind === "titles") return localTitle(request);
    if (request.kind === "text") return localText(request);
    if (request.kind === "channel") return localChannel(request);
    if (request.kind === "channels") { const channels = request.channels || Object.keys(channelNames); return Object.fromEntries(channels.map(channel => [channel, localChannel({ ...request, channel })])); }
    throw new Error("Tipo de geração não reconhecido.");
  }
  global.RegeneratusGenerator = { generate, localText, localTitle, localChannel, channelNames, aiEnabled };
})(window);
