/* Regeneratus — limite comercial do teste gratuito. */
(function () {
  const KEY = "regeneratus_free_uses";
  const LIMIT = 5;
  function used() { return Number(localStorage.getItem(KEY) || 0); }
  function updateButton() {
    const button = document.getElementById("generateButton");
    const counter = document.getElementById("freeCounter");
    const remaining = Math.max(0, LIMIT - used());
    if (counter) counter.textContent = `${remaining} gerações gratuitas restantes`;
    if (button && remaining === 0) button.textContent = "Continuar com o Pro";
  }
  document.addEventListener("click", function (event) {
    const button = event.target.closest("#generateButton");
    if (!button) return;
    if (used() >= LIMIT) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const result = document.getElementById("result");
      if (result) result.innerHTML = `<div class="result-card upgrade-card"><h3>Você aproveitou seu teste gratuito 🎉</h3><p>O Regeneratus Pro libera novas gerações e mantém suas ferramentas prontas para uso profissional.</p><a class="button" href="precos.html">Conhecer o Regeneratus Pro</a></div>`;
    }
  }, true);
  window.RegeneratusQuota = {
    consume() { const next = used() + 1; localStorage.setItem(KEY, String(next)); updateButton(); },
    used,
    limit: LIMIT,
    remaining() { return Math.max(0, LIMIT - used()); },
    update: updateButton
  };
  document.addEventListener("DOMContentLoaded", updateButton);
})();
