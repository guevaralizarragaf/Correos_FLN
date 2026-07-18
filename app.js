// ============================================================
// APP.JS — lógica del generador de correos Fortalecernos
// ============================================================

const GLOBAL_STORAGE_KEY = "fortalecernos_datos_empresa";

// Valores por defecto (se usan solo si aún no se ha guardado nada en el navegador)
const GLOBAL_DEFAULTS = {
  logo_url: "https://drive.google.com/uc?export=view&id=1487A2v79sQ0CuQvDgRmKdL6Xl0gWn5u_",
  link_notion: "",
};

// Campos que se llenan UNA VEZ y se reutilizan en todos los correos
const GLOBAL_FIELDS = [
  { key: "logo_url", label: "URL del logo", type: "url", placeholder: "https://..." },
  { key: "link_notion", label: "Link de la guía de Notion", type: "url", placeholder: "" },
  { key: "nombre_rrhh", label: "Nombre de RRHH", type: "text" },
  { key: "numero_whatsapp", label: "WhatsApp de RRHH", type: "text", placeholder: "+51 9xx xxx xxx" },
  { key: "correo_rrhh", label: "Correo de RRHH", type: "text", placeholder: "rrhh@fortalecernos.com" },
];

let currentTemplate = TEMPLATES[0];
let genero = "H"; // H = masculino, M = femenino

function loadGlobalData() {
  try {
    const raw = localStorage.getItem(GLOBAL_STORAGE_KEY);
    const saved = raw ? JSON.parse(raw) : {};
    return Object.assign({}, GLOBAL_DEFAULTS, saved);
  } catch (e) {
    return Object.assign({}, GLOBAL_DEFAULTS);
  }
}

function saveGlobalData(data) {
  localStorage.setItem(GLOBAL_STORAGE_KEY, JSON.stringify(data));
}

function renderTemplate(htmlString, data) {
  let out = htmlString;
  // 1) tokens de género {{g:masculino|femenino}}
  out = out.replace(/\{\{g:([^|{}]*)\|([^{}]*)\}\}/g, (_, masc, fem) => (genero === "M" ? fem : masc));
  // 2) tokens normales {{campo}}
  out = out.replace(/\{\{(\w+)\}\}/g, (m, key) => {
    const val = data[key];
    return (val !== undefined && val !== null && val !== "") ? val : `[${key}]`;
  });
  return out;
}

function buildSidebar() {
  const list = document.getElementById("template-list");
  list.innerHTML = "";
  TEMPLATES.forEach((t) => {
    const btn = document.createElement("button");
    btn.className = "template-btn" + (t.id === currentTemplate.id ? " active" : "");
    btn.innerHTML = `<strong>${t.name}</strong>${t.description}`;
    btn.onclick = () => {
      currentTemplate = t;
      buildSidebar();
      buildForm();
      updatePreview();
    };
    list.appendChild(btn);
  });
}

function fieldHTML(f, value) {
  const val = value !== undefined ? value : (f.default || "");
  return `
    <div class="field">
      <label for="f_${f.key}">${f.label}</label>
      <input id="f_${f.key}" data-key="${f.key}" type="${f.type === 'url' ? 'text' : f.type}" placeholder="${f.placeholder || ''}" value="${val.replace ? val.replace(/"/g, '&quot;') : val}">
    </div>`;
}

function buildForm() {
  const globalData = loadGlobalData();
  const container = document.getElementById("form-container");

  let html = "";

  // --- Datos de la persona (cambian en cada envío) ---
  html += `<p class="section-label">Datos de la persona</p>`;
  html += `
    <div class="field">
      <label for="f_nombre">Nombre</label>
      <input id="f_nombre" data-key="nombre" data-scope="person" type="text" placeholder="Ej. Francisco">
    </div>
    <div class="field">
      <label>Género (para personalizar el texto)</label>
      <div class="gender-toggle">
        <button type="button" id="btn-genero-h" class="active">Hombre</button>
        <button type="button" id="btn-genero-m">Mujer</button>
      </div>
    </div>`;

  currentTemplate.fields.forEach((f) => {
    html += fieldHTML(f, "");
  });

  html += `<hr class="divider">`;
  html += `<p class="section-label">Datos de la empresa (se guardan y se reutilizan)</p>`;
  GLOBAL_FIELDS.forEach((f) => {
    html += fieldHTML(f, globalData[f.key] || "");
  });

  container.innerHTML = html;

  // listeners
  container.querySelectorAll("input").forEach((el) => {
    el.addEventListener("input", updatePreview);
  });

  document.getElementById("btn-genero-h").onclick = () => setGenero("H");
  document.getElementById("btn-genero-m").onclick = () => setGenero("M");

  updatePreview();
}

function setGenero(g) {
  genero = g;
  document.getElementById("btn-genero-h").classList.toggle("active", g === "H");
  document.getElementById("btn-genero-m").classList.toggle("active", g === "M");
  updatePreview();
}

function collectData() {
  const data = {};
  document.querySelectorAll("#form-container input").forEach((el) => {
    data[el.dataset.key] = el.value;
  });
  data.genero = genero;
  return data;
}

function updatePreview() {
  const data = collectData();

  // guardar automáticamente los datos de empresa
  const globalData = {};
  GLOBAL_FIELDS.forEach((f) => (globalData[f.key] = data[f.key] || ""));
  saveGlobalData(globalData);

  const finalHTML = renderTemplate(currentTemplate.html, data);
  const subject = renderTemplate(currentTemplate.subject(data), data);

  document.getElementById("subject-preview").textContent = subject;

  const iframe = document.getElementById("preview");
  iframe.srcdoc = finalHTML;

  window._lastHTML = finalHTML;
  window._lastSubject = subject;
}

function copyHTML() {
  navigator.clipboard.writeText(window._lastHTML || "").then(() => showToast("HTML copiado al portapapeles"));
}

function downloadHTML() {
  const blob = new Blob([window._lastHTML || ""], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${currentTemplate.id}.html`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Archivo descargado");
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2200);
}

document.addEventListener("DOMContentLoaded", () => {
  buildSidebar();
  buildForm();

  document.getElementById("btn-copy").onclick = copyHTML;
  document.getElementById("btn-download").onclick = downloadHTML;
});
