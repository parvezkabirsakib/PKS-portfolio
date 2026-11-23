document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  //PRELOADER (HOMEPAGE)

  document.body.classList.add('page-loaded');

  const homePreloader = document.getElementById('home-preloader');
  if (homePreloader) {
    const isForcePreview = window.location.search.includes('loader=1') || window.location.search.includes('intro=1');
    const hasVisited = sessionStorage.getItem('pks_has_visited_homepage');

    if (hasVisited && !isForcePreview) {
      // User has already visited the homepage in this session: skip immediately
      homePreloader.style.display = 'none';
    } else {
      // First visit in current session: record session state
      sessionStorage.setItem('pks_has_visited_homepage', 'true');

      let hasDismissed = false;
      const hidePreloader = () => {
        if (hasDismissed) return;
        hasDismissed = true;
        homePreloader.classList.add('is-hidden');
        setTimeout(() => {
          homePreloader.style.display = 'none';
        }, 700);
      };

      //display duration (~1.8 seconds) for smooth aesthetic viewing
      const minDisplayTime = 1800;
      const startTime = performance.now();

      if (document.readyState === 'complete') {
        setTimeout(hidePreloader, minDisplayTime);
      } else {
        window.addEventListener('load', () => {
          const elapsed = performance.now() - startTime;
          const remaining = Math.max(0, minDisplayTime - elapsed);
          setTimeout(hidePreloader, remaining);
        });
        // Safety timeout fallback
        setTimeout(hidePreloader, 3200);
      }

      // Allow click anywhere to immediately skip if user wants
      homePreloader.addEventListener('click', hidePreloader);
    }

    // Helper exposed for easy re-testing via browser console: resetPreloader()
    window.resetPreloader = () => {
      sessionStorage.removeItem('pks_has_visited_homepage');
      window.location.reload();
    };
  }


  //  GLOBAL NAVIGATION & MOBILE MENU

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


  //SCROLL REVEAL SYSTEM (INTERSECTION OBSERVER)

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

 
  //SHATTER TYPE 3D GLASS ANIMATION (REACTBITS PRO - "MD PARVEZ KABIR")
 
  const shatterContainer = document.getElementById('shatter-name');
  if (shatterContainer && window.initShatterType) {
    window.initShatterType(shatterContainer, {
      text: 'MD Parvez Kabir',
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 800,
      letterSpacing: -0.02,
      lineHeight: 1.15,
      align: 'left',
      colors: ['#FFFFFF', '#FFFFFF'],
      accentColor: '#FF8C00', // Signature orange back & shard facets
      shardSize: 0.10, // Distinct glass fragments safely sized
      irregularity: 0.6, // Organic fracture lines
      crack: 0.75, // Glowing crack lines
      crackRadius: 1.2, // Controlled crack radius
      heal: 0.85, // Smooth crack lingering before healing
      shatter: true, // Shatter on click
      shatterRadius: 1.8, // Safely contained shatter coverage across name
      force: 1.4, // Controlled outward explosion that stays within safe margins
      spin: 1.5, // 3D tumbling of shards
      depth: 1.2, // 3D forward depth projection
      gravity: 0,
      reassemble: 1.6, // 1.6 seconds display time before reassembling
      stiffness: 0.55,
      glint: 0.9, // Specular glass reflections
      intro: 'assemble',
      introDuration: 1.6,
      autoplay: false,
      interactive: true
    });
  }


  //TYPEWRITER ANIMATION (HOME PAGE)
 
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


  //ANIMATED STATISTICS COUNTERS (HOME PAGE)
 
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

  
  //ACTIVITIES PAGE: SKILL METERS & PROGRESS BARS
 
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


  //DESKTOP INTERACTIVE MICRO-INTERACTIONS (MAGNETIC BUTTONS & 3D TILT)
 
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

    // Subtle 3D Tilt for Cards & Media
    const tiltCards = document.querySelectorAll('.highlight-card, .project-row, .social-hub-card, .video-lib-item, .academic-spotlight-card');
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


  // 8. VIDEO SHOWCASE & FILTER CONTROLS (VIDEO.HTML)
 
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
            section.querySelectorAll('.reveal-item').forEach(item => item.classList.add('is-revealed'));
          } else {
            section.style.display = 'none';
          }
        });
      });
    });
  }


  //AUREM-STYLE DUAL CUSTOM MOUSE CURSOR (SMOOTH TRAILING PHYSICS)

  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isFinePointer && !prefersReduced) {
    // 1. Create and inject the two cursor elements
    const cursorDot = document.createElement('div');
    cursorDot.className = 'custom-cursor-dot';
    cursorDot.setAttribute('aria-hidden', 'true');

    const cursorRing = document.createElement('div');
    cursorRing.className = 'custom-cursor-ring';
    cursorRing.setAttribute('aria-hidden', 'true');

    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorRing);
    document.body.classList.add('has-custom-cursor');

    // Coordinates
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isInitialized = false;

    // Movement listener (Instant inner dot)
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isInitialized) {
        ringX = mouseX;
        ringY = mouseY;
        isInitialized = true;
        cursorDot.classList.add('is-visible');
        cursorRing.classList.add('is-visible');
      }

      // Inner dot: instant mouse following without delay
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }, { passive: true });

    // Smooth Trailing Outer Ring Loop (LERP)
    const lerp = (start, end, factor) => start + (end - start) * factor;
    const lerpFactor = 0.15; // Smooth trailing physics

    const animateCursor = () => {
      if (isInitialized) {
        ringX = lerp(ringX, mouseX, lerpFactor);
        ringY = lerp(ringY, mouseY, lerpFactor);
        cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      requestAnimationFrame(animateCursor);
    };
    requestAnimationFrame(animateCursor);

    // Mouse leave / enter window
    document.addEventListener('mouseleave', () => {
      cursorDot.classList.remove('is-visible');
      cursorRing.classList.remove('is-visible');
    });

    document.addEventListener('mouseenter', () => {
      if (isInitialized) {
        cursorDot.classList.add('is-visible');
        cursorRing.classList.add('is-visible');
      }
    });

    window.addEventListener('blur', () => {
      cursorDot.classList.remove('is-visible');
      cursorRing.classList.remove('is-visible');
    });

    // Interactive elements hover detection (Event Delegation for best performance & dynamic elements)
    const interactiveSelector = 'a, button, .btn, .nav-link, .filter-btn, .social-btn, .video-lib-card, .video-lib-item, .highlight-card, .project-row, .timeline-card, .core-skill-card, .familiar-skill-card, .media-skill-card, .academic-spotlight-card, [role="button"], summary';

    document.addEventListener('mouseover', (e) => {
      const interactiveEl = e.target.closest(interactiveSelector);
      const textInputEl = e.target.closest('input, textarea, select');

      if (textInputEl) {
        cursorDot.classList.add('is-hidden');
        cursorRing.classList.add('is-hidden');
      } else if (interactiveEl) {
        cursorRing.classList.add('is-hovering');
        cursorDot.classList.add('is-hovering');
        cursorDot.classList.remove('is-hidden');
        cursorRing.classList.remove('is-hidden');
      }
    });

    document.addEventListener('mouseout', (e) => {
      const interactiveEl = e.target.closest(interactiveSelector);
      const textInputEl = e.target.closest('input, textarea, select');

      if (textInputEl) {
        cursorDot.classList.remove('is-hidden');
        cursorRing.classList.remove('is-hidden');
      }
      if (interactiveEl) {
        cursorRing.classList.remove('is-hovering');
        cursorDot.classList.remove('is-hovering');
      }
    });
  }


  //INTERACTIVE CONTACT FORM HANDLER (DELIVERY TO GMAIL)

  const contactForm = document.getElementById('portfolio-contact-form');
  if (contactForm) {
    const submitBtns = contactForm.querySelectorAll('.btn-send-message');
    const statusAlert = document.getElementById('form-status-alert');

    const setButtonState = (state) => {
      // state: 'default' | 'loading' | 'success'
      submitBtns.forEach(btn => {
        const btnContent = btn.querySelector('.btn-content');
        const btnLoading = btn.querySelector('.btn-loading');
        const btnSuccess = btn.querySelector('.btn-success-state');

        btn.classList.remove('is-loading', 'is-success');

        if (state === 'loading') {
          btn.disabled = true;
          btn.classList.add('is-loading');
          if (btnContent) btnContent.style.display = 'none';
          if (btnLoading) btnLoading.style.display = 'inline-flex';
          if (btnSuccess) btnSuccess.style.display = 'none';
        } else if (state === 'success') {
          btn.disabled = true;
          btn.classList.add('is-success');
          if (btnContent) btnContent.style.display = 'none';
          if (btnLoading) btnLoading.style.display = 'none';
          if (btnSuccess) btnSuccess.style.display = 'inline-flex';
        } else {
          btn.disabled = false;
          if (btnContent) btnContent.style.display = 'inline-flex';
          if (btnLoading) btnLoading.style.display = 'none';
          if (btnSuccess) btnSuccess.style.display = 'none';
        }
      });
    };

    contactForm.addEventListener('submit', (e) => {
      const name = (contactForm.querySelector('[name="name"]').value || '').trim();
      const email = (contactForm.querySelector('[name="email"]').value || '').trim();
      const subject = (contactForm.querySelector('[name="subject"]').value || '').trim();
      const message = (contactForm.querySelector('[name="message"]').value || '').trim();

      if (!name || !email || !subject || !message) {
        e.preventDefault();
        showStatus('<i class="fa-solid fa-circle-exclamation"></i> Please fill in all required fields before sending.', 'warning');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        e.preventDefault();
        showStatus('<i class="fa-solid fa-circle-exclamation"></i> Please enter a valid email address.', 'warning');
        return;
      }

      // Fast native browser POST targetted to hidden iframe (avoids slow AJAX / CORS hangs)
      setButtonState('loading');
      hideStatus();

      setTimeout(() => {
        setButtonState('success');

        showStatus(`
          <div style="display:flex; flex-direction:column; gap:0.4rem; width:100%;">
            <div style="display:flex; align-items:center; gap:0.5rem; font-weight:700;">
              <i class="fa-solid fa-circle-check" style="color:#22c55e; font-size:1.15rem;"></i>
              <span>Thank you! Your message was sent successfully.</span>
            </div>
            <div style="font-size:0.86rem; color:#cbd5e1; line-height:1.5;">
              Dispatched directly to <strong>parvezkabirsakib@gmail.com</strong>.
            </div>
          </div>
        `, 'success');

        contactForm.reset();

        setTimeout(() => {
          setButtonState('default');
        }, 3500);
      }, 1600);
    });

    function showStatus(htmlMsg, type) {
      if (!statusAlert) return;
      statusAlert.className = `form-status-alert status-${type}`;
      statusAlert.innerHTML = htmlMsg;
      statusAlert.style.display = 'flex';
      statusAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function hideStatus() {
      if (!statusAlert) return;
      statusAlert.style.display = 'none';
      statusAlert.innerHTML = '';
    }
  }
});
