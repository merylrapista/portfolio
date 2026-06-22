/* ============================================
   BASTA_PORTFOLIO - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. THEME TOGGLE
  // ==========================================
  (function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const html = document.documentElement;

    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      html.setAttribute('data-theme', savedTheme);
    } else {
      html.setAttribute('data-theme', systemDark ? 'dark' : 'light');
    }

    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  })();

  // ==========================================
  // 2. MOBILE NAVIGATION
  // ==========================================
  (function initNav() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = navLinks.querySelectorAll('a');

    function toggleMenu() {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    function closeMenu() {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', toggleMenu);
    links.forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        closeMenu();
      }
    });
  })();

  // ==========================================
  // 3. HEADER SCROLL EFFECT
  // ==========================================
  (function initHeader() {
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    }, { passive: true });
  })();

  // ==========================================
  // 4. ACTIVE NAV LINK HIGHLIGHTING
  // ==========================================
  (function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    function updateActiveLink() {
      let current = '';
      const scrollPos = window.pageYOffset + 150;

      sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        if (scrollPos >= top && scrollPos < bottom) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
  })();

  // ==========================================
  // 5. SCROLL REVEAL ANIMATIONS (enhanced)
  // ==========================================
  (function initReveal() {
    const reveals = document.querySelectorAll('.reveal');

    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;

            // If this is a skill-category, stagger its tags after a brief pause
            if (el.classList.contains('skill-category')) {
              setTimeout(() => {
                el.classList.add('reveal-tags');
              }, 300);
            }

            el.classList.add('visible');
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    reveals.forEach(el => observer.observe(el));
  })();

  // ==========================================
  // 6. ANIMATED COUNTERS
  // ==========================================
  (function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-count'), 10);
            animateCounter(entry.target, target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(el => observer.observe(el));

    function animateCounter(element, target) {
      const steps = 60;
      const increment = target / steps;
      let step = 0;
      let current = 0;

      function update() {
        step++;
        current = Math.min(Math.round(increment * step), target);
        element.textContent = current + (target >= 20 ? '+' : '+');
        if (current < target) {
          requestAnimationFrame(update);
        }
      }

      update();
    }
  })();

  // ==========================================
  // 7. BACK TO TOP
  // ==========================================
  (function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

  // ==========================================
  // 8. PARALLAX HERO SHAPES (mouse follow)
  // ==========================================
  (function initParallax() {
    const shapes = document.querySelectorAll('.hero-shape');
    if (!shapes.length || window.innerWidth < 768) return;

    const hero = document.querySelector('.hero');

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      shapes.forEach((shape, i) => {
        const factor = (i + 1) * 10;
        const moveX = x * factor;
        const moveY = y * factor;
        shape.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });
    });

    hero.addEventListener('mouseleave', () => {
      shapes.forEach(shape => {
        shape.style.transform = 'translate(0, 0)';
        shape.style.transition = 'transform 0.5s ease';
      });
      setTimeout(() => {
        shapes.forEach(shape => {
          shape.style.transition = '';
        });
      }, 500);
    });
  })();

  // ==========================================
  // 9. CARD 3D TILT ON HOVER
  // ==========================================
  (function initCardTilt() {
    const cards = document.querySelectorAll('.project-card');
    if (!cards.length) return;

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform =
          `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        card.style.transition = 'transform 0.1s ease';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform =
          'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        card.style.transition = 'transform 0.4s ease';
      });
    });
  })();

  // ==========================================
  // 10. BUTTON RIPPLE EFFECT
  // ==========================================
  (function initButtonRipple() {
    const buttons = document.querySelectorAll('.btn:not(.btn-submit)');
    if (!buttons.length) return;

    buttons.forEach(btn => {
      btn.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        ripple.className = 'btn-ripple';
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
  })();

  // ==========================================
  // 11. TIMELINE DRAW ANIMATION
  // ==========================================
  (function initTimelineDraw() {
    const timelineLine = document.getElementById('timeline-line');
    if (!timelineLine) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            timelineLine.classList.add('drawn');
            observer.unobserve(timelineLine);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(timelineLine);
  })();

  // ==========================================
  // 12. CONTACT FORM (enhanced)
  // ==========================================
  (function initForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const toast = document.getElementById('toast');

    const fields = {
      name: {
        element: document.getElementById('name'),
        error: document.getElementById('name-error'),
        validate: (val) => val.trim().length >= 2
      },
      email: {
        element: document.getElementById('email'),
        error: document.getElementById('email-error'),
        validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())
      },
      subject: {
        element: document.getElementById('subject'),
        error: document.getElementById('subject-error'),
        validate: (val) => val.trim().length >= 3
      },
      message: {
        element: document.getElementById('message'),
        error: document.getElementById('message-error'),
        validate: (val) => val.trim().length >= 10
      }
    };

    function showToast(message, type = 'success') {
      toast.textContent = message;
      toast.className = `toast ${type} visible`;
      setTimeout(() => toast.classList.remove('visible'), 4000);
    }

    function validateField(field) {
      const isValid = field.validate(field.element.value);
      const showError = !isValid && field.element.value.length > 0;
      field.element.classList.toggle('error', showError);
      field.error.classList.toggle('visible', showError);
      return isValid || field.element.value.length === 0;
    }

    Object.values(fields).forEach(field => {
      field.element.addEventListener('blur', () => validateField(field));
      field.element.addEventListener('input', () => {
        if (field.element.classList.contains('error')) {
          validateField(field);
        }
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      let isValid = true;
      Object.values(fields).forEach(field => {
        const fieldValid = field.validate(field.element.value);
        field.element.classList.toggle('error', !fieldValid);
        field.error.classList.toggle('visible', !fieldValid);
        if (!fieldValid) isValid = false;
      });

      if (!isValid) {
        showToast('Please fix the errors in the form.', 'error');
        return;
      }

      const submitBtn = form.querySelector('.btn-submit');

      submitBtn.disabled = true;
      submitBtn.classList.add('loading');

      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
        form.reset();
      } catch {
        showToast('Something went wrong. Please try again.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
      }
    });
  })();
});
