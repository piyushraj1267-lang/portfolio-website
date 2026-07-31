/* ==========================================================================
   PIYUSH RAJ PORTFOLIO - INTERACTIVE JAVASCRIPT LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. Preloader Handler
     ------------------------------------------------------------------------ */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (preloader) {
        preloader.classList.add('loaded');
      }
    }, 500);
  });

  /* ------------------------------------------------------------------------
     2. Background Particle & Grid Canvas Animation
     ------------------------------------------------------------------------ */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = Math.floor(width / 22);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.8 + 0.5;
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Connect nearby particles with subtle lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateParticles);
    }

    animateParticles();

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });
  }

  /* ------------------------------------------------------------------------
     3. Header Scroll Effect & Active Section Highlighting
     ------------------------------------------------------------------------ */
  const header = document.querySelector('.navbar-header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Back to top button visibility
    const backToTopBtn = document.getElementById('back-to-top');
    if (window.scrollY > 400) {
      backToTopBtn?.classList.add('show');
    } else {
      backToTopBtn?.classList.remove('show');
    }
  });

  // IntersectionObserver for Section Active Link Highlighting
  const sectionObserverOptions = {
    threshold: 0.35,
    rootMargin: "-80px 0px 0px 0px"
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, sectionObserverOptions);

  sections.forEach(section => sectionObserver.observe(section));

  /* ------------------------------------------------------------------------
     4. Mobile Navigation Drawer Toggle
     ------------------------------------------------------------------------ */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  /* ------------------------------------------------------------------------
     5. Hero Section Typing Effect
     ------------------------------------------------------------------------ */
  const typingElement = document.getElementById('typing-text');
  if (typingElement) {
    const phrases = [
      "CAD / CAE Specialist",
      "CATIA V5 & 3DEXPERIENCE Expert",
      "ANSYS FEA Simulation Spec",
      "Farm Machinery & Tractor Systems",
      "Agricultural Technology Innovator"
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function typeEffect() {
      const currentPhrase = phrases[phraseIdx];

      if (isDeleting) {
        typingElement.textContent = currentPhrase.substring(0, charIdx - 1);
        charIdx--;
      } else {
        typingElement.textContent = currentPhrase.substring(0, charIdx + 1);
        charIdx++;
      }

      let typeSpeed = isDeleting ? 40 : 80;

      if (!isDeleting && charIdx === currentPhrase.length) {
        typeSpeed = 2200; // Pause at full word
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        typeSpeed = 500;
      }

      setTimeout(typeEffect, typeSpeed);
    }

    typeEffect();
  }

  /* ------------------------------------------------------------------------
     6. Stats Counter & Progress Bar Animations
     ------------------------------------------------------------------------ */
  const counters = document.querySelectorAll('.counter');
  let animatedCounters = false;

  const statsSection = document.querySelector('.stats-bar-section');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animatedCounters) {
          animatedCounters = true;
          counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target') || '0');
            const isFloat = target % 1 !== 0;
            const duration = 1800;
            const stepTime = 20;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                const decimals = target.toString().includes('.') ? target.toString().split('.')[1].length : 0;
                counter.textContent = decimals > 0 ? target.toFixed(decimals) : target.toString();
                clearInterval(timer);
              } else {
                const decimals = target.toString().includes('.') ? target.toString().split('.')[1].length : 0;
                counter.textContent = decimals > 0 ? current.toFixed(decimals) : Math.floor(current).toString();
              }
            }, stepTime);
          });
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
  }

  // Skills Progress Bar Animation
  const skillSection = document.getElementById('skills');
  if (skillSection) {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progressBars = entry.target.querySelectorAll('.progress');
          progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
              bar.style.width = width;
            }, 100);
          });
          skillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    skillObserver.observe(skillSection);
  }

  /* ------------------------------------------------------------------------
     7. Project Case Study Modal Data & Triggers
     ------------------------------------------------------------------------ */
  const projectDetailsData = {
    "1": {
      title: "Smart Greenhouse Automation System",
      category: "Smart Agriculture & IoT",
      image: "assets/project1.jpg",
      description: "Developed an automated smart greenhouse micro-climate and drip irrigation control system to monitor soil moisture, relative humidity, and ambient temperature in real time.",
      technologies: ["Arduino C++", "DHT11 & Soil Sensors", "Relay Actuators", "LCD Display", "IoT Automation"],
      outcomes: [
        "Automated irrigation scheduling based on real-time soil moisture thresholds.",
        "Reduced water consumption by 35% compared to manual flood irrigation.",
        "Integrated climate ventilation control to prevent heat stress during peak afternoon hours."
      ]
    },
    "2": {
      title: "Automatic Lawn Mower",
      category: "Agricultural Machinery & Power",
      image: "assets/project2.jpg",
      description: "Designed and fabricated a compact automatic electric lawn mower prototype tailored for small farm plots, orchards, and turf maintenance. Features a high-torque electric motor drive and durable rotary blade assembly.",
      technologies: ["Mechanical Component Design", "DC Electric Motor Drive", "Chassis Fabrication", "Farm Machinery"],
      outcomes: [
        "Engineered lightweight tubular steel frame for maximum structural integrity.",
        "Implemented high-velocity rotary cutting blade operating at 2800 RPM.",
        "Demonstrated low operational noise, zero carbon emissions, and easy maintenance."
      ]
    },
    "3": {
      title: "Tractor Component Design & Assembly in CATIA V5",
      category: "CAD & Product Design",
      image: "assets/project3.jpg",
      description: "Designed multi-part 3D mechanical components for heavy tractor transmission gearboxes, engine pistons, and hydraulic lift arms. Performed geometric constraint alignment, interference checks, and assembly modeling.",
      technologies: ["CATIA V5 Part Design", "Assembly Workbench", "Generative Shape Design", "Kinematic Analysis"],
      outcomes: [
        "Created precise 3D CAD models following ISO/DIN mechanical drawing standards.",
        "Executed clash analysis to eliminate component clearance overlaps in assembly.",
        "Generated detailed 2D drafting production drawings with precise geometric tolerances."
      ]
    }
  };

  const modal = document.getElementById('project-modal');
  const modalBody = document.getElementById('modal-content-body');
  const modalCloseBtn = document.getElementById('modal-close');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');

  function openProjectModal(id) {
    const data = projectDetailsData[id];
    if (!data || !modal || !modalBody) return;

    modalBody.innerHTML = `
      <div class="modal-header">
        <span class="project-cat" style="position:static; margin-bottom: 0.5rem; display:inline-block;">${data.category}</span>
        <h2 style="font-size: 1.8rem; font-weight:800; margin-bottom: 1rem;">${data.title}</h2>
      </div>
      <img src="${data.image}" alt="${data.title}" style="width: 100%; max-height: 350px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: 1.5rem; border: 1px solid var(--border-glass);">
      
      <h3 style="font-size: 1.15rem; color: var(--secondary-accent); margin-bottom: 0.5rem;"><i class="fa-solid fa-file-text"></i> Project Overview</h3>
      <p style="color: var(--text-sub); font-size: 0.98rem; margin-bottom: 1.5rem; line-height: 1.6;">${data.description}</p>
      
      <h3 style="font-size: 1.15rem; color: var(--secondary-accent); margin-bottom: 0.5rem;"><i class="fa-solid fa-code"></i> Technologies & Tools</h3>
      <div class="tech-tags" style="margin-bottom: 1.5rem;">
        ${data.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('')}
      </div>

      <h3 style="font-size: 1.15rem; color: var(--secondary-accent); margin-bottom: 0.5rem;"><i class="fa-solid fa-circle-check"></i> Key Engineering Outcomes</h3>
      <ul class="resp-list" style="margin-bottom: 1.5rem;">
        ${data.outcomes.map(o => `<li><i class="fa-solid fa-angle-right"></i> ${o}</li>`).join('')}
      </ul>
    `;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pId = btn.getAttribute('data-project');
      if (pId) openProjectModal(pId);
    });
  });

  modalCloseBtn?.addEventListener('click', closeProjectModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeProjectModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      closeProjectModal();
    }
  });

  /* ------------------------------------------------------------------------
     8. Contact Form Client-Side Validation & Feedback
     ------------------------------------------------------------------------ */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const subjectInput = document.getElementById('subject');
      const messageInput = document.getElementById('message');

      const nameGroup = nameInput?.closest('.form-group');
      const emailGroup = emailInput?.closest('.form-group');
      const subjectGroup = subjectInput?.closest('.form-group');
      const messageGroup = messageInput?.closest('.form-group');

      // Reset errors
      [nameGroup, emailGroup, subjectGroup, messageGroup].forEach(grp => grp?.classList.remove('error'));

      // Validate Name
      if (!nameInput?.value.trim()) {
        nameGroup?.classList.add('error');
        isValid = false;
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput?.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        emailGroup?.classList.add('error');
        isValid = false;
      }

      // Validate Subject
      if (!subjectInput?.value.trim()) {
        subjectGroup?.classList.add('error');
        isValid = false;
      }

      // Validate Message
      if (!messageInput?.value.trim() || messageInput.value.trim().length < 10) {
        messageGroup?.classList.add('error');
        isValid = false;
      }

      if (isValid) {
        const submitBtn = document.getElementById('submit-btn');
        if (submitBtn) {
          submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
          submitBtn.disabled = true;
        }

        setTimeout(() => {
          showToast('Thank you! Your message has been sent successfully. Piyush Raj will respond soon.');
          contactForm.reset();
          if (submitBtn) {
            submitBtn.innerHTML = `<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>`;
            submitBtn.disabled = false;
          }
        }, 1200);
      }
    });
  }

  /* ------------------------------------------------------------------------
     9. Copy-to-Clipboard Buttons
     ------------------------------------------------------------------------ */
  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
        }).catch(() => {
          showToast(`Direct link: ${textToCopy}`);
        });
      }
    });
  });

  /* ------------------------------------------------------------------------
     10. Toast Notification System
     ------------------------------------------------------------------------ */
  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--primary-accent);"></i> <span>${message}</span>`;
    
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-100%)';
      toast.style.transition = 'all 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  /* ------------------------------------------------------------------------
     11. Back to Top Smooth Scroll
     ------------------------------------------------------------------------ */
  const backToTopBtn = document.getElementById('back-to-top');
  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

});
