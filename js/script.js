document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
      navLinks.classList.toggle('show');
    });

    document.addEventListener('click', function(event) {
      const isClickInsideNav = navLinks.contains(event.target);
      const isClickOnHamburger = hamburger.contains(event.target);

      if (!isClickInsideNav && !isClickOnHamburger && navLinks.classList.contains('show')) {
        navLinks.classList.remove('show');
      }
    });

    navLinks.querySelectorAll('a').forEach(function(item) {
      item.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          navLinks.classList.remove('show');
        }
      });
    });
  }

  window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && navLinks) {
      navLinks.classList.remove('show');
    }
  });

  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-links a').forEach(function(item) {
    const href = item.getAttribute('href');

    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      item.classList.add('active');
    } else if (href && currentPage.includes(href.replace('.html', ''))) {
      item.classList.add('active');
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(event) {
      const target = document.querySelector(this.getAttribute('href'));

      if (target) {
        event.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        setTimeout(function() {
          entry.target.style.transform = '';
        }, 650);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  const animatedElements = document.querySelectorAll('.porto-card, .profile-wrapper, .profile-hero, .preview-card, .timeline-panel');
  animatedElements.forEach(function(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
  });

  const filterButtons = document.querySelectorAll('.filter-pill');
  const portfolioCards = document.querySelectorAll('.porto-card');

  filterButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      const selectedFilter = button.dataset.filter;

      filterButtons.forEach(function(item) {
        item.classList.remove('active');
      });
      button.classList.add('active');

      portfolioCards.forEach(function(card) {
        const shouldShow = selectedFilter === 'all' || card.dataset.category === selectedFilter;
        card.classList.toggle('is-hidden', !shouldShow);

        if (shouldShow) {
          card.style.opacity = '1';
          card.style.transform = '';
        }
      });
    });
  });

  portfolioCards.forEach(function(card) {
    card.addEventListener('mousemove', function(event) {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;

      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });

  const statNumbers = document.querySelectorAll('[data-count]');
  const statObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting || entry.target.dataset.done) {
        return;
      }

      const target = Number(entry.target.dataset.count);
      const duration = 900;
      const startTime = performance.now();

      function updateCount(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        entry.target.textContent = Math.floor(easedProgress * target);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          entry.target.textContent = target;
          entry.target.dataset.done = 'true';
        }
      }

      requestAnimationFrame(updateCount);
    });
  }, {
    threshold: 0.5
  });

  statNumbers.forEach(function(number) {
    statObserver.observe(number);
  });
});
