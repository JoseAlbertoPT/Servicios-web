document.getElementById("year").textContent = new Date().getFullYear();

const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealEls.length) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: "-40px" }
  );

  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}


const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const siteHeader = document.getElementById("siteHeader");

window.addEventListener("scroll", () => {
  siteHeader.classList.toggle("is-scrolled", window.scrollY > 8);
});

const navAnchors = document.querySelectorAll("[data-nav-link]");
const spySections = [...navAnchors]
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && spySections.length) {
  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach((link) => {
          link.classList.toggle(
            "is-active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    },
    { rootMargin: "-45% 0px -45% 0px" }
  );

  spySections.forEach((section) => spyObserver.observe(section));
}

const servicesMock = document.getElementById("servicesMock");

if (servicesMock) {
  const mockSlides = servicesMock.querySelectorAll("[data-mock-slide]");
  const mockTitle = servicesMock.querySelector("[data-mock-title]");
  const rotateInterval = Number(servicesMock.dataset.rotateInterval) || 300000;
  let activeMockIndex = 0;

  const showMockSlide = (index) => {
    mockSlides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
    });
    if (mockTitle) {
      mockTitle.textContent = mockSlides[index].dataset.mockTitle || "";
    }
  };

  if (mockSlides.length > 1) {
    setInterval(() => {
      activeMockIndex = (activeMockIndex + 1) % mockSlides.length;
      showMockSlide(activeMockIndex);
    }, rotateInterval);
  }
}

const chatbot = document.getElementById("chatbot");

if (chatbot) {
  const chatbotToggle = document.getElementById("chatbotToggle");
  const chatbotClose = document.getElementById("chatbotClose");
  const chatbotMessages = document.getElementById("chatbotMessages");
  const chatbotScroll = document.getElementById("chatbotScroll");
  const chatbotBadge = document.getElementById("chatbotBadge");
  const chatbotForm = document.getElementById("chatbotForm");
  const chatbotInput = document.getElementById("chatbotInput");

  const FAQ = {
    servicios: {
      q: "¿Qué servicios ofreces?",
      a: 'Ofrezco desarrollo de sitios web responsivos, sistemas administrativos (ABM/CRUD) y mantenimiento continuo. Mirá el detalle en <a href="#servicios">Servicios</a>.',
      keywords: ["servicio", "ofreces", "hacer", "hace", "desarrollas"],
    },
    precio: {
      q: "¿Cuánto cuesta un sitio web?",
      a: "Depende del alcance del proyecto (páginas, funcionalidades, integraciones). Contame qué necesitás por WhatsApp y te paso una cotización sin compromiso.",
      keywords: ["precio", "cuesta", "costo", "presupuesto", "cotizacion", "vale"],
    },
    plazos: {
      q: "¿Cuánto tarda un proyecto?",
      a: "El tiempo de entrega varía según la complejidad, pero un sitio web simple suele tomar entre 1 y 3 semanas. Escribime por WhatsApp con tu idea y te doy un plazo estimado.",
      keywords: ["tarda", "plazo", "demora", "entrega", "duracion", "tiempo"],
    },
    tecnologias: {
      q: "¿Qué tecnologías usas?",
      a: 'Trabajo con Java, PHP, Python, JavaScript, HTML, CSS y Bootstrap, entre otras. Podés ver el detalle completo en <a href="#habilidades">Habilidades</a>.',
      keywords: ["tecnologia", "lenguaje", "stack", "framework", "programas"],
    },
    contacto: {
      q: "¿Cómo te contacto?",
      a: 'Por WhatsApp al (+52) 777 452 4946, por correo a albertprztrrs@gmail.com, o desde la sección <a href="#contacto">Contacto</a>.',
      keywords: ["contacto", "email", "correo", "telefono", "numero", "whatsapp"],
    },
    portafolio: {
      q: "Ver portafolio",
      a: 'Tengo varios proyectos documentados, como un sistema de emergencias en tiempo real y más. Mirá el <a href="#portafolio">Portafolio</a> completo.',
      keywords: ["portafolio", "portfolio", "proyecto", "trabajo", "ejemplo"],
    },
  };

  const normalize = (str) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(new RegExp("[\\u0300-\\u036f]", "g"), "");

  const escapeHtml = (str) =>
    str.replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[ch]));

  const matchFaq = (text) => {
    const normalized = normalize(text);
    return Object.keys(FAQ).find((key) =>
      FAQ[key].keywords.some((kw) => normalized.includes(kw))
    );
  };

  const openChatbot = () => {
    chatbot.classList.add("is-open");
    chatbotToggle.setAttribute("aria-expanded", "true");
    if (chatbotBadge) chatbotBadge.remove();
  };

  const closeChatbot = () => {
    chatbot.classList.remove("is-open");
    chatbotToggle.setAttribute("aria-expanded", "false");
  };

  const addMessage = (html, sender) => {
    const el = document.createElement("div");
    el.className = `chatbot-msg chatbot-msg-${sender}`;
    el.innerHTML = html;
    chatbotMessages.appendChild(el);
    if (chatbotScroll) chatbotScroll.scrollTop = chatbotScroll.scrollHeight;
    return el;
  };

  const answerWith = (answerHtml) => {
    const typing = addMessage('<span></span><span></span><span></span>', "bot");
    typing.classList.add("chatbot-msg-typing");

    setTimeout(() => {
      typing.remove();
      addMessage(answerHtml, "bot");
    }, 600);
  };

  chatbotToggle.addEventListener("click", () => {
    chatbot.classList.contains("is-open") ? closeChatbot() : openChatbot();
  });

  chatbotClose.addEventListener("click", closeChatbot);

  document.querySelectorAll("[data-faq]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const item = FAQ[chip.dataset.faq];
      if (!item) return;

      addMessage(escapeHtml(item.q), "user");
      answerWith(item.a);
    });
  });

  if (chatbotForm && chatbotInput) {
    chatbotForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const text = chatbotInput.value.trim();
      if (!text) return;

      addMessage(escapeHtml(text), "user");
      chatbotInput.value = "";

      const matchedKey = matchFaq(text);
      if (matchedKey) {
        answerWith(FAQ[matchedKey].a);
      } else {
        answerWith(
          'No estoy seguro de haber entendido, pero puedo ayudarte con servicios, precios, plazos, tecnologías o contacto. También podés escribirme directo por <a href="https://wa.me/527774524946" target="_blank" rel="noopener">WhatsApp</a>.'
        );
      }
    });
  }

  chatbotMessages.addEventListener("click", (event) => {
    if (event.target.tagName === "A") closeChatbot();
  });
}

