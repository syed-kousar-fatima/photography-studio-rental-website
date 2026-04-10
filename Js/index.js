'use strict';
(function initTheme() {
  const stored = localStorage.getItem('fs-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();

document.addEventListener('DOMContentLoaded', () => {


  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const html = document.documentElement;
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('fs-theme', next);
    });
  }


  const footerYear = document.getElementById('footerYear');
  if (footerYear) footerYear.textContent = new Date().getFullYear();


  const header = document.getElementById('site-header');
  const handleScroll = () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();


  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], footer[id]');

  const updateActiveNav = () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop <= 80) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', updateActiveNav, { passive: true });


  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');

  const closeMobileMenu = () => {
    if (!hamburgerBtn || !mobileNav) return;
    hamburgerBtn.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
  };

  if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = hamburgerBtn.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        hamburgerBtn.classList.add('open');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        mobileNav.classList.add('open');
        mobileNav.setAttribute('aria-hidden', 'false');
      }
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

  
    document.addEventListener('click', (e) => {
      if (!header?.contains(e.target)) {
        closeMobileMenu();
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  if (!reducedMotion) {
    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
      el.classList.add('revealed');
    });
  }

  const counters = document.querySelectorAll('.stat-number[data-target]');

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    let current = 0;

    const tick = () => {
      current += increment;
      if (current >= target) {
        el.textContent = target;
      } else {
        el.textContent = Math.floor(current);
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => counterObserver.observe(counter));

  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      galleryItems.forEach(item => {
        const category = item.dataset.category;

        if (filter === 'all' || category === filter) {
          item.classList.remove('hidden');
          item.style.animation = 'galleryReveal 0.4s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });


  const billingToggle = document.getElementById('billingToggle');
  const priceValues = document.querySelectorAll('.price-value');
  const pricePeriods = document.querySelectorAll('.price-period');
  const toggleLabelHourly = document.getElementById('toggleLabelHourly');
  const toggleLabelDaily = document.getElementById('toggleLabelDaily');

  if (billingToggle) {
    billingToggle.addEventListener('change', () => {
      const isDaily = billingToggle.checked;

      priceValues.forEach(el => {
        const hourly = el.dataset.hourly;
        const daily = el.dataset.daily;

  
        el.style.transform = 'translateY(-10px)';
        el.style.opacity = '0';

        setTimeout(() => {
          el.textContent = isDaily ? daily : hourly;
          el.style.transform = 'translateY(0)';
          el.style.opacity = '1';
        }, 200);

        el.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
      });

      pricePeriods.forEach(el => {
        el.textContent = isDaily ? '/day' : '/hr';
      });

      if (toggleLabelHourly) {
        toggleLabelHourly.style.color = isDaily ? '' : 'var(--brand-primary)';
        toggleLabelHourly.style.fontWeight = isDaily ? '' : '700';
      }

      if (toggleLabelDaily) {
        toggleLabelDaily.style.color = isDaily ? 'var(--brand-primary)' : '';
        toggleLabelDaily.style.fontWeight = isDaily ? '700' : '';
      }
    });
  }


  const carousel = document.getElementById('testimonialCarousel');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('carouselDots');

  if (carousel && prevBtn && nextBtn) {
    const cards = Array.from(carousel.querySelectorAll('.testimonial-card'));
    let currentIndex = 0;
    let autoPlayTimer = null;

    const getVisibleCount = () => {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    };

    let visibleCount = getVisibleCount();
    const totalGroups = () => Math.ceil(cards.length / visibleCount);

    
    const buildDots = () => {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const count = totalGroups();
      for (let i = 0; i < count; i++) {
        const dot = document.createElement('button');
        dot.className = `carousel-dot${i === currentIndex ? ' active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide group ${i + 1}`);
        dot.addEventListener('click', () => goToGroup(i));
        dotsContainer.appendChild(dot);
      }
    };

    const updateDots = () => {
      if (!dotsContainer) return;
      dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    };

    const goToGroup = (index) => {
      const count = totalGroups();
      currentIndex = ((index % count) + count) % count;

      
      cards.forEach((card, i) => {
        const start = currentIndex * visibleCount;
        const end = start + visibleCount;
        card.style.display = (i >= start && i < end) ? '' : 'none';
      });

      updateDots();
    };

    
    const initCarousel = () => {
      visibleCount = getVisibleCount();

   
      carousel.style.gridTemplateColumns = `repeat(${visibleCount}, 1fr)`;

 
      if (currentIndex >= totalGroups()) currentIndex = 0;

      buildDots();
      goToGroup(currentIndex);
    };

    prevBtn.addEventListener('click', () => {
      goToGroup(currentIndex - 1);
      resetAutoPlay();
    });

    nextBtn.addEventListener('click', () => {
      goToGroup(currentIndex + 1);
      resetAutoPlay();
    });

    
    const startAutoPlay = () => {
      autoPlayTimer = setInterval(() => {
        goToGroup(currentIndex + 1);
      }, 4500);
    };

    const stopAutoPlay = () => {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    };

    const resetAutoPlay = () => {
      stopAutoPlay();
      startAutoPlay();
    };

  
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);

    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goToGroup(currentIndex + 1);
        } else {
          goToGroup(currentIndex - 1);
        }
        resetAutoPlay();
      }
    }, { passive: true });

 
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initCarousel, 200);
    });

    
    initCarousel();
    startAutoPlay();
  }


  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('.newsletter-input');
      const btn = newsletterForm.querySelector('.newsletter-btn');
      if (!input || !btn) return;

      const email = input.value.trim();
      if (!email || !email.includes('@')) {
        input.style.borderColor = '#e85d4a';
        setTimeout(() => { input.style.borderColor = ''; }, 2000);
        return;
      }

      const original = btn.textContent;
      btn.textContent = '✓ Subscribed!';
      btn.disabled = true;
      btn.style.background = '#3daa78';
      input.value = '';

      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        btn.style.background = '';
      }, 3500);
    });
  }


  if (!document.querySelector('#gallery-keyframes')) {
    const style = document.createElement('style');
    style.id = 'gallery-keyframes';
    style.textContent = `
      @keyframes galleryReveal {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }

  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    link.addEventListener('click', function() {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

      const href = this.getAttribute('href');
      document.querySelectorAll(`.nav-link[href="${href}"]`).forEach(l => {
        l.classList.add('active');
      });
    });
  });


  const serviceCards = document.querySelectorAll('.service-card');
  let tappedCard = null;

  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      if (window.matchMedia('(hover: none)').matches) {
        if (tappedCard && tappedCard !== card) {
          tappedCard.querySelector('.service-card-inner').style.transform = '';
        }
        const inner = card.querySelector('.service-card-inner');
        const isFlipped = inner.style.transform === 'rotateY(180deg)';
        inner.style.transform = isFlipped ? '' : 'rotateY(180deg)';
        tappedCard = isFlipped ? null : card;
      }
    });
  });

  console.log('%c📸 FrameSpace Studio loaded', 'color: #C8973A; font-weight: bold; font-size: 14px;');
});



document.addEventListener("DOMContentLoaded", () => {
  const rtlToggle = document.getElementById("rtlToggle");
  const rtlText = rtlToggle.querySelector(".rtl-text");
  const html = document.documentElement;

  // Load saved direction
  const savedDir = localStorage.getItem("dir") || "ltr";
  html.setAttribute("dir", savedDir);

  // Set initial button text
  rtlText.textContent = savedDir.toUpperCase();

  rtlToggle.addEventListener("click", () => {
    const currentDir = html.getAttribute("dir");
    const newDir = currentDir === "ltr" ? "rtl" : "ltr";

    html.setAttribute("dir", newDir);
    localStorage.setItem("dir", newDir);

    // Update button text
    rtlText.textContent = newDir.toUpperCase();
  });
});
