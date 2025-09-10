// ===== VARIABLES GLOBALES =====
const texts = [
  "Desarrolladora Web Frontend 💻",
  "Apasionada por el Diseño 🎨", 
  "Estudiante de Programación 📚",
  "Creativa Digital ✨"
];
let currentTextIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', () => {
  initializeAnimations();
  initializeTypingEffect();
  initializeScrollAnimations();
  initializeNavigation();
  initializeTechBars();
  initializeCounters();
  initializeSparkles();
  initHeroDarkenOnScroll();
});

// === OSCURECER HERO SEGÚN SCROLL ===
function initHeroDarkenOnScroll(){
  const hero = document.getElementById('hero');
  const overlay = hero ? hero.querySelector('.hero-dim-overlay') : null;
  if(!hero || !overlay) return;

  const setDim = () => {
    const heroRectTop = hero.getBoundingClientRect().top + window.scrollY;
    const heroHeight = hero.offsetHeight || 1;
    const scrolled = Math.max(0, window.scrollY - heroRectTop);

    // Progreso de 0 a 1 dentro del hero (ajusta el 0.9 para que alcance el máximo antes de salir del hero)
    const progress = Math.min(1, scrolled / (heroHeight * 0.9));

    // Opacidad máxima (ajusta a gusto: 0.5 - 0.75 se ve bien)
    const maxOpacity = window.matchMedia('(max-width: 768px)').matches ? 0.55 : 0.65;
    const opacity = +(progress * maxOpacity).toFixed(3);

    // Variable CSS global para animar la capa
    document.documentElement.style.setProperty('--hero-dim', opacity);
  };

  // Actualiza en scroll y resize
  window.addEventListener('scroll', setDim, { passive: true });
  window.addEventListener('resize', setDim);
  // primer cálculo
  setDim();
}

// Llama a la función cuando cargue el DOM (tienes ya un DOMContentLoaded, añade la llamada ahí)
document.addEventListener('DOMContentLoaded', () => {
  // ...lo que ya tienes...
  initHeroDarkenOnScroll(); // ← activar oscurecimiento
});


// ===== TYPING EFFECT =====
function initializeTypingEffect() {
  const typingElement = document.querySelector('.typing-text');
  if (!typingElement) return;

  function typeText() {
    const currentText = texts[currentTextIndex];
    
    if (isDeleting) {
      typingElement.textContent = currentText.substring(0, currentCharIndex - 1);
      currentCharIndex--;
    } else {
      typingElement.textContent = currentText.substring(0, currentCharIndex + 1);
      currentCharIndex++;
    }

    // Velocidad de tipeo
    let typeSpeed = isDeleting ? 100 : 150;

    if (!isDeleting && currentCharIndex === currentText.length) {
      // Pausa al final del texto
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && currentCharIndex === 0) {
      isDeleting = false;
      currentTextIndex = (currentTextIndex + 1) % texts.length;
      typeSpeed = 500;
    }

    setTimeout(typeText, typeSpeed);
  }

  typeText();
}

// ===== NAVEGACIÓN =====
function initializeNavigation() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const scrollBtn = document.getElementById('scroll-btn');

  // Efecto scroll en navbar
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.style.background = 'rgba(255, 255, 255, 0.98)';
      navbar.style.boxShadow = '0 5px 20px rgba(255, 107, 157, 0.2)';
    } else {
      navbar.style.background = 'rgba(255, 255, 255, 0.95)';
      navbar.style.boxShadow = 'none';
    }
  });

  // Mobile menu toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Cerrar menu al hacer click en un link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // Scroll suave para todos los links internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Botón scroll principal
  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
      document.getElementById('about').scrollIntoView({ 
        behavior: 'smooth' 
      });
    });
  }
}

// ===== ANIMACIONES DE SCROLL =====
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        
        // Añadir delay escalonado para múltiples elementos
        if (entry.target.classList.contains('tech-item')) {
          setTimeout(() => {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
          }, index * 100);
        }
        
        if (entry.target.classList.contains('project-card')) {
          setTimeout(() => {
            entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
          }, index * 200);
        }
      }
    });
  }, observerOptions);

  // Observar elementos
  document.querySelectorAll('.tech-item, .project-card, .stat-item, .about-image-wrapper').forEach(el => {
    observer.observe(el);
  });

  // Parallax effect para shapes
  window.addEventListener('scroll', throttle(updateParallax, 10));
}

function updateParallax() {
  const scrolled = window.pageYOffset;
  const shapes = document.querySelectorAll('.shape');
  
  shapes.forEach((shape, index) => {
    const speed = 0.1 + (index * 0.05);
    const yPos = scrolled * speed;
    shape.style.transform = `translateY(${yPos}px) rotate(${yPos * 0.5}deg)`;
  });
}

// ===== BARRAS DE PROGRESO TECNOLOGÍAS =====
function initializeTechBars() {
  const techItems = document.querySelectorAll('.tech-item');
  
  const techObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const levelBar = entry.target.querySelector('.level-bar');
        const level = levelBar.getAttribute('data-level');
        
        setTimeout(() => {
          levelBar.style.width = level + '%';
        }, 300);
      }
    });
  }, { threshold: 0.5 });

  techItems.forEach(item => {
    techObserver.observe(item);
    
    // Inicializar barras en 0%
    const levelBar = item.querySelector('.level-bar');
    if (levelBar) {
      levelBar.style.width = '0%';
    }
  });
}

// ===== CONTADORES ANIMADOS =====
function initializeCounters() {
  const counters = document.querySelectorAll('.stat-number');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  const duration = 2000;
  const increment = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    
    element.textContent = Math.floor(current);
    
    // Añadir efecto especial para 100%
    if (target === 100 && current >= 100) {
      element.textContent = '100%';
    }
  }, 16);
}

// ===== EFECTOS DE SPARKLES =====
function initializeSparkles() {
  let sparkleTimeout;
  
  document.addEventListener('mousemove', (e) => {
    clearTimeout(sparkleTimeout);
    sparkleTimeout = setTimeout(() => {
      if (Math.random() < 0.15) {
        createSparkle(e.clientX, e.clientY);
      }
    }, 50);
  });

  // Sparkles automáticos en elementos especiales
  setInterval(createRandomSparkles, 3000);
}

function createSparkle(x, y) {
  const sparkle = document.createElement('div');
  const size = Math.random() * 8 + 4;
  const colors = ['#ff6b9d', '#c44569', '#74b9ff', '#fd79a8', '#a8e6cf'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  sparkle.style.cssText = `
    position: fixed;
    left: ${x - size/2}px;
    top: ${y - size/2}px;
    width: ${size}px;
    height: ${size}px;
    background: ${color};
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    animation: sparkleFloat 1.5s ease-out forwards;
  `;
  
  document.body.appendChild(sparkle);
  
  setTimeout(() => {
    if (document.body.contains(sparkle)) {
      document.body.removeChild(sparkle);
    }
  }, 1500);
}

function createRandomSparkles() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  
  const rect = hero.getBoundingClientRect();
  if (rect.bottom < 0) return; // No crear si hero no está visible
  
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      createSparkle(x, y);
    }, i * 300);
  }
}

// ===== INICIALIZACIÓN DE ANIMACIONES =====
function initializeAnimations() {
  // Crear estilos para sparkles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes sparkleFloat {
      0% {
        transform: translateY(0) rotate(0deg) scale(1);
        opacity: 1;
      }
      50% {
        transform: translateY(-30px) rotate(180deg) scale(1.2);
        opacity: 0.8;
      }
      100% {
        transform: translateY(-60px) rotate(360deg) scale(0);
        opacity: 0;
      }
    }
    
    .animate-in {
      animation: fadeInUp 0.8s ease-out forwards !important;
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);

  // Animación de entrada para elementos del hero
  setTimeout(() => {
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((el, index) => {
      setTimeout(() => {
        el.style.animation = `fadeInUp 0.8s ease-out ${index * 0.2}s forwards`;
      }, index * 100);
    });
  }, 500);
}

// ===== UTILIDADES =====
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// ===== BOTÓN SCROLL TO TOP =====
function createScrollToTopButton() {
  const scrollBtn = document.createElement('button');
  scrollBtn.innerHTML = '🚀';
  scrollBtn.classList.add('scroll-to-top-btn');
  scrollBtn.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 60px;
    height: 60px;
    border: none;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff6b9d, #c44569);
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    opacity: 0;
    transform: translateY(100px);
    transition: all 0.3s ease;
    z-index: 1000;
    box-shadow: 0 10px 30px rgba(255, 107, 157, 0.4);
  `;
  
  document.body.appendChild(scrollBtn);
  
  // Mostrar/ocultar botón
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollBtn.style.opacity = '1';
      scrollBtn.style.transform = 'translateY(0)';
    } else {
      scrollBtn.style.opacity = '0';
      scrollBtn.style.transform = 'translateY(100px)';
    }
  });
  
  // Función scroll to top
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Efecto hover
  scrollBtn.addEventListener('mouseenter', () => {
    scrollBtn.style.transform = 'translateY(0) scale(1.1)';
  });
  
  scrollBtn.addEventListener('mouseleave', () => {
    scrollBtn.style.transform = 'translateY(0) scale(1)';
  });
}

// ===== EFECTOS ESPECIALES EN HOVER =====
document.addEventListener('DOMContentLoaded', () => {
  // Efecto de inclinación en project cards
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // Inicializar botón scroll to top
  createScrollToTopButton();
  
  // Efecto de partículas en el hero
  createHeroParticles();
});

// ===== PARTÍCULAS EN HERO =====
function createHeroParticles() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  
  const particlesContainer = document.createElement('div');
  particlesContainer.className = 'particles-container';
  particlesContainer.style.cssText = `
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  `;
  
  hero.appendChild(particlesContainer);
  
  // Crear partículas
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      createParticle(particlesContainer);
    }, i * 200);
  }
  
  // Crear nuevas partículas periódicamente
  setInterval(() => {
    if (particlesContainer.children.length < 15) {
      createParticle(particlesContainer);
    }
  }, 2000);
}

function createParticle(container) {
  const particle = document.createElement('div');
  const size = Math.random() * 6 + 2;
  const colors = ['#ff6b9d', '#c44569', '#74b9ff', '#a8e6cf', '#ffd93d'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  particle.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    background: ${color};
    border-radius: 50%;
    opacity: 0.6;
    left: ${Math.random() * 100}%;
    top: 100%;
    animation: floatUp ${10 + Math.random() * 10}s linear forwards;
  `;
  
  container.appendChild(particle);
  
  setTimeout(() => {
    if (container.contains(particle)) {
      container.removeChild(particle);
    }
  }, 20000);
}

// Añadir keyframes para partículas
const particleStyle = document.createElement('style');
particleStyle.textContent = `
  @keyframes floatUp {
    to {
      transform: translateY(-100vh) rotate(360deg);
      opacity: 0;
    }
  }
`;
document.head.appendChild(particleStyle);

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;
      
      // Crear el mailto link
      const mailtoLink = `mailto:valery@ejemplo.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`)}`;
      
      // Abrir el cliente de email
      window.location.href = mailtoLink;
      
      // Mostrar mensaje de confirmación
      const submitBtn = document.querySelector('.form-submit');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>¡Mensaje enviado!</span> <div class="btn-icon">✅</div>';
      submitBtn.style.background = 'linear-gradient(135deg, #a8e6cf, #88d8c0)';
      
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = 'linear-gradient(135deg, #ff6b9d, #c44569)';
        contactForm.reset();
      }, 3000);
    });
  }
});

const cards = document.querySelectorAll('.card');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, { threshold: 0.2 });

cards.forEach(card => observer.observe(card));
