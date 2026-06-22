(function() {
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. THEME TOGGLE with transition
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
  // 2. MOBILE NAVIGATION with stagger
  // ==========================================
  (function initNav() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = navLinks.querySelectorAll('a');
    const body = document.body;

    function toggleMenu() {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen);
      body.style.overflow = isOpen ? 'hidden' : '';

      links.forEach((link, i) => {
        if (isOpen) {
          link.style.setProperty('--stagger-i', i);
          link.classList.add('nav-stagger');
        } else {
          link.classList.remove('nav-stagger');
        }
      });
    }

    function closeMenu() {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
      links.forEach(link => link.classList.remove('nav-stagger'));
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

    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.pageYOffset > 50);
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
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
      });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
  })();

  // ==========================================
  // 5. SCROLL REVEAL ANIMATIONS with blur
  // ==========================================
  (function initReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-scale');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;

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
  // 6. STAGGERED ITEM REVEAL for grids
  // ==========================================
  (function initStaggerReveal() {
    const containers = document.querySelectorAll('.skills-grid, .projects-grid, .stats');
    if (!containers.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const items = entry.target.children;
            Array.from(items).forEach((item, i) => {
              item.classList.add('reveal-item');
              setTimeout(() => {
                item.classList.add('revealed');
              }, 80 * i);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    containers.forEach(el => observer.observe(el));
  })();

  // ==========================================
  // 7. ANIMATED COUNTERS with ease-out
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

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function animateCounter(element, target) {
      const duration = 1500;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const current = Math.round(easedProgress * target);

        element.textContent = current + '+';

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    }
  })();

  // ==========================================
  // 8. BACK TO TOP
  // ==========================================
  (function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.pageYOffset > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

  // ==========================================
  // 9. PARALLAX HERO SHAPES (mouse follow)
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
        shape.style.transform = 'translate(' + (x * factor) + 'px, ' + (y * factor) + 'px)';
      });
    });

    hero.addEventListener('mouseleave', () => {
      shapes.forEach(shape => {
        shape.style.transition = 'transform 0.5s ease';
        shape.style.transform = 'translate(0, 0)';
      });
      setTimeout(() => {
        shapes.forEach(shape => {
          shape.style.transition = '';
        });
      }, 500);
    });
  })();

  // ==========================================
  // 10. CARD 3D TILT WITH SPOTLIGHT
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
          'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-6px)';
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
  // 11. MAGNETIC BUTTON EFFECT
  // ==========================================
  (function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    if (!buttons.length) return;

    buttons.forEach(btn => {
      let bounds = btn.getBoundingClientRect();
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;
      let currentX = 0;
      let currentY = 0;
      let isHovering = false;
      let rafId;

      function lerp(start, end, factor) {
        return start + (end - start) * factor;
      }

      function animate() {
        if (!isHovering && Math.abs(currentX - targetX) < 0.1 && Math.abs(currentY - targetY) < 0.1) {
          btn.style.transform = '';
          return;
        }
        currentX = lerp(currentX, targetX, 0.15);
        currentY = lerp(currentY, targetY, 0.15);
        const scale = isHovering ? 1.03 : 1;
        btn.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
        rafId = requestAnimationFrame(animate);
      }

      btn.addEventListener('mouseenter', () => {
        bounds = btn.getBoundingClientRect();
        isHovering = true;
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(animate);
      });

      btn.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        targetX = (mouseX - bounds.left - bounds.width / 2) * 0.3;
        targetY = (mouseY - bounds.top - bounds.height / 2) * 0.3;
      });

      btn.addEventListener('mouseleave', () => {
        isHovering = false;
        targetX = 0;
        targetY = 0;
      });
      
      window.addEventListener('resize', () => {
        bounds = btn.getBoundingClientRect();
      }, { passive: true });
    });
  })();

  // ==========================================
  // 12. BUTTON RIPPLE EFFECT
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
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
  })();

  // ==========================================
  // 13. TIMELINE DRAW ANIMATION
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
  // 14. CONTACT FORM (enhanced)
  // ==========================================
  (function initForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const toast = document.getElementById('toast');

    const fields = {
      name: {
        element: document.getElementById('name'),
        error: document.getElementById('name-error'),
        validate: function(val) { return val.trim().length >= 2; }
      },
      email: {
        element: document.getElementById('email'),
        error: document.getElementById('email-error'),
        validate: function(val) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()); }
      },
      subject: {
        element: document.getElementById('subject'),
        error: document.getElementById('subject-error'),
        validate: function(val) { return val.trim().length >= 3; }
      },
      message: {
        element: document.getElementById('message'),
        error: document.getElementById('message-error'),
        validate: function(val) { return val.trim().length >= 10; }
      }
    };

    function showToast(message, type) {
      type = type || 'success';
      toast.textContent = message;
      toast.className = 'toast ' + type + ' visible';
      setTimeout(function() { toast.classList.remove('visible'); }, 4000);
    }

    function validateField(field) {
      var isValid = field.validate(field.element.value);
      var showError = !isValid && field.element.value.length > 0;
      field.element.classList.toggle('error', showError);
      field.error.classList.toggle('visible', showError);
      return isValid || field.element.value.length === 0;
    }

    Object.keys(fields).forEach(function(key) {
      var field = fields[key];
      field.element.addEventListener('blur', function() { validateField(field); });
      field.element.addEventListener('input', function() {
        if (field.element.classList.contains('error')) {
          validateField(field);
        }
      });
    });

    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      var isValid = true;
      Object.keys(fields).forEach(function(key) {
        var field = fields[key];
        var fieldValid = field.validate(field.element.value);
        field.element.classList.toggle('error', !fieldValid);
        field.error.classList.toggle('visible', !fieldValid);
        if (!fieldValid) isValid = false;
      });

      if (!isValid) {
        showToast('Please fix the errors in the form.', 'error');
        return;
      }

      var submitBtn = form.querySelector('.btn-submit');

      submitBtn.disabled = true;
      submitBtn.classList.add('loading');

      try {
        await new Promise(function(resolve) { setTimeout(resolve, 1500); });
        showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
        form.reset();
      } catch (_) {
        showToast('Something went wrong. Please try again.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
      }
    });
  })();

  // ==========================================
  // 15. ADVANCED SCROLL EFFECTS (Text Scrub & Sticky Stack)
  // ==========================================
  (function initAdvancedScroll() {
    const scrubs = document.querySelectorAll('.text-scrub');
    const stackCards = document.querySelectorAll('.projects-grid.sticky-stack .project-card');
    
    // We use a ticking mechanism to prevent layout thrashing
    let ticking = false;

    function update() {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Text scrub logic
      scrubs.forEach(el => {
        const rect = el.getBoundingClientRect();
        const elementTop = rect.top + scrollY;
        const start = elementTop - windowHeight + (rect.height * 0.5);
        const end = elementTop - (windowHeight * 0.4);
        
        if (scrollY > start && scrollY < end) {
          let progress = (scrollY - start) / (end - start);
          el.style.opacity = Math.max(0.1, progress);
        } else if (scrollY >= end) {
          el.style.opacity = 1;
        } else {
          el.style.opacity = 0.1;
        }
      });

      // Sticky Stack logic
      stackCards.forEach((card, i) => {
        if (i === stackCards.length - 1) return; 
        const nextCard = stackCards[i + 1];
        if (!nextCard) return;
        
        const rect = nextCard.getBoundingClientRect();
        const startTrigger = windowHeight; 
        const endTrigger = windowHeight * 0.15; 
        
        if (rect.top <= startTrigger && rect.top >= endTrigger) {
          let progress = 1 - ((rect.top - endTrigger) / (startTrigger - endTrigger));
          let scale = 1 - (progress * 0.08); 
          let opacity = 1 - (progress * 0.5); 
          card.style.transform = `scale(${scale})`;
          card.style.opacity = opacity;
        } else if (rect.top < endTrigger) {
          card.style.transform = `scale(0.92)`;
          card.style.opacity = 0.5;
        } else {
          card.style.transform = `scale(1)`;
          card.style.opacity = 1;
        }
      });
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    if (scrubs.length || stackCards.length) {
      window.addEventListener('scroll', onScroll, { passive: true });
      update();
    }
  })();

  // ==========================================
  // 15.B INTERACTIVE MOBILE SIMULATOR
  // ==========================================
  (function initMobileSimulator() {
    const simulatorContainer = document.querySelector('.simulator-sticky-container');
    if (!simulatorContainer) return;

    const cards = document.querySelectorAll('.project-card');
    const screens = document.querySelectorAll('.sim-screen');
    const welcomeScreen = document.getElementById('screen-welcome');

    // IntersectionObserver to auto-boot app as cards scroll into viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const project = entry.target.getAttribute('data-project');
          bootApp(project);
        }
      });
    }, {
      rootMargin: '-20% 0px -40% 0px',
      threshold: 0.2
    });

    cards.forEach(card => observer.observe(card));

    function bootApp(projectId) {
      if (!projectId) return;
      screens.forEach(screen => screen.classList.remove('active'));
      const targetScreen = document.getElementById(`screen-${projectId}`);
      if (targetScreen) {
        targetScreen.classList.add('active');
      } else {
        welcomeScreen.classList.add('active');
      }
    }

    // Interactive logic for FitTrack App
    (function setupFitTrack() {
      const startBtn = document.getElementById('fittrack-start-btn');
      const percentEl = document.getElementById('fittrack-percentage');
      const caloriesEl = document.getElementById('fittrack-calories');
      const ring = document.querySelector('.activity-rings');
      let timer = null;
      let count = 0;

      startBtn.addEventListener('click', () => {
        if (timer) {
          clearInterval(timer);
          timer = null;
          startBtn.textContent = 'Start Session';
          startBtn.style.backgroundColor = '';
          ring.classList.remove('animating');
        } else {
          startBtn.textContent = 'Stop Session';
          startBtn.style.backgroundColor = 'var(--color-secondary)';
          ring.classList.add('animating');
          timer = setInterval(() => {
            count = (count + 1) % 101;
            percentEl.textContent = `${count}%`;
            caloriesEl.textContent = Math.round(120 + count * 2.8);
          }, 100);
        }
      });
    })();

    // Interactive logic for ShopFlow App
    (function setupShopFlow() {
      const addBtns = document.querySelectorAll('.prod-add-btn');
      const cartCountEl = document.getElementById('shopflow-cart-count');
      const checkoutBtn = document.getElementById('shopflow-checkout-btn');
      let count = 0;

      addBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          count++;
          cartCountEl.textContent = count;
          
          // Micro scale animation
          cartCountEl.style.transform = 'scale(1.4)';
          setTimeout(() => cartCountEl.style.transform = '', 150);
        });
      });

      checkoutBtn.addEventListener('click', () => {
        if (count === 0) {
          alert('Your cart is empty! Add items first.');
          return;
        }
        alert(`Order placed successfully for ${count} items!`);
        count = 0;
        cartCountEl.textContent = count;
      });
    })();

    // Interactive logic for Socially App
    (function setupSocially() {
      const chatFeed = document.getElementById('socially-chat-feed');
      const tags = document.querySelectorAll('.preset-tag');

      tags.forEach(tag => {
        tag.addEventListener('click', () => {
          const userMsg = tag.textContent;
          const answer = tag.getAttribute('data-answer');

          // Append user message
          appendMsg(userMsg, 'outgoing');

          // Disable buttons temporarily to simulate typing
          tags.forEach(t => t.disabled = true);

          setTimeout(() => {
            appendMsg(answer, 'incoming');
            tags.forEach(t => t.disabled = false);
          }, 800);
        });
      });

      function appendMsg(text, sender) {
        const bubble = document.createElement('div');
        bubble.className = `message ${sender}`;
        bubble.textContent = text;
        chatFeed.appendChild(bubble);
        chatFeed.scrollTop = chatFeed.scrollHeight;
      }
    })();

    // Interactive logic for WeatherNow App
    (function setupWeatherNow() {
      const tabBtns = document.querySelectorAll('.weather-tab-btn');
      const iconEl = document.getElementById('weathernow-icon');
      const tempEl = document.getElementById('weathernow-temp');
      const cityEl = document.getElementById('weathernow-city');

      tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          tabBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const data = JSON.parse(btn.getAttribute('data-weather'));
          cityEl.textContent = data.city;
          tempEl.textContent = data.temp;
          iconEl.textContent = data.icon;
          
          // Quick bounce effect
          iconEl.style.transform = 'scale(1.3) translateY(-5px)';
          setTimeout(() => iconEl.style.transform = '', 300);
        });
      });
    })();
  })();

  // ==========================================
  // 15.C PROJECT DETAIL SIDE DRAWER
  // ==========================================
  (function initProjectDrawer() {
    const overlay = document.getElementById('project-drawer-overlay');
    const drawer = document.getElementById('project-drawer');
    const closeBtn = document.querySelector('.drawer-close');
    const contentBody = document.getElementById('drawer-content-body');
    const triggers = document.querySelectorAll('.view-project-btn');

    const projectData = {
      fittrack: {
        title: 'FitTrack',
        platform: 'React Native App',
        platformClass: 'react-native',
        description: 'FitTrack is a cross-platform fitness monitoring platform delivering real-time metrics tracking, automated workout recommendations, and smooth native experiences.',
        challenges: [
          'Integrating Bluetooth Low Energy (BLE) APIs across both Android and iOS operating systems with zero data lag.',
          'Optimizing render tree performance for continuous animated workout rings using React Native Reanimated.'
        ],
        features: [
          'Automatic workout logging & sensor calibration.',
          'Comprehensive statistics dashboards with SVG line chart visualizations.',
          'Real-time heart rate mapping and calorie burn optimization calculations.'
        ],
        tech: ['React Native', 'TypeScript', 'Redux Toolkit', 'Reanimated', 'Firebase']
      },
      shopflow: {
        title: 'ShopFlow',
        platform: 'Flutter E-Commerce App',
        platformClass: 'flutter',
        description: 'ShopFlow is an editorial e-commerce mobile application featuring highly optimized state machines, localized local cache indexing, and custom payment pipelines.',
        challenges: [
          'Managing complex cart states and optimistic stock validation asynchronously.',
          'Creating responsive cross-platform layouts that scale across small mobile screens up to large tablet resolutions.'
        ],
        features: [
          'Gesture-based product checkout experience with tactile haptic feedback.',
          'Automatic currency conversions and offline capabilities.',
          'Fully localized payment integrations via Stripe SDK.'
        ],
        tech: ['Flutter', 'Dart', 'BLoC Pattern', 'Stripe SDK', 'SQLite', 'Hive Cache']
      },
      socially: {
        title: 'Socially',
        platform: 'React Native Messaging App',
        platformClass: 'react-native',
        description: 'Socially is a real-time messaging mobile client with secure end-to-end encryption protocols, dynamic group feeds, and custom image compression layers.',
        challenges: [
          'Achieving sub-100ms messaging delivery latency under high concurrent user load.',
          'Managing image processing tasks on the device background threads to prevent main UI thread blockage.'
        ],
        features: [
          'WebSocket client client connection management.',
          'Push notifications integrated directly with Apple APNs and Firebase Cloud Messaging.',
          'Encrypted SQLite local database for offline history retention.'
        ],
        tech: ['React Native', 'GraphQL', 'Socket.io Client', 'AWS S3', 'Cognito Auth']
      },
      weathernow: {
        title: 'WeatherNow',
        platform: 'Flutter Weather App',
        platformClass: 'flutter',
        description: 'WeatherNow is a clean weather application focusing on dynamic background paints, smooth slider gestures, and highly localized radar forecasting information.',
        challenges: [
          'Rendering fluid particle simulations representing active rain, snow, or wind dynamically without dropping UI frames.',
          'Parsing coordinate location tracking details while matching against multiple weather API aggregators.'
        ],
        features: [
          'Dynamic visual canvas background states updating on city selection.',
          'Hyperlocal coordinates lookup using GPS sensor inputs.',
          'Multi-city forecast monitoring panels.'
        ],
        tech: ['Flutter', 'Dart', 'Custom Painters', 'Geolocator API', 'OpenWeather API']
      }
    };

    function openDrawer(projectId) {
      const data = projectData[projectId];
      if (!data) return;

      const techTagsHTML = data.tech.map(t => `<span class="drawer-tech-tag">${t}</span>`).join('');
      const featuresHTML = data.features.map(f => `<li>${f}</li>`).join('');
      const challengesHTML = data.challenges.map(c => `<li>${c}</li>`).join('');

      contentBody.innerHTML = `
        <h2 class="drawer-title">${data.title}</h2>
        <span class="drawer-platform ${data.platformClass}">${data.platform}</span>
        <p class="drawer-desc">${data.description}</p>
        
        <div class="drawer-section">
          <h4 class="drawer-section-title">Key Features</h4>
          <ul class="drawer-list">
            ${featuresHTML}
          </ul>
        </div>

        <div class="drawer-section">
          <h4 class="drawer-section-title">Technical Challenges Solved</h4>
          <ul class="drawer-list">
            ${challengesHTML}
          </ul>
        </div>

        <div class="drawer-section">
          <h4 class="drawer-section-title">Technologies Used</h4>
          <div class="drawer-tech-tags">
            ${techTagsHTML}
          </div>
        </div>
      `;

      overlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock background scroll
    }

    function closeDrawer() {
      overlay.classList.remove('active');
      document.body.style.overflow = ''; // Unlock background scroll
    }

    triggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const projectId = trigger.getAttribute('data-project');
        openDrawer(projectId);
      });
    });

    closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeDrawer();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        closeDrawer();
      }
    });
  })();

  // ==========================================
  // 16. AESTHETIC REDESIGN (Cursor Glow & Marquee)
  // ==========================================
  (function initAestheticRedesign() {
    // Cursor Glow
    const glow = document.querySelector('.cursor-glow');
    if (glow) {
      window.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
          glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
        });
      }, { passive: true });
    }

    // Marquee Clone
    const marqueeContent = document.querySelector('.marquee-content');
    if (marqueeContent) {
      const clone = marqueeContent.innerHTML;
      marqueeContent.innerHTML = clone + clone;
    }
  })();

});

})();