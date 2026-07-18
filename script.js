document.addEventListener('DOMContentLoaded', () => {
  // === Navigation Elements ===
  const header = document.querySelector('.header');
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-links a');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section');

  // Offset header scroll effect page header
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.style.boxShadow = 'var(--shadow-md)';
      header.style.padding = '0';
      header.style.background = 'var(--bg-secondary)';
      header.style.borderBottomColor = 'var(--border-color)';
    } else {
      header.style.boxShadow = 'none';
      header.style.padding = '10px 0';
      header.style.background = 'var(--bg-nav)';
    }
  });

  // Toggle mobile navigation overlay
  if (mobileNavToggle && mobileNav) {
    mobileNavToggle.addEventListener('click', () => {
      mobileNavToggle.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : 'auto';
    });
  }

  // Close mobile navigation when click nav links
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileNavToggle.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = 'auto';
    });
  });

  // === Active Nav Link on Scroll ===
  const observeOptions = {
    root: null,
    rootMargin: '-30% 0px -50% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observeOptions);

  sections.forEach(section => {
    sectionObserver.observe(section);
  });

  // === Dark / Light Theme Toggle ===
  const themeToggleBtn = document.getElementById('theme-toggle');
  const rootElement = document.documentElement;

  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    rootElement.setAttribute('data-theme', savedTheme);
  } else {
    rootElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = rootElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      rootElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // === Advanced Custom Cursor Follower (with LERP) ===
  const cursorGlow = document.getElementById('cursor-glow');
  const cursorDot = document.getElementById('cursor-dot');
  
  let mouse = { x: 0, y: 0 }; // Actual mouse coords
  let glowPos = { x: 0, y: 0 }; // Interpolated glow coords
  const lerpFactor = 0.08; // Smoothing factor (lower = smoother/delayed)
  let isMoving = false;

  // Track coordinates
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    // Position dot directly (minimal lag)
    cursorDot.style.left = `${mouse.x}px`;
    cursorDot.style.top = `${mouse.y}px`;
    
    if (!isMoving) {
      cursorGlow.style.opacity = '1';
      cursorDot.style.opacity = '1';
      isMoving = true;
    }
  });

  // Smooth follow loops using requestAnimationFrame
  function updateGlowPosition() {
    glowPos.x += (mouse.x - glowPos.x) * lerpFactor;
    glowPos.y += (mouse.y - glowPos.y) * lerpFactor;
    
    cursorGlow.style.left = `${glowPos.x}px`;
    cursorGlow.style.top = `${glowPos.y}px`;
    
    requestAnimationFrame(updateGlowPosition);
  }
  
  if (cursorGlow && cursorDot) {
    requestAnimationFrame(updateGlowPosition);

    // Hide cursors when mouse leaves viewport
    document.addEventListener('mouseleave', () => {
      cursorGlow.style.opacity = '0';
      cursorDot.style.opacity = '0';
      isMoving = false;
    });

    // Expand cursor glow on hoverable items
    const hoverables = document.querySelectorAll('a, button, .theme-btn, .gallery-item, .timeline-content, .social-links a, input, textarea, .filter-btn, .tab-btn, .lightbox-close');
    
    hoverables.forEach(item => {
      item.addEventListener('mouseenter', () => {
        cursorGlow.style.transform = 'translate(-50%, -50%) scale(1.6)';
        cursorDot.style.transform = 'translate(-50%, -50%) scale(2.2)';
        cursorDot.style.backgroundColor = 'var(--text-primary)';
      });
      item.addEventListener('mouseleave', () => {
        cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorDot.style.backgroundColor = 'var(--accent)';
      });
    });
  }

  // === Dynamic Typewriter Animation ===
  const typewriterElement = document.getElementById('typewriter');
  const roles = [
    "Backend & Web Developer",
    "Desain Grafis",
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeAction() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      // Deleting characters
      typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // faster deletion
    } else {
      // Adding characters
      typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 120; // natural typing speed
    }

    // Checking states
    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 2000; // pause at the end of word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 600; // brief pause before next word
    }

    setTimeout(typeAction, typingSpeed);
  }

  if (typewriterElement) {
    // Start typing cycle
    setTimeout(typeAction, 1000);
  }

  // === 3D Perspective Card Tilt ===
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // Mouse relative X coordinate inside card
      const y = e.clientY - rect.top;  // Mouse relative Y coordinate inside card
      
      const width = rect.width;
      const height = rect.height;
      
      // Calculate rotation angles (-10deg to 10deg)
      const rotateX = ((y / height) - 0.5) * -12;
      const rotateY = ((x / width) - 0.5) * 12;

      // Apply transition transformation matrix state
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
      card.style.transition = 'none'; // Disable transition during tracking for responsiveness
    });

    card.addEventListener('mouseleave', () => {
      // Reset rotation with ease
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
  });

  // === Scroll Reveal Fades ===
  const revealElements = [];
  document.querySelectorAll('.gallery-item').forEach(el => revealElements.push(el));
  document.querySelectorAll('.timeline-item').forEach(el => revealElements.push(el));
  
  const additionalReveals = [
    document.querySelector('.about-content'),
    document.querySelector('.skills-container'),
    document.querySelector('.contact-info-panel'),
    document.querySelector('.contact-form-panel')
  ].filter(el => el !== null);
  
  additionalReveals.forEach(el => revealElements.push(el));

  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserverOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.05
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, revealObserverOptions);

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // === Contact Form Simulator ===
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !subject || !message) {
        showFeedback('Harap lengkapi seluruh formulir!', 'error');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Mengirim...';

      setTimeout(() => {
        showFeedback(`Terima kasih ${name}, pesan Anda berhasil dikirim!`, 'success');
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;

        setTimeout(() => {
          formFeedback.style.display = 'none';
        }, 5000);
      }, 1500);
    });
  }

  function showFeedback(msg, status) {
    formFeedback.textContent = msg;
    formFeedback.className = `form-feedback ${status}`;
    formFeedback.style.display = 'block';
  }

  // === Gallery Setup ===
  const galleryItems = document.querySelectorAll('.gallery-item');

  // === Lightbox Modal ===
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxClose = document.querySelector('.lightbox-close');

  if (lightboxModal && lightboxImg && lightboxCategory && lightboxTitle) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img').getAttribute('src');
        const imgAlt = item.querySelector('img').getAttribute('alt');
        const category = item.querySelector('.gallery-item-cat').textContent;
        const title = item.querySelector('.gallery-item-title').textContent;

        lightboxImg.setAttribute('src', imgSrc);
        lightboxImg.setAttribute('alt', imgAlt);
        lightboxCategory.textContent = category;
        lightboxTitle.textContent = title;

        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevents scrolling behind overlay
      });
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = 'auto';
    };

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // === Experience Tabs Switcher ===
  const tabBtns = document.querySelectorAll('.experience-tabs .tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from buttons
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.getAttribute('data-tab');

      // Hide all panes and show active pane
      tabPanes.forEach(pane => {
        pane.classList.remove('active');
        if (pane.getAttribute('id') === `tab-${targetTab}`) {
          pane.classList.add('active');
        }
      });
    });
  });
});
