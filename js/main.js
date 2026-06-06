/* ============================================================
   NORTHSTAR INTERNATIONAL LLC - Main JavaScript
   Functional interactions (No display animations)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
  
  // --- Navbar Scroll State & Back-to-Top Toggle ---
  const navbar = document.querySelector('.navbar-custom');
  const scrollTop = document.querySelector('.scroll-top');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Navbar Scrolled background
    if (navbar) {
      if (scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Scroll to top button visibility
    if (scrollTop) {
      if (scrollY > 300) {
        scrollTop.classList.add('visible');
      } else {
        scrollTop.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check

  // Scroll to top click event
  if (scrollTop) {
    scrollTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Active Nav Link Detection ---
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link:not(.nav-cta)');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || 
        (currentPage === '' && href === 'index.html') ||
        (currentPage === '/' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Brand Marquee Duplicator (Ensures continuous scroll) ---
  function initMarquee() {
    const marquee = document.querySelector('.brands-marquee');
    if (!marquee) return;

    const items = marquee.innerHTML;
    marquee.innerHTML = items + items;
  }

  initMarquee();

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        const offsetTop = target.offsetTop - 85;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Close Mobile Navigation on Link Click & Click Outside ---
  const navbarCollapse = document.querySelector('.navbar-collapse');
  if (navbarCollapse) {
    // Close on link click
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
      link.addEventListener('click', () => {
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      });
    });

    // Close on click outside
    document.addEventListener('click', function(event) {
      const isClickInsideNavbar = navbarCollapse.contains(event.target);
      const navbarToggler = document.querySelector('.navbar-toggler');
      const isNavbarToggler = navbarToggler && navbarToggler.contains(event.target);
      
      if (!isClickInsideNavbar && !isNavbarToggler && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    });
  }

  // --- Inventory Search/Filter (Inventory Page) ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const inventoryCards = document.querySelectorAll('.inventory-item');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filter = this.dataset.filter;

        inventoryCards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- Contact Form Submission & Mailto Composer ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const data = {};
      formData.forEach((value, key) => data[key] = value);

      let isValid = true;
      const requiredFields = contactForm.querySelectorAll('[required]');
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          field.classList.add('is-invalid');
          isValid = false;
        } else {
          field.classList.remove('is-invalid');
        }
      });

      if (isValid) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Inquiry Ready!';
        submitBtn.style.background = '#2ec4b6';
        submitBtn.disabled = true;

        // Formulate corporate email body
        const mailSubject = `Machinery Inquiry from ${data.name} (${data.company || 'Direct Client'})`;
        const mailBody = `Dear Northstar International Team,

I am interested in purchasing CNC equipment. Please find my inquiry details below:

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'N/A'}
Company: ${data.company || 'N/A'}
Country: ${data.country || 'N/A'}
Interested In: ${data.interest || 'General CNC Machinery'}

Detailed Requirements:
${data.message}

Please reply with the availability, detailed specifications, pricing, and freight options for shipping.

Best regards,
${data.name}`;

        const mailtoLink = `mailto:atulgupta2077@rediffmail.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

        // Open user's email client
        window.location.href = mailtoLink;

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
          contactForm.reset();
        }, 3000);
      }
    });

    contactForm.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('input', function() {
        if (this.value.trim()) {
          this.classList.remove('is-invalid');
        }
      });
    });
  }

  // --- Simple Counter Logic (Runs instantly on visible elements) ---
  const counterElements = document.querySelectorAll('[data-counter]');
  if (counterElements.length > 0) {
    counterElements.forEach(el => {
      const target = parseInt(el.dataset.counter);
      const suffix = el.dataset.suffix || '';
      el.textContent = target + suffix; // Instantly set the number instead of animating it as animations were removed
    });
  }

  // --- Close Floating Call Popup on outside click ---
  const callWrapper = document.getElementById('callFloatWrapper');
  if (callWrapper) {
    document.addEventListener('click', function(e) {
      if (!callWrapper.contains(e.target)) {
        callWrapper.classList.remove('active');
      }
    });
  }

});
