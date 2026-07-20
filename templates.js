// ============================================================
// PLANTILLAS DE CORREO — FORTALECERNOS
// Cada plantilla es un string HTML con tokens {{campo}}.
// Los tokens de género se escriben así: {{g:masculino|femenino}}
// y se resuelven según el campo "genero" (H/M) de cada persona.
// ============================================================

const HEADER = `
<tr>
  <td style="background-color:#1428D6; padding:28px 32px; text-align:center;">
    <img src="{{logo_url}}" alt="Fortalecernos" width="300" style="display:block; margin:0 auto;">
  </td>
</tr>`;

const FOOTER = `
<tr>
  <td style="background-color:#1428D6; padding:16px 32px; text-align:center;">
    <p style="color:#c9cdf5; font-size:12px; margin:0;">Fortalecernos S.A.C. — Distribuidor autorizado Entel</p>
  </td>
</tr>`;

function wrap(title, bodyRows) {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>${title}</title></head>
<body style="margin:0; padding:0; background-color:#eef0f7; font-family: Arial, Helvetica, sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#eef0f7; padding:24px 0;">
  <tr>
    <td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.08);">
        ${HEADER}
        ${bodyRows}
        ${FOOTER}
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

const TEMPLATES = [

  // ------------------------------------------------------------
  // 1. BIENVENIDA — DÍA 1
  // ------------------------------------------------------------
  {
    id: "bienvenida",
    name: "Bienvenida · Día 1",
    description: "Se envía apenas firma contrato, con los datos de su primer día.",
    subject: (d) => `¡{{g:Bienvenido|Bienvenida}} a Fortalecernos, ${d.nombre}!`,
    fields: [
      { key: "fecha", label: "Fecha de presentación", type: "date" },
      { key: "hora", label: "Hora", type: "time" },
      { key: "direccion_tienda", label: "Tienda / Punto de venta", type: "text", placeholder: "Ej. Tienda Ica Centro" },
      { key: "nombre_supervisor", label: "Nombre del supervisor", type: "text" },
    ],
    html: wrap("Bienvenido a Fortalecernos", `
        <tr>
          <td style="padding:32px 32px 8px 32px;">
            <h1 style="margin:0; color:#1428D6; font-size:22px;">¡{{g:Bienvenido|Bienvenida}} a Fortalecernos, {{nombre}}! 🎉</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 32px 0 32px; color:#3a3a3a; font-size:15px; line-height:1.6;">
            <p>Estamos muy contentos de que te unas a nuestro equipo como <strong>{{g:Asesor de Ventas|Asesora de Ventas}}</strong> en Fortalecernos, distribuidor autorizado de Entel.</p>
            <p>Este correo tiene toda la información que necesitas para tu primer día. Léelo con calma antes de presentarte en tienda.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px 0 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5fb; border-left:4px solid #1428D6; border-radius:4px;">
              <tr>
                <td style="padding:18px 20px; color:#1a1a1a; font-size:14px; line-height:1.8;">
                  <strong>📅 Fecha de presentación:</strong> {{fecha}}<br>
                  <strong>🕒 Hora:</strong> {{hora}}<br>
                  <strong>📍 Tienda / Punto de venta:</strong> {{direccion_tienda}}<br>
                  <strong>👤 Pregunta por:</strong> {{nombre_supervisor}} (Supervisor de zona)
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 0 32px; color:#3a3a3a; font-size:15px; line-height:1.6;">
            <p style="margin:0 0 6px 0;"><strong>Qué debes traer:</strong></p>
            <ul style="margin:0; padding-left:20px;">
              <li>DNI (original y copia)</li>
              <li>1 foto tamaño carnet</li>
              <li>N° de cuenta bancaria para planilla</li>
            </ul>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 0 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fff8e6; border-left:4px solid #c9a227; border-radius:4px;">
              <tr>
                <td style="padding:18px 20px; color:#5a4a10; font-size:14px; line-height:1.7;">
                  <strong>📧 Antes de tu primer día, crea tu correo de trabajo</strong><br>
                  Mientras seguimos creciendo, cada colaborador crea su propio correo en Gmail con esta estructura:
                  <br><br>
                  <code style="background-color:#ffffff; padding:6px 10px; border-radius:4px; display:inline-block; font-size:14px; color:#1428D6; border:1px solid #e0d6a8;">fln.[inicialnombre][apellido]@gmail.com</code>
                  <br><br>
                  Ejemplo: Francisco López → <strong>fln.flopez@gmail.com</strong><br>
                  Respóndenos con la dirección que creaste para agregarte a los grupos de trabajo.
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 32px 8px 32px; text-align:center;">
            <p style="color:#3a3a3a; font-size:15px; margin:0 0 16px 0;">Toda la guía de bienvenida, políticas de tienda y proceso de ventas la encuentras aquí:</p>
            <a href="{{link_notion}}" target="_blank" style="background-color:#1428D6; color:#ffffff; text-decoration:none; font-weight:bold; padding:14px 32px; border-radius:6px; display:inline-block; font-size:15px;">
              Ver mi guía de bienvenida →
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px 8px 32px; color:#3a3a3a; font-size:14px; line-height:1.6;">
            <p>¿Alguna duda antes de tu primer día? Escríbenos:</p>
            <p style="margin:0;"><strong>{{nombre_rrhh}}</strong> — Recursos Humanos<br>
            📱 WhatsApp: {{numero_whatsapp}}<br>
            ✉️ {{correo_rrhh}}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 32px 32px; color:#3a3a3a; font-size:15px; line-height:1.6;">
            <p>¡Nos vemos pronto! {{g:Bienvenido|Bienvenida}} a la familia Fortalecernos. 💙</p>
            <p style="margin:0;"><strong>Equipo Fortalecernos</strong></p>
          </td>
        </tr>`)
  },

  // ------------------------------------------------------------
  // 2. CHECK-IN — 7 DÍAS
  // ------------------------------------------------------------
  {
    id: "checkin7",
    name: "Check-in · 7 días",
    description: "Feedback de la primera semana, con link a un formulario.",
    subject: (d) => `${d.nombre}, ¿cómo va tu primera semana?`,
    fields: [
      { key: "link_formulario", label: "Link del formulario (Google Forms)", type: "url" },
    ],
    html: wrap("¿Cómo va tu primera semana?", `
        <tr>
          <td style="padding:32px 32px 8px 32px;">
            <h1 style="margin:0; color:#1428D6; font-size:22px;">Hola {{nombre}}, ¿cómo va tu primera semana? 👋</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 32px 0 32px; color:#3a3a3a; font-size:15px; line-height:1.6;">
            <p>Ya cumpliste tu primera semana en Fortalecernos y queremos saber cómo ha sido tu experiencia hasta ahora.</p>
            <p>Tu opinión nos ayuda a mejorar el proceso de bienvenida para ti y para los próximos compañeros que se unan al equipo. Toma menos de 3 minutos.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px 0 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5fb; border-left:4px solid #1428D6; border-radius:4px;">
              <tr>
                <td style="padding:16px 20px; color:#1a1a1a; font-size:14px; line-height:1.6;">
                  🔒 Tus respuestas son confidenciales y no afectan tu evaluación. Queremos tu opinión honesta.
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:32px 32px 8px 32px; text-align:center;">
            <a href="{{link_formulario}}" target="_blank" style="background-color:#1428D6; color:#ffffff; text-decoration:none; font-weight:bold; padding:14px 32px; border-radius:6px; display:inline-block; font-size:15px;">
              Dar mi feedback →
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px 8px 32px; color:#3a3a3a; font-size:14px; line-height:1.6;">
            <p>Si tienes algún problema urgente (acceso, pago, uniforme, etc.), no esperes al formulario — escríbenos directo:</p>
            <p style="margin:0;"><strong>{{nombre_rrhh}}</strong> — Recursos Humanos<br>
            📱 WhatsApp: {{numero_whatsapp}}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 32px 32px; color:#3a3a3a; font-size:15px; line-height:1.6;">
            <p>Gracias por tu tiempo, y sigue así. 💙</p>
            <p style="margin:0;"><strong>Equipo Fortalecernos</strong></p>
          </td>
        </tr>`)
  },

  // ------------------------------------------------------------
  // 3. PRIMER MES — 30 DÍAS
  // ------------------------------------------------------------
  {
    id: "treinta_dias",
    name: "Primer mes · 30 días",
    description: "Felicita por culminar el primer mes; el supervisor coordinará una reunión de seguimiento.",
    subject: (d) => `¡{{nombre}}, completaste tu primer mes en Fortalecernos! 🙌`,
    fields: [
      { key: "reconocimiento", label: "Reconocimiento especial", type: "toggle-text", placeholder: "Ej. Destacaste por tu buena atención al cliente" },
    ],
    html: wrap("Primer mes en Fortalecernos", `
        <tr>
          <td style="padding:32px 32px 8px 32px;">
            <h1 style="margin:0; color:#1428D6; font-size:22px;">¡{{nombre}}, completaste tu primer mes en Fortalecernos! 🙌</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 32px 0 32px; color:#3a3a3a; font-size:15px; line-height:1.6;">
            <p>Ya pasaron 30 días desde que {{g:te uniste|te uniste}} al equipo, y queremos felicitarte por este primer mes. Sabemos que adaptarte a un nuevo trabajo toma esfuerzo, y valoramos mucho tu compromiso desde el día uno.</p>
          </td>
        </tr>
        {{#reconocimiento}}
        <tr>
          <td style="padding:20px 32px 0 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5fb; border-left:4px solid #1428D6; border-radius:4px;">
              <tr>
                <td style="padding:16px 20px; color:#1a1a1a; font-size:14px; line-height:1.6;">
                  🌟 <strong>{{reconocimiento}}</strong>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        {{/reconocimiento}}
        <tr>
          <td style="padding:24px 32px 0 32px; color:#3a3a3a; font-size:15px; line-height:1.6;">
            <p>Tu supervisor se reunirá contigo, previa coordinación, para conversar sobre cómo ha ido este primer mes: qué has mejorado y en qué aún hay oportunidad de seguir creciendo.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 32px 32px; color:#3a3a3a; font-size:15px; line-height:1.6;">
            <p>¡Sigue así! Gracias por ser parte de Fortalecernos. 💙</p>
            <p style="margin:0;"><strong>Equipo Fortalecernos</strong></p>
          </td>
        </tr>`)
  },

  // ------------------------------------------------------------
  // 4. ANIVERSARIO — 6 MESES
  // ------------------------------------------------------------
  {
    id: "seis_meses",
    name: "Aniversario · 6 meses",
    description: "Reconocimiento al cumplir medio año en la empresa.",
    subject: (d) => `¡{{nombre}}, ya llevas 6 meses con nosotros! 🎉`,
    fields: [
      { key: "logro_destacado", label: "Logro o dato destacado", type: "toggle-text", placeholder: "Ej. Top 3 en ventas de tu zona" },
    ],
    html: wrap("6 meses en Fortalecernos", `
        <tr>
          <td style="padding:32px 32px 8px 32px;">
            <h1 style="margin:0; color:#1428D6; font-size:22px;">¡{{nombre}}, cumples 6 meses en Fortalecernos! 🎉</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 32px 0 32px; color:#3a3a3a; font-size:15px; line-height:1.6;">
            <p>Medio año atrás {{g:llegaste|llegaste}} a nuestro equipo como {{g:Asesor de Ventas|Asesora de Ventas}}, y hoy queremos reconocer tu compromiso y el trabajo que has puesto cada día en tienda.</p>
            <p>{{g:Gracias por seguir creciendo con nosotros|Gracias por seguir creciendo con nosotros}}. Cada cliente bien atendido y cada meta cumplida suma al crecimiento de Fortalecernos.</p>
          </td>
        </tr>
        {{#logro_destacado}}
        <tr>
          <td style="padding:20px 32px 0 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5fb; border-left:4px solid #1428D6; border-radius:4px;">
              <tr>
                <td style="padding:16px 20px; color:#1a1a1a; font-size:14px; line-height:1.6;">
                  🏆 <strong>{{logro_destacado}}</strong>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        {{/logro_destacado}}
        <tr>
          <td style="padding:24px 32px 0 32px; color:#3a3a3a; font-size:15px; line-height:1.6;">
            <p>Seguimos construyendo juntos tu camino dentro de la empresa: Asesor → Asesor Senior → Supervisor de zona. Tu supervisor conversará contigo esta semana sobre tus próximos pasos.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px 32px 32px; color:#3a3a3a; font-size:15px; line-height:1.6;">
            <p>¡Gracias por ser parte de Fortalecernos! 💙</p>
            <p style="margin:0;"><strong>Equipo Fortalecernos</strong></p>
          </td>
        </tr>`)
  },

  // ------------------------------------------------------------
  // 5. ANIVERSARIO — 1 AÑO
  // ------------------------------------------------------------
  {
    id: "un_anio",
    name: "Aniversario · 1 año",
    description: "Reconocimiento al cumplir un año en la empresa.",
    subject: (d) => `¡{{nombre}}, 1 año construyendo Fortalecernos juntos! 🥳`,
    fields: [
      { key: "logro_destacado", label: "Logro o dato destacado", type: "toggle-text", placeholder: "Ej. Más de 500 clientes atendidos" },
      { key: "beneficio_aniversario", label: "Beneficio o detalle de aniversario", type: "toggle-text", placeholder: "Ej. Día libre adicional este mes" },
    ],
    html: wrap("1 año en Fortalecernos", `
        <tr>
          <td style="padding:32px 32px 8px 32px;">
            <h1 style="margin:0; color:#1428D6; font-size:22px;">¡{{nombre}}, cumples 1 año en Fortalecernos! 🥳</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 32px 0 32px; color:#3a3a3a; font-size:15px; line-height:1.6;">
            <p>Hace un año {{g:te uniste|te uniste}} a nuestro equipo, y hoy es un buen momento para decirte algo simple: <strong>gracias por quedarte y crecer con nosotros.</strong></p>
            <p>Un año en tienda no es poco — significa constancia, buen trato a nuestros clientes, y sobre todo, una confianza que se construye día a día entre tú y Fortalecernos. Nos alegra saber que aquí no solo tienes un trabajo, sino un lugar donde puedes seguir creciendo.</p>
          </td>
        </tr>
        {{#logro_destacado}}
        <tr>
          <td style="padding:20px 32px 0 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5fb; border-left:4px solid #1428D6; border-radius:4px;">
              <tr>
                <td style="padding:16px 20px; color:#1a1a1a; font-size:14px; line-height:1.6;">
                  🏆 <strong>{{logro_destacado}}</strong>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        {{/logro_destacado}}
        {{#beneficio_aniversario}}
        <tr>
          <td style="padding:20px 32px 0 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fff8e6; border-left:4px solid #c9a227; border-radius:4px;">
              <tr>
                <td style="padding:16px 20px; color:#5a4a10; font-size:14px; line-height:1.6;">
                  🎁 <strong>{{beneficio_aniversario}}</strong>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        {{/beneficio_aniversario}}
        <tr>
          <td style="padding:24px 32px 32px 32px; color:#3a3a3a; font-size:15px; line-height:1.6;">
            <p>¡Vamos por muchos años más juntos! 💙</p>
            <p style="margin:0;"><strong>Equipo Fortalecernos</strong></p>
          </td>
        </tr>`)
  },

  // ------------------------------------------------------------
  // 6. CUMPLEAÑOS
  // ------------------------------------------------------------
  {
    id: "cumpleanos",
    name: "Cumpleaños 🎂",
    description: "Saludo cálido el día de su cumpleaños, con 5 mensajes para elegir.",
    subject: (d) => `¡Feliz cumpleaños, ${d.nombre}! 🎂`,
    fields: [
      {
        key: "mensaje_cumple_id",
        label: "Mensaje de cumpleaños",
        type: "select",
        options: [
          { value: "1", label: "Mensaje 1 · Cálido y sencillo" },
          { value: "2", label: "Mensaje 2 · De parte del equipo" },
          { value: "3", label: "Mensaje 3 · Deseo de bendiciones" },
          { value: "4", label: "Mensaje 4 · Buena energía" },
          { value: "5", label: "Mensaje 5 · Breve y directo" },
        ],
      },
      {
        key: "cierre_cumple_id",
        label: "Firma / cierre de RRHH",
        type: "select",
        options: [
          { value: "1", label: "Cierre 1 · Con cariño" },
          { value: "2", label: "Cierre 2 · Con mucho aprecio" },
          { value: "3", label: "Cierre 3 · Un abrazo grande" },
          { value: "4", label: "Cierre 4 · De parte de todo el equipo" },
          { value: "5", label: "Cierre 5 · Feliz día" },
        ],
      },
    ],
    // Los 5 mensajes y los 5 cierres son genéricos: ninguno menciona un
    // cargo o puesto, así se pueden enviar a cualquier colaborador de la empresa.
    mensajesCumple: {
      "1": (nombre) => `Hoy es tu día, ${nombre}. Que lo disfrutes rodeado de las personas que más quieres y con muchas ganas de celebrar. ¡Feliz cumpleaños!`,
      "2": (nombre) => `En Fortalecernos nos alegra mucho poder celebrarte, ${nombre}. Gracias por ser parte de este equipo y por todo lo que compartes con nosotros. ¡Que tengas un cumpleaños increíble!`,
      "3": (nombre) => `${nombre}, esperamos que este nuevo año de vida venga cargado de cosas buenas, salud y muchas sonrisas. ¡Feliz cumpleaños de parte de todo el equipo Fortalecernos!`,
      "4": (nombre) => `Cada año que cumples es un motivo más para celebrar contigo, ${nombre}. Gracias por tu buena energía y por ser parte de nuestra familia Fortalecernos. ¡Feliz cumpleaños!`,
      "5": (nombre) => `Hoy queremos tomarnos un momento para desearte un muy feliz cumpleaños, ${nombre}. Que este día esté lleno de alegría y que el próximo año te traiga muchas bendiciones.`,
    },
    cierresCumple: {
      "1": `Con cariño,<br>Equipo Fortalecernos 💙`,
      "2": `Con mucho aprecio,<br>Equipo Fortalecernos 🎉`,
      "3": `Un abrazo grande,<br>Equipo Fortalecernos 🤗`,
      "4": `De parte de todo el equipo,<br>Fortalecernos 💙`,
      "5": `¡Feliz día!<br>Equipo Fortalecernos 🎈`,
    },
    beforeRender: function (data) {
      const mensajes = this.mensajesCumple;
      const cierres = this.cierresCumple;
      const idMsg = data.mensaje_cumple_id && mensajes[data.mensaje_cumple_id] ? data.mensaje_cumple_id : "1";
      const idCierre = data.cierre_cumple_id && cierres[data.cierre_cumple_id] ? data.cierre_cumple_id : "1";
      data.mensaje_cumple = mensajes[idMsg](data.nombre || "");
      data.cierre_cumple = cierres[idCierre];
      return data;
    },
    html: wrap("Feliz cumpleaños", `
        <tr>
          <td style="padding:32px 32px 8px 32px; text-align:center;">
            <h1 style="margin:0; color:#1428D6; font-size:24px;">¡Feliz cumpleaños, {{nombre}}! 🎂🎉</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:12px 32px 0 32px; color:#3a3a3a; font-size:15px; line-height:1.6; text-align:center;">
            <p>{{mensaje_cumple}}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px 32px 32px; color:#3a3a3a; font-size:15px; line-height:1.6; text-align:center;">
            <p style="margin:0;"><strong>{{cierre_cumple}}</strong></p>
          </td>
        </tr>`)
  },
];
