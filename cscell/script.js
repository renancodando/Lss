/* =========================================================
   CScell — configuração da loja
   Edite apenas este bloco para personalizar o site.
   ========================================================= */
const CONFIG = {
  nome: "CScell",
  whatsapp: "5500000000000",          // DDI + DDD + número, só dígitos
  telefone: "(00) 00000-0000",        // como aparece no site
  instagram: "cscell",                // sem o @
  endereco: "Rua Exemplo, 123, Centro",
  cidade: "Sua cidade, UF",
  horario: ["Segunda a sexta, 9h às 18h", "Sábado, 9h às 13h"],
  garantiaDias: 90,
};

const BRANDS = ["Apple", "Samsung", "Motorola", "Xiaomi", "Realme", "Outra marca"];

/* Serviços: alimentam o seletor do topo e a lista de serviços.
   fast = sai no mesmo dia (marcado em âmbar na lista). */
const SERVICES = [
  {
    id: "tela",
    chip: "Tela quebrada",
    name: "Troca de tela",
    summary: "Vidro trincado, manchas, toque falhando ou tela apagada.",
    time: "Mesmo dia",
    fast: true,
    includes: ["Display completo com touch", "Teste de toque, brilho e cores", "Película de vidro aplicada na entrega"],
  },
  {
    id: "bateria",
    chip: "Bateria",
    name: "Troca de bateria",
    summary: "Descarrega rápido, desliga sozinho ou está estufada.",
    time: "Mesmo dia",
    fast: true,
    includes: ["Teste de saúde e consumo antes da troca", "Bateria nova com vedação refeita", "Calibração e teste de carga"],
  },
  {
    id: "conector",
    chip: "Não carrega",
    name: "Conector de carga",
    summary: "Carrega só em uma posição, mau contato ou não reconhece o cabo.",
    time: "Mesmo dia",
    fast: true,
    includes: ["Limpeza técnica do conector", "Troca do conector ou da placa de carga, se necessário", "Teste de carga rápida e de dados"],
  },
  {
    id: "naoliga",
    chip: "Não liga",
    name: "Não liga ou reinicia",
    summary: "Aparelho morto, preso no logo ou reiniciando sem parar.",
    time: "2 a 5 dias úteis",
    fast: false,
    includes: ["Análise de consumo da placa", "Microssoldagem de componentes", "Teste completo de todas as funções"],
  },
  {
    id: "liquido",
    chip: "Molhou",
    name: "Contato com líquido",
    summary: "Caiu na água, molhou na chuva ou entrou bebida.",
    time: "1 a 3 dias úteis",
    fast: false,
    includes: ["Abertura e limpeza química da placa", "Avaliação dos componentes atingidos", "Orçamento das peças que precisarem de troca"],
  },
  {
    id: "camera",
    chip: "Câmera",
    name: "Câmera e lentes",
    summary: "Imagem embaçada, sem foco, tela preta na câmera ou lente quebrada.",
    time: "Mesmo dia",
    fast: true,
    includes: ["Troca do módulo ou só da lente de vidro", "Teste de foco, flash e estabilização", "Teste em foto e vídeo"],
  },
  {
    id: "audio",
    chip: "Som ou microfone",
    name: "Som, microfone e alto-falante",
    summary: "Ninguém te ouve nas ligações, som baixo ou chiando.",
    time: "Mesmo dia",
    fast: true,
    includes: ["Limpeza das telas de proteção", "Troca de alto-falante, auricular ou microfone", "Teste em ligação e áudio do WhatsApp"],
  },
  {
    id: "sistema",
    chip: "Sistema lento",
    name: "Sistema e dados",
    summary: "Travando, sem espaço, com vírus ou precisando passar dados para o celular novo.",
    time: "Mesmo dia",
    fast: true,
    includes: ["Atualização e restauração do sistema", "Backup e transferência de fotos e contatos", "Configuração de contas e aplicativos"],
  },
];

/* ========================================================= */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const waLink = (text) =>
  `https://wa.me/${CONFIG.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

/* ---------- Preenche dados da loja ---------- */
function applyConfig() {
  $$("[data-cfg]").forEach((el) => {
    const key = el.dataset.cfg;
    if (key === "instagram") el.textContent = `@${CONFIG.instagram}`;
    else if (CONFIG[key] !== undefined) el.textContent = CONFIG[key];
  });
  $$("[data-cfg-list]").forEach((el) => {
    const list = CONFIG[el.dataset.cfgList];
    if (Array.isArray(list)) {
      el.replaceChildren(...list.flatMap((line, i) => (i ? [document.createElement("br"), line] : [line])));
    }
  });
  const hello = `Olá, ${CONFIG.nome}! Gostaria de um orçamento.`;
  $$("[data-wa]").forEach((a) => {
    a.href = waLink(hello);
    a.target = "_blank";
    a.rel = "noopener";
  });
  $$("[data-ig]").forEach((a) => (a.href = `https://instagram.com/${CONFIG.instagram}`));
  $("#year").textContent = new Date().getFullYear();
}

/* ---------- Menu mobile ---------- */
function setupMenu() {
  const toggle = $(".menu-toggle");
  const menu = $("#menu");
  const close = () => {
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
  };
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
  });
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

/* ---------- Pré-ordem de serviço ---------- */
const order = { brand: "", issue: "", model: "", name: "" };
const protocol = `CS-${String(Math.floor(10000 + Math.random() * 89999))}`;

function chip(group, value, label) {
  const wrap = document.createElement("label");
  wrap.className = "chip";
  const input = document.createElement("input");
  input.type = "radio";
  input.name = group;
  input.value = value;
  const span = document.createElement("span");
  span.textContent = label;
  wrap.append(input, span);
  return wrap;
}

function buildPicker() {
  $("#brand-chips").append(...BRANDS.map((b) => chip("brand", b, b)));
  $("#issue-chips").append(...SERVICES.map((s) => chip("issue", s.id, s.chip)));

  $("#orcamento").addEventListener("change", (e) => {
    const { name, value } = e.target;
    if (name === "brand" || name === "issue") {
      order[name] = value;
      renderTicket(name === "brand" ? ["device"] : ["issue", "time"]);
    }
  });
  $("#model").addEventListener("input", (e) => {
    order.model = e.target.value.trim();
    renderTicket(["device"]);
  });
  $("#name").addEventListener("input", (e) => {
    order.name = e.target.value.trim();
    updateSendLink();
  });
  $("#orcamento").addEventListener("submit", (e) => e.preventDefault());
}

function setLine(id, value, placeholder) {
  const el = $(id);
  el.textContent = value || placeholder;
  el.classList.toggle("is-empty", !value);
}

function flash(lines) {
  if (reduceMotion) return;
  lines.forEach((key) => {
    const row = $(`[data-line="${key}"]`);
    row.classList.remove("is-fresh");
    void row.offsetWidth; // reinicia a animação
    row.classList.add("is-fresh");
  });
}

function renderTicket(changed = []) {
  const service = SERVICES.find((s) => s.id === order.issue);
  const device = [order.brand, order.model].filter(Boolean).join(" ");
  setLine("#t-device", device, "Escolha a marca");
  setLine("#t-issue", service && service.name, "Escolha o defeito");
  setLine("#t-time", service && service.time, "-");
  updateSendLink();
  flash(changed);
}

/* O envio é um link comum (e não window.open) para não ser barrado por bloqueadores de pop-up. */
function updateSendLink() {
  const link = $("#send-order");
  const service = SERVICES.find((s) => s.id === order.issue);
  const ready = Boolean(order.brand && service);
  link.setAttribute("aria-disabled", String(!ready));
  $("#t-status").textContent = ready ? "" : "Escolha a marca e o defeito para enviar.";
  if (!ready) {
    link.removeAttribute("href");
    return;
  }
  const device = [order.brand, order.model].filter(Boolean).join(" ");
  const lines = [
    `Olá, ${CONFIG.nome}!${order.name ? ` Sou ${order.name}.` : ""}`,
    `Pré-ordem ${protocol}`,
    `Aparelho: ${device}`,
    `Defeito: ${service.name}`,
    "Gostaria de um orçamento.",
  ];
  link.href = waLink(lines.join("\n"));
}

function buildBarcode() {
  const host = $("#t-barcode");
  // barras geradas a partir do número da OS: cada pré-ordem tem um código próprio
  let seed = Number(protocol.replace(/\D/g, ""));
  const next = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  const bars = Array.from({ length: 38 }, () => {
    const bar = document.createElement("i");
    bar.style.flex = `${1 + Math.floor(next() * 4)} 0 0`;
    bar.style.marginRight = `${1 + Math.floor(next() * 3)}px`;
    return bar;
  });
  host.append(...bars);
}

function setupTicket() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  $("#t-protocol").textContent = protocol;
  $("#t-date").textContent = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  buildBarcode();
  renderTicket();

  if (!reduceMotion) $("#ticket").classList.add("is-printing");

  $("#send-order").addEventListener("click", () => {
    if (order.brand && order.issue) {
      $("#t-status").textContent = `Pré-ordem ${protocol} aberta no WhatsApp. É só tocar em enviar.`;
    }
  });
}

/* ---------- Lista de serviços ---------- */
function buildServices() {
  const host = $("#service-list");
  SERVICES.forEach((s) => {
    const item = document.createElement("div");
    item.className = "service";
    item.setAttribute("role", "listitem");
    const detailId = `svc-${s.id}`;
    item.innerHTML = `
      <button class="service__row" type="button" aria-expanded="false" aria-controls="${detailId}">
        <span class="service__name"></span>
        <span class="service__summary"></span>
        <span class="service__time"${s.fast ? " data-fast" : ""}></span>
        <span class="service__plus" aria-hidden="true"></span>
      </button>
      <div class="service__detail" id="${detailId}" hidden>
        <div>
          <div class="service__body">
            <p class="service__summary-full"></p>
            <ul></ul>
            <button class="btn btn--ink service__quote" type="button">Orçar este reparo</button>
          </div>
        </div>
      </div>`;
    $(".service__name", item).textContent = s.name;
    $(".service__summary", item).textContent = s.summary;
    $(".service__time", item).textContent = s.time;
    $(".service__summary-full", item).textContent = s.summary;
    $("ul", item).append(
      ...s.includes.map((txt) => {
        const li = document.createElement("li");
        li.textContent = txt;
        return li;
      })
    );

    const row = $(".service__row", item);
    const detail = $(".service__detail", item);
    row.addEventListener("click", () => {
      const open = row.getAttribute("aria-expanded") !== "true";
      row.setAttribute("aria-expanded", String(open));
      if (open) {
        detail.hidden = false;
        requestAnimationFrame(() => detail.setAttribute("data-open", ""));
      } else {
        detail.removeAttribute("data-open");
        const hide = () => (detail.hidden = true);
        reduceMotion ? hide() : detail.addEventListener("transitionend", hide, { once: true });
      }
    });

    $(".service__quote", item).addEventListener("click", () => {
      const radio = $(`input[name="issue"][value="${s.id}"]`);
      radio.checked = true;
      order.issue = s.id;
      renderTicket(["issue", "time"]);
      $("#inicio").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      const firstBrand = $('input[name="brand"]:checked') || $('input[name="brand"]');
      setTimeout(() => firstBrand.focus({ preventScroll: true }), reduceMotion ? 0 : 500);
    });

    host.append(item);
  });
}

applyConfig();
setupMenu();
buildPicker();
setupTicket();
buildServices();
