/* =========================================================
   Casa das Tendas — interações
   ========================================================= */
(function () {
  "use strict";

  var WHATS = "5561999135335";

  /* ---------- rastreamento simples (dataLayer) ---------- */
  window.dataLayer = window.dataLayer || [];
  function rastrear(evento, detalhes) {
    window.dataLayer.push(
      Object.assign({ event: evento }, detalhes || {})
    );
  }
  window.rastrearCdt = rastrear;

  /* ---------- menu mobile ---------- */
  var botao = document.querySelector(".btn-menu");
  var nav = document.querySelector(".nav");
  var overlay = document.querySelector(".overlay-menu");

  function fecharMenu() {
    if (!nav) return;
    nav.classList.remove("aberto");
    if (overlay) overlay.classList.remove("ativo");
    if (botao) botao.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  if (botao && nav) {
    botao.addEventListener("click", function () {
      var aberto = nav.classList.toggle("aberto");
      if (overlay) overlay.classList.toggle("ativo", aberto);
      botao.setAttribute("aria-expanded", aberto ? "true" : "false");
      document.body.style.overflow = aberto ? "hidden" : "";
    });
    if (overlay) overlay.addEventListener("click", fecharMenu);
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", fecharMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") fecharMenu();
    });
  }

  /* ---------- cliques em WhatsApp ---------- */
  document.querySelectorAll("[data-whats]").forEach(function (el) {
    el.addEventListener("click", function () {
      rastrear("whatsapp_click", {
        local: el.getAttribute("data-local") || "site",
        produto: el.getAttribute("data-produto") || ""
      });
    });
  });

  /* ---------- montar links de WhatsApp com mensagem ---------- */
  document.querySelectorAll("[data-zap-msg]").forEach(function (el) {
    var msg = el.getAttribute("data-zap-msg");
    el.setAttribute(
      "href",
      "https://wa.me/" + WHATS + "?text=" + encodeURIComponent(msg)
    );
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  /* ---------- filtros do catálogo ---------- */
  var filtros = document.querySelectorAll(".filtro");
  if (filtros.length) {
    var itens = document.querySelectorAll("[data-categoria]");
    filtros.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cat = btn.getAttribute("data-filtro");
        filtros.forEach(function (b) {
          b.classList.remove("ativo");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("ativo");
        btn.setAttribute("aria-pressed", "true");
        var visiveis = 0;
        itens.forEach(function (item) {
          var categorias = (item.getAttribute("data-categoria") || "").split(" ");
          var mostra = cat === "todos" || categorias.indexOf(cat) > -1;
          item.classList.toggle("oculto", !mostra);
          if (mostra) visiveis++;
        });
        var aviso = document.querySelector("[data-filtro-vazio]");
        if (aviso) aviso.classList.toggle("oculto", visiveis > 0);
        rastrear("filtro_catalogo", { filtro: cat, resultados: visiveis });
      });
    });
  }

  /* ---------- galeria: lightbox ---------- */
  var lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    var foto = lightbox.querySelector("img");
    var legenda = lightbox.querySelector("figcaption");
    var figuras = Array.prototype.slice.call(
      document.querySelectorAll(".galeria button[data-full]")
    );
    var atual = 0;

    function mostrar(i) {
      if (!figuras.length) return;
      atual = (i + figuras.length) % figuras.length;
      var btn = figuras[atual];
      foto.src = btn.getAttribute("data-full");
      foto.alt = btn.getAttribute("data-alt") || "";
      legenda.textContent = btn.getAttribute("data-caption") || "";
      lightbox.classList.add("aberto");
      lightbox.querySelector(".fechar").focus();
      document.body.style.overflow = "hidden";
    }

    function esconder() {
      lightbox.classList.remove("aberto");
      document.body.style.overflow = "";
    }

    figuras.forEach(function (btn, i) {
      btn.addEventListener("click", function () {
        mostrar(i);
        rastrear("galeria_foto", { foto: btn.getAttribute("data-alt") || "" });
      });
    });

    lightbox.querySelector(".fechar").addEventListener("click", esconder);
    lightbox.querySelector(".anterior").addEventListener("click", function () {
      mostrar(atual - 1);
    });
    lightbox.querySelector(".proximo").addEventListener("click", function () {
      mostrar(atual + 1);
    });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) esconder();
    });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("aberto")) return;
      if (e.key === "Escape") esconder();
      if (e.key === "ArrowLeft") mostrar(atual - 1);
      if (e.key === "ArrowRight") mostrar(atual + 1);
    });
  }

  /* ---------- galeria do produto: trocar imagem principal ---------- */
  var principal = document.querySelector("[data-img-principal]");
  if (principal) {
    document.querySelectorAll(".miniaturas button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        principal.src = btn.getAttribute("data-src");
        principal.alt = btn.getAttribute("data-alt") || principal.alt;
        document
          .querySelectorAll(".miniaturas button")
          .forEach(function (b) {
            b.setAttribute("aria-pressed", "false");
          });
        btn.setAttribute("aria-pressed", "true");
      });
    });
  }

  /* ---------- formulário de orçamento ---------- */
  var form = document.querySelector("[data-form-orcamento]");
  if (form) {
    var status = form.querySelector(".form-status");

    function validarCampo(campo) {
      var wrap = campo.closest(".campo");
      if (!wrap) return true;
      var valor = (campo.value || "").trim();
      var obrigatorio = campo.hasAttribute("required");
      var valido = true;

      if (obrigatorio && !valor) valido = false;
      if (valido && campo.type === "email" && valor) {
        valido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor);
      }
      if (valido && campo.dataset.tipo === "telefone" && valor) {
        var digitos = valor.replace(/\D/g, "");
        valido = digitos.length >= 10 && digitos.length <= 13;
      }
      wrap.classList.toggle("invalido", !valido);
      campo.setAttribute("aria-invalid", valido ? "false" : "true");
      return valido;
    }

    form.querySelectorAll("input, select, textarea").forEach(function (campo) {
      campo.addEventListener("blur", function () {
        if (campo.value.trim() || campo.hasAttribute("required")) validarCampo(campo);
      });
      campo.addEventListener("input", function () {
        var wrap = campo.closest(".campo");
        if (wrap && wrap.classList.contains("invalido")) validarCampo(campo);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var campos = form.querySelectorAll("input, select, textarea");
      var todosValidos = true;
      var primeiroInvalido = null;

      campos.forEach(function (campo) {
        var ok = validarCampo(campo);
        if (!ok && !primeiroInvalido) primeiroInvalido = campo;
        if (!ok) todosValidos = false;
      });

      if (!todosValidos) {
        if (status) status.classList.remove("visible");
        if (primeiroInvalido) primeiroInvalido.focus();
        rastrear("formulario_erro", {});
        return;
      }

      var dados = {};
      new FormData(form).forEach(function (valor, chave) {
        dados[chave] = valor;
      });

      rastrear("formulario_enviado", { produto: dados.produto || "" });

      if (status) {
        var nome = (dados.nome || "").split(" ")[0];
        status.querySelector("[data-nome]").textContent = nome ? ", " + nome : "";
        status.classList.add("visible");
        status.setAttribute("tabindex", "-1");
        status.focus();
      }

      /* monta o resumo e oferece envio também pelo WhatsApp */
      var resumo =
        "Olá! Vim pelo site da Casa das Tendas e quero um orçamento.%0A%0A" +
        "Nome: " + encodeURIComponent(dados.nome || "") + "%0A" +
        "Telefone: " + encodeURIComponent(dados.telefone || "") + "%0A" +
        (dados.email ? "E-mail: " + encodeURIComponent(dados.email) + "%0A" : "") +
        (dados.produto ? "Produto: " + encodeURIComponent(dados.produto) + "%0A" : "") +
        (dados.data ? "Data do evento: " + encodeURIComponent(dados.data) + "%0A" : "") +
        (dados.cidade ? "Cidade/local: " + encodeURIComponent(dados.cidade) + "%0A" : "") +
        (dados.mensagem ? "Mensagem: " + encodeURIComponent(dados.mensagem) : "");

      var linkZap = form.querySelector("[data-form-zap]");
      if (linkZap) {
        linkZap.href = "https://wa.me/" + WHATS + "?text=" + resumo;
        linkZap.classList.remove("oculto");
      }

      form.reset();
    });
  }

  /* ---------- vídeo: pausar quando fora da tela ---------- */
  var videosAuto = document.querySelectorAll("video[autoplay]");
  if (videosAuto.length && "IntersectionObserver" in window) {
    var obs = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          var v = entrada.target;
          if (entrada.isIntersecting) {
            var p = v.play();
            if (p && p.catch) p.catch(function () {});
          } else {
            v.pause();
          }
        });
      },
      { threshold: 0.25 }
    );
    videosAuto.forEach(function (v) {
      obs.observe(v);
    });
  }
})();
