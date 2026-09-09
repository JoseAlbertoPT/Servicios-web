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
  const chatbotBadge = document.getElementById("chatbotBadge");

  const FAQ = {
    servicios: {
      q: "¿Qué servicios ofreces?",
      a: 'Ofrezco desarrollo de sitios web responsivos, sistemas administrativos (ABM/CRUD) y mantenimiento continuo. Mirá el detalle en <a href="#servicios">Servicios</a>.',
    },
    precio: {
      q: "¿Cuánto cuesta un sitio web?",
      a: "Depende del alcance del proyecto (páginas, funcionalidades, integraciones). Contame qué necesitás por WhatsApp y te paso una cotización sin compromiso.",
    },
    tecnologias: {
      q: "¿Qué tecnologías usas?",
      a: 'Trabajo con Java, PHP, Python, JavaScript, HTML, CSS y Bootstrap, entre otras. Podés ver el detalle completo en <a href="#habilidades">Habilidades</a>.',
    },
    contacto: {
      q: "¿Cómo te contacto?",
      a: 'Por WhatsApp al (+52) 777 452 4946, por correo a albertprztrrs@gmail.com, o desde la sección <a href="#contacto">Contacto</a>.',
    },
    portafolio: {
      q: "Ver portafolio",
      a: 'Tengo varios proyectos documentados, como un sistema de emergencias en tiempo real y más. Mirá el <a href="#portafolio">Portafolio</a> completo.',
    },
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
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return el;
  };

  chatbotToggle.addEventListener("click", () => {
    chatbot.classList.contains("is-open") ? closeChatbot() : openChatbot();
  });

  chatbotClose.addEventListener("click", closeChatbot);

  document.querySelectorAll("[data-faq]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const item = FAQ[chip.dataset.faq];
      if (!item) return;

      addMessage(item.q, "user");

      const typing = addMessage('<span></span><span></span><span></span>', "bot");
      typing.classList.add("chatbot-msg-typing");

      setTimeout(() => {
        typing.remove();
        addMessage(item.a, "bot");
      }, 600);
    });
  });

  chatbotMessages.addEventListener("click", (event) => {
    if (event.target.tagName === "A") closeChatbot();
  });
}

