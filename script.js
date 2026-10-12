/* =========================================================
   Festa da Sofia · 8 anos
   Contagem decrescente, links de calendário e confirmação
   de presença.
   ========================================================= */

/* --- Dados da festa (altera aqui se algo mudar) ----------
   O telefone é usado no botão de WhatsApp e no de ligar.
   Formato internacional, só dígitos: 351 + número. */
const FESTA = {
  titulo: "Aniversário da Sofia — 8 anos 🎀",
  local: "Party Spot, Rua Fernando Vaz nº 10 B, 1750-108 Lisboa",
  descricao:
    "A Sofia faz 8 anos! Festa Hello Kitty na Party Spot, das 14h00 às 16h30.",
  // A 31 de outubro Lisboa já está no horário de inverno (UTC+0).
  inicio: "2026-10-31T14:00:00Z",
  fim: "2026-10-31T16:30:00Z",
  telefone: "351912345678", // TODO: substituir pelo número de contacto real
};

/* ---------- Contagem decrescente ---------- */

function iniciarContagem() {
  const lista = document.getElementById("countdown");
  const aviso = document.getElementById("countdown-done");
  if (!lista) return;

  const campos = {};
  lista.querySelectorAll("[data-unit]").forEach((el) => {
    campos[el.dataset.unit] = el;
  });

  const alvo = new Date(FESTA.inicio).getTime();

  const atualizar = () => {
    const restante = alvo - Date.now();

    if (restante <= 0) {
      lista.hidden = true;
      if (aviso) aviso.hidden = false;
      return true;
    }

    const segundos = Math.floor(restante / 1000);
    const valores = {
      dias: Math.floor(segundos / 86400),
      horas: Math.floor((segundos % 86400) / 3600),
      minutos: Math.floor((segundos % 3600) / 60),
      segundos: segundos % 60,
    };

    for (const [unidade, el] of Object.entries(campos)) {
      el.textContent = String(valores[unidade]).padStart(2, "0");
    }

    return false;
  };

  if (atualizar()) return;
  const temporizador = setInterval(() => {
    if (atualizar()) clearInterval(temporizador);
  }, 1000);
}

/* ---------- Adicionar ao calendário ---------- */

function paraFormatoICS(iso) {
  return iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function prepararCalendario() {
  const inicio = paraFormatoICS(FESTA.inicio);
  const fim = paraFormatoICS(FESTA.fim);

  const google = document.getElementById("add-google");
  if (google) {
    const url = new URL("https://calendar.google.com/calendar/render");
    url.searchParams.set("action", "TEMPLATE");
    url.searchParams.set("text", FESTA.titulo);
    url.searchParams.set("dates", `${inicio}/${fim}`);
    url.searchParams.set("details", FESTA.descricao);
    url.searchParams.set("location", FESTA.local);
    google.href = url.toString();
  }

  const ics = document.getElementById("add-ics");
  if (ics) {
    const conteudo = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Festa da Sofia//PT",
      "BEGIN:VEVENT",
      `UID:sofia-8-anos@sofiamartins.lol`,
      `DTSTAMP:${inicio}`,
      `DTSTART:${inicio}`,
      `DTEND:${fim}`,
      `SUMMARY:${FESTA.titulo}`,
      `DESCRIPTION:${FESTA.descricao}`,
      `LOCATION:${FESTA.local}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([conteudo], { type: "text/calendar;charset=utf-8" });
    ics.href = URL.createObjectURL(blob);
  }
}

/* ---------- Confirmação de presença ---------- */

function prepararRsvp() {
  const mensagem = encodeURIComponent(
    "Olá! Confirmo a presença na festa de aniversário da Sofia, no dia 31 de outubro. 🎀"
  );

  const whatsapp = document.getElementById("rsvp-whatsapp");
  if (whatsapp) {
    whatsapp.href = `https://wa.me/${FESTA.telefone}?text=${mensagem}`;
    whatsapp.target = "_blank";
    whatsapp.rel = "noopener";
  }

  const telefone = document.getElementById("rsvp-phone");
  if (telefone) telefone.href = `tel:+${FESTA.telefone}`;
}

iniciarContagem();
prepararCalendario();
prepararRsvp();
