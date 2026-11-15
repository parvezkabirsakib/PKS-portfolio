/**
 * ==========================================================================
 * MASTER JAVASCRIPT: MD PARVEZ KABIR SAKIB - PREMIUM PORTFOLIO
 * Art Direction: Dark Luxury Creative Agency & Interactive Experience
 * Technology: Vanilla JavaScript (ES6+), Native Browser APIs
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ------------------------------------------------------------------------
  // 1. PAGE ENTRANCE & BODY STATE
  // ------------------------------------------------------------------------
  document.body.classList.add('page-loaded');

  // ------------------------------------------------------------------------
  // 2. GLOBAL NAVIGATION & MOBILE MENU
  // ------------------------------------------------------------------------
  const siteHeader = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Header scroll appearance
  const handleHeaderScroll = () => {
    if (!siteHeader) return;
    if (window.scrollY > 30) {
      siteHeader.classList.add('is-scrolled');
      siteHeader.style.padding = '0.35rem 0';
      siteHeader.style.background = 'rgba(11, 15, 25, 0.95)';
    } else {
      siteHeader.classList.remove('is-scrolled');
      siteHeader.style.padding = '0';
      siteHeader.style.background = 'var(--bg-glass-nav)';
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navToggle.classList.toggle('is-active');
      navMenu.classList.toggle('is-open');
      document.body.style.overflow = navMenu.classList.contains('is-open') ? 'hidden' : '';
    });

    // Close menu when clicking navigation link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('is-active');
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        navToggle.classList.remove('is-active');
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // Auto-highlight active navigation link based on current URL path
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else if (href !== currentPath) {
      link.classList.remove('active');
    }
  });

  // ------------------------------------------------------------------------
  // 3. SCROLL REVEAL SYSTEM (INTERSECTION OBSERVER)
  // ------------------------------------------------------------------------
  const revealItems = document.querySelectorAll('.reveal-item');
  if ('IntersectionObserver' in window && revealItems.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealItems.forEach(item => item.classList.add('is-revealed'));
  }

  // ------------------------------------------------------------------------
  // 4. TYPEWRITER ANIMATION (HOME PAGE)
  // ------------------------------------------------------------------------
  const typewriterElement = document.getElementById('typewriter-text');
  if (typewriterElement) {
    const phrases = [
      'Frontend Developer',
      'Web Designer',
      'WordPress Customizer',
      'YouTuber',
      'CSE Student'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeLoop = () => {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        charIndex--;
        typewriterElement.textContent = currentPhrase.substring(0, charIndex);
        typingSpeed = 50;
      } else {
        charIndex++;
        typewriterElement.textContent = currentPhrase.substring(0, charIndex);
        typingSpeed = 100;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        // Pause at full word
        isDeleting = true;
        typingSpeed = 1800;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 400;
      }

      setTimeout(typeLoop, typingSpeed);
    };

    setTimeout(typeLoop, 500);
  }

  // ------------------------------------------------------------------------
  // 5. ANIMATED STATISTICS COUNTERS (HOME PAGE)
  // ------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-target'), 10);
          if (isNaN(target)) return;

          let current = 0;
          const duration = 1600; // ms
          const stepTime = Math.max(Math.floor(duration / target), 30);

          const timer = setInterval(() => {
            current += 1;
            entry.target.textContent = current;
            if (current >= target) {
              entry.target.textContent = target;
              clearInterval(timer);
            }
          }, stepTime);

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => counterObserver.observe(num));
  }

  // ------------------------------------------------------------------------
  // 6. ACTIVITIES PAGE: SKILL METERS & PROGRESS BARS
  // ------------------------------------------------------------------------
  // A. Linear Progress Bars
  const progressFills = document.querySelectorAll('.progress-fill');
  if (progressFills.length > 0 && 'IntersectionObserver' in window) {
    const progressObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const width = entry.target.getAttribute('data-percentage') || '0';
          entry.target.style.width = `${width}%`;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    progressFills.forEach(bar => progressObserver.observe(bar));
  }

  // B. Circular Meters
  const circleMeters = document.querySelectorAll('.meter-progress');
  if (circleMeters.length > 0 && 'IntersectionObserver' in window) {
    const circleObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const percentage = parseInt(entry.target.getAttribute('data-percentage') || '0', 10);
          const circumference = 2 * Math.PI * 45; // r=45 => ~282.74
          const offset = circumference - (percentage / 100) * circumference;
          entry.target.style.strokeDashoffset = offset;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    circleMeters.forEach(meter => circleObserver.observe(meter));
  }

  // ------------------------------------------------------------------------
  // 7. DESKTOP INTERACTIVE MICRO-INTERACTIONS (MAGNETIC BUTTONS & 3D TILT)
  // ------------------------------------------------------------------------
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (!isTouchDevice && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
    // Magnetic Effect for primary buttons
    const magneticBtns = document.querySelectorAll('.btn-primary, .social-btn');
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });

    // Subtle 3D Tilt for Highlight Cards
    const tiltCards = document.querySelectorAll('.highlight-card, .project-row, .social-hub-card');
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -3.5;
        const rotateY = ((x - centerX) / centerX) * 3.5;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ------------------------------------------------------------------------
  // 8. VIDEO SHOWCASE & FILTER CONTROLS (VIDEO.HTML)
  // ------------------------------------------------------------------------
  // Video Filter Buttons (All Media / Academic / YouTube / Facebook)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const mediaSections = document.querySelectorAll('.video-media-section');
  if (filterBtns.length > 0 && mediaSections.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        mediaSections.forEach(section => {
          const category = section.getAttribute('data-category');
          if (filter === 'all' || filter === category) {
            section.style.display = '';
          } else {
            section.style.display = 'none';
          }
        });
      });
    });
  }
});
