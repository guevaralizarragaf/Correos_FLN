// ============================================================
// APP.JS — lógica del generador de correos Fortalecernos
// ============================================================

const GLOBAL_STORAGE_KEY = "fortalecernos_datos_empresa";

// Valores por defecto (se usan solo si aún no se ha guardado nada en el navegador)
const GLOBAL_DEFAULTS = {
  logo_url: "https://github.com/guevaralizarragaf/Correos_FLN/blob/main/assets/LOGO%20FLN%20HD%20-%20AZUL.png?raw=true",
  link_notion: "",
};

// Campos que se llenan UNA VEZ en "Datos de la empresa" y se reutilizan en todos los correos
const GLOBAL_FIELDS = [
  { key: "logo_url", label: "URL del logo", type: "url", placeholder: "https://..." },
  { key: "link_notion", label: "Link de la guía de Notion", type: "url", placeholder: "" },
  { key: "nombre_rrhh", label: "Nombre de RRHH", type: "text" },
  { key: "numero_whatsapp", label: "WhatsApp de RRHH", type: "text", placeholder: "+51 9xx xxx xxx" },
  { key: "correo_rrhh", label: "Correo de RRHH", type: "text", placeholder: "rrhh@fortalecernos.com" },
];

let currentTemplate = TEMPLATES[0];
let currentView = "template"; // "template" | "settings"
let genero = "H"; // H = masculino, M = femenino

// ------------------------------------------------------------
// Datos de empresa (localStorage)
// ------------------------------------------------------------
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

// ------------------------------------------------------------
// Render de plantillas: bloques condicionales, género y tokens
// ------------------------------------------------------------
function renderTemplate(htmlString, data) {
  let out = htmlString;

  // 1) bloques condicionales {{#campo}} ... {{/campo}}
  //    se muestran solo si data[campo] tiene contenido real
  out = out.replace(/\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (_, key, block) => {
    const val = data[key];
    const has = val !== undefined && val !== null && String(val).trim() !== "";
    return has ? block : "";
  });

  // 2) tokens de género {{g:masculino|femenino}}
  out = out.replace(/\{\{g:([^|{}]*)\|([^{}]*)\}\}/g, (_, masc, fem) => (genero === "M" ? fem : masc));

  // 3) tokens normales {{campo}}
  out = out.replace(/\{\{(\w+)\}\}/g, (m, key) => {
    const val = data[key];
    return (val !== undefined && val !== null && val !== "") ? val : `[${key}]`;
  });

  return out;
}

// ------------------------------------------------------------
// Sidebar
// ------------------------------------------------------------
function buildSidebar() {
  const list = document.getElementById("template-list");
  list.innerHTML = "";
  TEMPLATES.forEach((t) => {
    const btn = document.createElement("button");
    btn.className = "template-btn" + (currentView === "template" && t.id === currentTemplate.id ? " active" : "");
    btn.innerHTML = `<strong>${t.name}</strong>${t.description}`;
    btn.onclick = () => {
      currentTemplate = t;
      currentView = "template";
      buildSidebar();
      renderView();
    };
    list.appendChild(btn);
  });

  const settingsBtn = document.getElementById("settings-btn");
  settingsBtn.classList.toggle("active", currentView === "settings");
}

// ------------------------------------------------------------
// Render de campos según su tipo
// ------------------------------------------------------------
function escapeAttr(v) {
  return (v || "").toString().replace(/"/g, "&quot;");
}

function fieldHTML(f, value) {
  const val = value !== undefined ? value : (f.default || "");

  if (f.type === "select") {
    const options = (f.options || [])
      .map((o) => `<option value="${escapeAttr(o.value)}" ${o.value === val ? "selected" : ""}>${o.label}</option>`)
      .join("");
    return `
    <div class="field">
      <label for="f_${f.key}">${f.label}</label>
      <select id="f_${f.key}" data-key="${f.key}">${options}</select>
    </div>`;
  }

  if (f.type === "toggle-text") {
    return `
    <div class="field toggle-field">
      <label class="toggle-label">
        <input type="checkbox" id="f_${f.key}_on" data-toggle-for="${f.key}">
        Incluir "${f.label}"
      </label>
      <input id="f_${f.key}" data-key="${f.key}" type="text" placeholder="${f.placeholder || ''}" value="" disabled>
    </div>`;
  }

  return `
    <div class="field">
      <label for="f_${f.key}">${f.label}</label>
      <input id="f_${f.key}" data-key="${f.key}" type="${f.type === 'url' ? 'text' : f.type}" placeholder="${f.placeholder || ''}" value="${escapeAttr(val)}">
    </div>`;
}

// ------------------------------------------------------------
// Vista: Editor de plantilla
// ------------------------------------------------------------
function buildTemplateView() {
  const main = document.getElementById("main-content");
  main.innerHTML = `
    <div class="topbar">
      <div>
        <h1>${currentTemplate.name}</h1>
        <p>Completa los datos de la persona y revisa la vista previa. Cuando esté listo, copia el HTML o descárgalo para enviarlo.</p>
      </div>
    </div>
    <div class="grid">
      <section class="panel">
        <h3>Datos del correo</h3>
        <div id="form-container"></div>
      </section>
      <section class="panel preview-wrap">
        <h3>Vista previa</h3>
        <div class="subject-line"><span>Asunto:</span><span id="subject-preview"></span></div>
        <div class="preview-frame-holder">
          <iframe id="preview" title="Vista previa del correo"></iframe>
        </div>
        <div class="actions">
          <button class="btn btn-primary" id="btn-copy">Copiar HTML</button>
          <button class="btn btn-secondary" id="btn-download">Descargar .html</button>
        </div>
      </section>
    </div>`;

  const container = document.getElementById("form-container");
  let html = `<p class="section-label">Datos de la persona</p>`;
  html += `
    <div class="field">
      <label for="f_nombre">Nombre</label>
      <input id="f_nombre" data-key="nombre" type="text" placeholder="Ej. Francisco">
    </div>
    <div class="field">
      <label>Género (para personalizar el texto)</label>
      <div class="gender-toggle">
        <button type="button" id="btn-genero-h" class="active">Hombre</button>
        <button type="button" id="btn-genero-m">Mujer</button>
      </div>
    </div>`;

  if (currentTemplate.fields.length) {
    html += `<hr class="divider">`;
    html += `<p class="section-label">Datos de esta plantilla</p>`;
    currentTemplate.fields.forEach((f) => {
      html += fieldHTML(f, "");
    });
  }

  container.innerHTML = html;

  // listeners de inputs normales
  container.querySelectorAll("input[data-key], select[data-key]").forEach((el) => {
    el.addEventListener("input", updatePreview);
    el.addEventListener("change", updatePreview);
  });

  // listeners de checkboxes toggle (habilitan/deshabilitan su input hermano)
  container.querySelectorAll("input[data-toggle-for]").forEach((cb) => {
    const key = cb.dataset.toggleFor;
    cb.addEventListener("change", () => {
      const input = document.getElementById(`f_${key}`);
      input.disabled = !cb.checked;
      if (!cb.checked) input.value = "";
      updatePreview();
    });
  });

  document.getElementById("btn-genero-h").onclick = () => setGenero("H");
  document.getElementById("btn-genero-m").onclick = () => setGenero("M");
  document.getElementById("btn-copy").onclick = copyHTML;
  document.getElementById("btn-download").onclick = downloadHTML;

  updatePreview();
}

function setGenero(g) {
  genero = g;
  document.getElementById("btn-genero-h").classList.toggle("active", g === "H");
  document.getElementById("btn-genero-m").classList.toggle("active", g === "M");
  updatePreview();
}

function collectData() {
  const data = loadGlobalData(); // datos de empresa siempre disponibles
  document.querySelectorAll("#form-container input[data-key], #form-container select[data-key]").forEach((el) => {
    if (el.type === "checkbox") return;
    data[el.dataset.key] = el.value;
  });
  data.genero = genero;
  return data;
}

function updatePreview() {
  let data = collectData();

  if (typeof currentTemplate.beforeRender === "function") {
    data = currentTemplate.beforeRender(data) || data;
  }

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

// ------------------------------------------------------------
// Vista: Configuración de empresa
// ------------------------------------------------------------
function buildSettingsView() {
  const main = document.getElementById("main-content");
  const data = loadGlobalData();

  let fieldsHtml = "";
  GLOBAL_FIELDS.forEach((f) => {
    fieldsHtml += fieldHTML(f, data[f.key] || "");
  });

  main.innerHTML = `
    <div class="topbar">
      <div>
        <h1>Datos de la empresa</h1>
        <p>Esta información se guarda en este navegador y se aplica automáticamente a todas las plantillas (logo, link de Notion y contacto de RRHH).</p>
      </div>
    </div>
    <div class="grid grid-single">
      <section class="panel">
        <h3>Configuración</h3>
        <div id="settings-form">${fieldsHtml}</div>
        <div class="actions">
          <button class="btn btn-primary" id="btn-save-settings">Guardar cambios</button>
        </div>
      </section>
    </div>`;

  document.getElementById("btn-save-settings").onclick = () => {
    const newData = {};
    document.querySelectorAll("#settings-form input[data-key]").forEach((el) => {
      newData[el.dataset.key] = el.value;
    });
    saveGlobalData(Object.assign({}, loadGlobalData(), newData));
    showToast("Datos de la empresa guardados");
  };
}

// ------------------------------------------------------------
// Router simple entre las dos vistas
// ------------------------------------------------------------
function renderView() {
  if (currentView === "settings") {
    buildSettingsView();
  } else {
    buildTemplateView();
  }
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2200);
}

document.addEventListener("DOMContentLoaded", () => {
  buildSidebar();
  renderView();

  document.getElementById("settings-btn").onclick = () => {
    currentView = "settings";
    buildSidebar();
    renderView();
  };
});
