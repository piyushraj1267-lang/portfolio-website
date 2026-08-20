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
/* ------------------------------------------------------------------------
   7. PROJECT CASE STUDY MODAL DATA & TRIGGERS
------------------------------------------------------------------------ */

const projectDetailsData = {

  /* ================================================================
     PROJECT 1 — SMART GREENHOUSE
  ================================================================ */

  "1": {

    title: "Smart Greenhouse Automation System",

    category: "Smart Agriculture & IoT",

    images: [
      "assets/project1.jpg",
      "assets/project1-2.jpg",
      "assets/project1-3.jpg",
      "assets/project1-4.jpg",
      "assets/project1-5.jpg"
    ],

    duration: "Academic Project",

    status: "Prototype Developed",

    description: `
      Developed a smart greenhouse automation system for monitoring
      and controlling important environmental conditions required for
      healthy crop growth.

      The system uses Arduino Mega 2560 as the main controller and
      integrates temperature, humidity and soil-moisture sensors with
      different actuators such as a water pump, exhaust fan, fogger
      and solenoid valve.

      The objective is to reduce manual intervention and improve
      efficient use of water and other greenhouse resources.
    `,

    objectives: [

      "Monitor soil moisture in real time.",

      "Monitor greenhouse temperature and humidity.",

      "Automate irrigation according to soil moisture conditions.",

      "Control greenhouse ventilation using an exhaust fan.",

      "Maintain suitable humidity conditions using a fogger.",

      "Reduce manual intervention in greenhouse operation.",

      "Improve water-use efficiency."
    ],

    components: [

      "Arduino Mega 2560",

      "Soil Moisture Sensor",

      "DHT11 Temperature & Humidity Sensor",

      "Water Pump",

      "Exhaust Fan",

      "Fogger",

      "Solenoid Valve",

      "Relay Module",

      "LCD Display",

      "Power Supply"
    ],

    technologies: [

      "Arduino C++",

      "Embedded Systems",

      "IoT",

      "Sensors & Actuators",

      "Smart Agriculture",

      "Automation"
    ],

    working: `
      The sensors continuously collect information from the
      greenhouse environment.

      The soil moisture sensor measures the moisture level of the
      growing medium, while the DHT11 sensor measures temperature
      and relative humidity.

      The Arduino Mega processes these sensor readings and compares
      them with predefined threshold values.

      When the soil moisture level falls below the required value,
      the controller activates the water pump through a relay.

      Similarly, the exhaust fan and fogger can be controlled
      according to temperature and humidity conditions.

      Therefore, the system provides an automated method of
      monitoring and controlling greenhouse conditions.
    `,

    features: [

      "Automatic irrigation",

      "Soil moisture monitoring",

      "Temperature monitoring",

      "Humidity monitoring",

      "Automatic ventilation",

      "Fogging control",

      "Sensor-based automation",

      "Reduced manual intervention",

      "Water-use management"
    ],

    contribution: `
      My contribution included system planning, component selection,
      Arduino programming, sensor integration, actuator interfacing,
      circuit development, testing and understanding of the complete
      greenhouse automation workflow.
    `,

    outcomes: [

      "Successfully demonstrated sensor-based greenhouse monitoring.",

      "Implemented automatic irrigation control based on soil moisture.",

      "Integrated multiple sensors and actuators with Arduino Mega.",

      "Demonstrated automatic control of greenhouse equipment.",

      "Developed a prototype for smart and efficient greenhouse management."
    ]

  },


  /* ================================================================
     PROJECT 2 — AUTOMATIC LAWN MOWER
  ================================================================ */

  "2": {

    title: "Automatic Lawn Mower",

    category: "Agricultural Machinery & Power",

    images: [
      "assets/project2.jpg",
      "assets/project2-2.jpg",
      "assets/project2-3.jpg",
      "assets/project2-4.jpg",
      "assets/project2-5.jpg"
    ],

    duration: "Academic / Prototype Project",

    status: "Prototype Developed",

    description: `
      Designed and fabricated a compact electric lawn mower prototype
      for grass cutting applications.

      The project focuses on developing a simple, low-cost and
      electrically powered agricultural machinery system consisting
      of a chassis, wheel drive system, cutting mechanism, electric
      motors and control system.

      The prototype was developed with the objective of reducing
      manual effort involved in grass cutting and providing an
      environmentally friendly alternative to conventional
      fuel-powered equipment.
    `,

    objectives: [

      "Develop a compact electric lawn mower prototype.",

      "Reduce manual labour required for grass cutting.",

      "Develop an electrically powered cutting mechanism.",

      "Design a strong and lightweight chassis.",

      "Provide suitable mobility for the mower.",

      "Develop a reliable rotary cutting mechanism.",

      "Improve ease of operation and maintenance."
    ],

    components: [

      "Arduino Mega",

      "Motor Driver",

      "DC Gear Motors",

      "BLDC Motor",

      "BLDC ESC",

      "FlySky FS-R6B Receiver",

      "FlySky FS-CT6B Transmitter",

      "Battery",

      "Cutting Blade",

      "Steel / Metal Chassis",

      "Wheels",

      "Switches and Wiring"
    ],

    technologies: [

      "Mechanical Design",

      "Electric Drive",

      "Arduino",

      "Motor Control",

      "RC Control",

      "Farm Machinery",

      "Prototype Fabrication"
    ],

    working: `
      The lawn mower uses electric motors for movement and a separate
      motor for the grass-cutting mechanism.

      The drive motors provide rotational power to the wheels,
      allowing the machine to move forward, backward and turn.

      A separate BLDC motor is connected to the cutting mechanism
      through an electronic speed controller.

      The cutting motor rotates the blade at high speed to cut grass.

      The control system receives commands from the remote controller
      and sends the required signals to the motor drivers and ESC.

      This allows the operator to remotely control the movement and
      cutting operation of the mower.
    `,

    features: [

      "Electric-powered operation",

      "Remote-controlled movement",

      "Separate cutting motor",

      "BLDC cutting mechanism",

      "Motor driver-based wheel control",

      "Compact chassis",

      "Reduced fuel requirement",

      "Low-emission operation",

      "Easy maintenance"
    ],

    contribution: `
      My contribution included mechanical layout planning, component
      selection, motor and driver integration, chassis development,
      wiring, control-system integration and testing of the prototype.
    `,

    outcomes: [

      "Successfully developed a functional electric mower prototype.",

      "Integrated wheel drive and cutting mechanisms.",

      "Implemented remote control for machine movement.",

      "Integrated BLDC motor and ESC for the cutting mechanism.",

      "Demonstrated the feasibility of an electrically powered mower."
    ]

  },


  /* ================================================================
     PROJECT 3 — CATIA TRACTOR COMPONENT DESIGN
  ================================================================ */

  "3": {

    title: "Tractor Component Design & Assembly using CATIA V5",

    category: "CAD & Product Design",

    images: [
      "assets/project3.jpg",
      "assets/project3-2.jpg",
      "assets/project3-3.jpg",
      "assets/project3-4.jpg",
      "assets/project3-5.jpg"
    ],

    duration: "CAD Design Project",

    status: "3D Models & Assemblies Completed",

    description: `
      Designed and developed multiple tractor and agricultural
      machinery components using CATIA V5.

      The project focused on creating accurate 3D mechanical models,
      assemblies and engineering components used in tractor systems.

      The work involved part modelling, assembly design,
      dimensional control, geometric constraints and preparation
      of engineering drawings.
    `,

    objectives: [

      "Develop accurate 3D tractor component models.",

      "Understand mechanical component design.",

      "Create multi-part assemblies.",

      "Apply appropriate geometric constraints.",

      "Check component interference and clearances.",

      "Develop engineering drawings.",

      "Improve CAD modelling and product-design skills."
    ],

    components: [

      "Left Lift Arm",

      "Rear Lift Arm",

      "Three-Point Hitch",

      "Wheel Hub",

      "Rim Hub",

      "Stub Axle Spindle",

      "Gearbox Cover",

      "Clutch Box",

      "Steering Components",

      "Tractor Wheel Components"
    ],

    technologies: [

      "CATIA V5",

      "Part Design",

      "Assembly Design",

      "Generative Shape Design",

      "Drafting",

      "3D Modelling",

      "Mechanical Component Design",

      "Engineering Drawing"
    ],

    working: `
      The design process begins with understanding the dimensions
      and functional requirements of each mechanical component.

      Individual components are created using CATIA V5 Part Design
      using sketches, pads, pockets, shafts, holes, fillets and
      chamfers.

      After individual components are completed, they are imported
      into Assembly Design.

      Appropriate constraints are applied to position the components
      correctly.

      The final assembly is inspected for alignment, interference,
      clearance and functional relationships between components.

      Engineering drawings can then be generated for manufacturing
      and documentation purposes.
    `,

    features: [

      "3D part modelling",

      "Assembly design",

      "Geometric constraints",

      "Component alignment",

      "Interference checking",

      "Mechanical component design",

      "Engineering drawings",

      "Dimensional accuracy",

      "Product design"
    ],

    contribution: `
      I worked on the complete CAD modelling workflow including
      sketch creation, part modelling, feature development, assembly
      constraints, component alignment, interference checking and
      preparation of engineering drawings.
    `,

    outcomes: [

      "Created multiple tractor component models in CATIA V5.",

      "Developed multi-component tractor assemblies.",

      "Improved understanding of mechanical design principles.",

      "Performed assembly alignment and interference checking.",

      "Developed engineering drawings for selected components.",

      "Strengthened practical CAD and product-design skills."
    ]

  }

};


/* ================================================================
   MODAL ELEMENTS
================================================================ */

const modal = document.getElementById("project-modal");

const modalBody =
  document.getElementById("modal-content-body");

const modalCloseBtn =
  document.getElementById("modal-close");

const openModalBtns =
  document.querySelectorAll(".open-modal-btn");


/* ================================================================
   OPEN PROJECT MODAL
================================================================ */

function openProjectModal(id) {

  const data = projectDetailsData[id];

  if (!data || !modal || !modalBody) return;


  modalBody.innerHTML = `

    <!-- =========================================
         PROJECT HEADER
    ========================================== -->

    <div class="modal-header">

      <span
        class="project-cat"
        style="
          position: static;
          display: inline-block;
          margin-bottom: 0.7rem;
        "
      >
        ${data.category}
      </span>

      <h2>
        ${data.title}
      </h2>

      <div class="modal-meta">

        <span>
          <i class="fa-solid fa-calendar"></i>
          ${data.duration}
        </span>

        <span>
          <i class="fa-solid fa-circle-check"></i>
          ${data.status}
        </span>

      </div>

    </div>


    <!-- =========================================
         IMAGE GALLERY
    ========================================== -->

    <div class="project-modal-gallery">

      ${data.images.map((image, index) => `

        <div class="modal-gallery-item">

          <img
            src="${image}"
            alt="${data.title} - Project Image ${index + 1}"
            loading="lazy"
          >

        </div>

      `).join("")}

    </div>


    <!-- =========================================
         PROJECT OVERVIEW
    ========================================== -->

    <div class="modal-section">

      <h3>
        <i class="fa-solid fa-file-lines"></i>
        Project Overview
      </h3>

      <p>
        ${data.description}
      </p>

    </div>


    <!-- =========================================
         OBJECTIVES
    ========================================== -->

    <div class="modal-section">

      <h3>
        <i class="fa-solid fa-bullseye"></i>
        Project Objectives
      </h3>

      <ul class="modal-list">

        ${data.objectives.map(item => `

          <li>

            <i class="fa-solid fa-check"></i>

            <span>${item}</span>

          </li>

        `).join("")}

      </ul>

    </div>


    <!-- =========================================
         COMPONENTS
    ========================================== -->

    <div class="modal-section">

      <h3>
        <i class="fa-solid fa-microchip"></i>
        Components / Equipment Used
      </h3>

      <div class="modal-tags">

        ${data.components.map(component => `

          <span>
            ${component}
          </span>

        `).join("")}

      </div>

    </div>


    <!-- =========================================
         TECHNOLOGIES
    ========================================== -->

    <div class="modal-section">

      <h3>
        <i class="fa-solid fa-code"></i>
        Technologies & Tools
      </h3>

      <div class="modal-tags">

        ${data.technologies.map(technology => `

          <span>
            ${technology}
          </span>

        `).join("")}

      </div>

    </div>


    <!-- =========================================
         WORKING PRINCIPLE
    ========================================== -->

    <div class="modal-section">

      <h3>
        <i class="fa-solid fa-gears"></i>
        Working Principle
      </h3>

      <p>
        ${data.working}
      </p>

    </div>


    <!-- =========================================
         KEY FEATURES
    ========================================== -->

    <div class="modal-section">

      <h3>
        <i class="fa-solid fa-star"></i>
        Key Features
      </h3>

      <div class="modal-feature-grid">

        ${data.features.map(feature => `

          <div class="modal-feature">

            <i class="fa-solid fa-circle-check"></i>

            <span>
              ${feature}
            </span>

          </div>

        `).join("")}

      </div>

    </div>


    <!-- =========================================
         MY CONTRIBUTION
    ========================================== -->

    <div class="modal-section">

      <h3>
        <i class="fa-solid fa-user-gear"></i>
        My Contribution
      </h3>

      <p>
        ${data.contribution}
      </p>

    </div>


    <!-- =========================================
         OUTCOMES
    ========================================== -->

    <div class="modal-section">

      <h3>
        <i class="fa-solid fa-chart-line"></i>
        Key Engineering Outcomes
      </h3>

      <ul class="modal-list">

        ${data.outcomes.map(outcome => `

          <li>

            <i class="fa-solid fa-angle-right"></i>

            <span>
              ${outcome}
            </span>

          </li>

        `).join("")}

      </ul>

    </div>

  `;


  /* Open modal */

  modal.classList.add("active");

  modal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow = "hidden";

}


/* ================================================================
   CLOSE PROJECT MODAL
================================================================ */

function closeProjectModal() {

  if (!modal) return;

  modal.classList.remove("active");

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow = "";

}


/* ================================================================
   PROJECT BUTTON EVENTS
================================================================ */

openModalBtns.forEach(btn => {

  btn.addEventListener("click", function(e) {

    e.preventDefault();

    const projectId =
      this.getAttribute("data-project");

    if (projectId) {

      openProjectModal(projectId);

    }

  });

});


/* ================================================================
   CLOSE BUTTON
================================================================ */

modalCloseBtn?.addEventListener(
  "click",
  closeProjectModal
);


/* ================================================================
   CLICK OUTSIDE MODAL
================================================================ */

modal?.addEventListener(
  "click",
  function(e) {

    if (e.target === modal) {

      closeProjectModal();

    }

  }
);


/* ================================================================
   ESCAPE KEY
================================================================ */

document.addEventListener(
  "keydown",
  function(e) {

    if (
      e.key === "Escape" &&
      modal?.classList.contains("active")
    ) {

      closeProjectModal();

    }

  }
);

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
