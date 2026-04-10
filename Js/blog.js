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

  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');

  const toggleMobileMenu = () => {
    const isOpen = hamburgerBtn.classList.contains('open');
    if (isOpen) {
      hamburgerBtn.classList.remove('open');
      mobileNav.classList.remove('open');
    } else {
      hamburgerBtn.classList.add('open');
      mobileNav.classList.add('open');
    }
  };

  if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', toggleMobileMenu);
    
    
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }


  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const updateActiveNav = () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop <= 100) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').includes(current) && current !== '') {
        link.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', updateActiveNav, { passive: true });

});

  document.addEventListener('DOMContentLoaded', () => {

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

    
    const filterButtons = document.querySelectorAll('.filter-pill');
    const blogPosts = document.querySelectorAll('.post-card');

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-category');

        blogPosts.forEach(post => {
          if (category === 'all' || post.classList.contains(category)) {
            post.style.display = 'flex';
            setTimeout(() => { post.style.opacity = '1'; post.style.transform = 'scale(1)'; }, 10);
          } else {
            post.style.opacity = '0';
            post.style.transform = 'scale(0.9)';
            setTimeout(() => { post.style.display = 'none'; }, 300);
          }
        });
      });
    });

    
    const searchInput = document.getElementById('blogSearch');
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      blogPosts.forEach(post => {
        const title = post.querySelector('h3').innerText.toLowerCase();
        if (title.includes(term)) {
          post.style.display = 'flex';
        } else {
          post.style.display = 'none';
        }
      });
    });
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
