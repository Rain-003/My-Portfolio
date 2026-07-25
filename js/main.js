/* ==========================================================================
   WRAIN MACALINDONG - PORTFOLIO INTERACTIVITY & LOGIC
   Mobile-First JavaScript Engine
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. Projects Data Structure (With Specific Link Configuration per Project)
// --------------------------------------------------------------------------
const PROJECTS = [
  {
    id: "onehealth",
    title: "OneHealth — Immunization Record System",
    category: "Healthcare & Laravel",
    summary: "A Laravel-based system that helps barangay health workers manage immunization records, schedules, and patient tracking.",
    detailedDescription: "A Laravel-based system that helps barangay health workers manage immunization records, schedules, and patient tracking. Built to streamline health center record keeping, patient appointment notifications, and administrative reporting.",
    featuredImg: "projects/OneHealth/1.jpg",
    gallery: Array.from({ length: 16 }, (_, i) => `projects/OneHealth/${i + 1}.jpg`),
    tools: ["Laravel", "PHP", "MySQL"],
    highlights: [
      "Barangay health record management and patient tracking",
      "Automated immunization schedule tracking",
      "Relational database design for patient and vaccine records",
      "Sanitized data entry and administrative reporting"
    ],
    demoLink: "https://onehealth.my/"
  },
  {
    id: "blakink",
    title: "Blak Ink — Simple E-Commerce (HTML/CSS)",
    category: "E-Commerce & Web Design",
    summary: "One of our earliest group projects — a clean e-commerce website made with HTML and CSS.",
    detailedDescription: "One of our earliest group projects — a clean e-commerce website made with HTML and CSS. Demonstrates fundamental web layout structuring, product grid design, and client-side interaction using JavaScript.",
    featuredImg: "projects/BlakInk/1.jpg",
    gallery: Array.from({ length: 13 }, (_, i) => `projects/BlakInk/${i + 1}.jpg`),
    tools: ["HTML", "CSS", "JavaScript"],
    highlights: [
      "Clean semantic HTML5 structure and responsive CSS styling",
      "Interactive product display and shopping catalog layout",
      "Earliest group collaboration project showcasing foundational web skills"
    ],
  },
  {
    id: "sorting-heapsort",
    title: "Heapsort Project — Java Sorting",
    category: "Java & Algorithms",
    summary: "A Java project that demonstrates heap sorting logic and step-by-step sorting behavior.",
    detailedDescription: "A Java project that demonstrates heap sorting logic and step-by-step sorting behavior. Focused on object-oriented programming principles, array heap tree structures, and algorithmic execution analysis.",
    featuredImg: "projects/Sorting/1.jpg",
    gallery: Array.from({ length: 4 }, (_, i) => `projects/Sorting/${i + 1}.jpg`),
    tools: ["Java", "Algorithms"],
    highlights: [
      "Step-by-step HeapSort algorithm execution logic",
      "Object-oriented Java code architecture",
      "Performance evaluation and sorting execution tracing"
    ],
    demoLink: null, // No live demo button
    githubLink: null // No GitHub code button
  },
  {
    id: "sit-and-zip",
    title: "Sit and Zip — Android Coffee Shop App",
    category: "Mobile App & Android Studio",
    summary: "An Android Studio project for a coffee shop concept. Screenshots not available yet — opening the project drive instead.",
    detailedDescription: "An Android Studio project for a coffee shop concept. Screenshots not available yet — click below to access the full project repository and resources directly on Google Drive.",
    featuredImg: "projects/sit.png",
    gallery: [],
    tools: ["Android Studio", "Mobile"],
    highlights: [
      "Android Studio mobile interface and user flow design",
      "Coffee shop menu browsing and order ordering concept",
      "Available for viewing on Google Drive"
    ],
    isGoogleDrive: true,
    googleDriveLink: "https://drive.google.com/drive/folders/1LU-PlSi1kDXATAcYoQFHU6WmduY55I7Z?usp=drive_link"
  }
];

// --------------------------------------------------------------------------
// 2. Global State & DOM Element References
// --------------------------------------------------------------------------
let currentSlideIndex = 0;
let autoPlayInterval = null;
let isAutoPlayDisabled = false;

// Touch Gesture Tracking State
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener("DOMContentLoaded", () => {
  initLoader();
  initThemeToggle();
  initMobileMenu();
  initProjectsCarousel();
  initProjectModal();
  initContactToast();
  initActiveNavObserver();
  initRainCanvas();
});

// --------------------------------------------------------------------------
// 3. Page Loader Screen
// --------------------------------------------------------------------------
function initLoader() {
  const loader = document.getElementById("loader");
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = "0";
      loader.style.visibility = "hidden";
    }, 700);
  }
}

// --------------------------------------------------------------------------
// 4. Dark & Light Theme Switcher with SVG Icons and localStorage Memory
// --------------------------------------------------------------------------
function initThemeToggle() {
  const themeBtn = document.getElementById("theme-toggle");
  const moonIcon = document.querySelector(".moon-icon");
  const sunIcon = document.querySelector(".sun-icon");
  const savedTheme = localStorage.getItem("portfolio_theme");

  function updateThemeUI(isLight) {
    if (isLight) {
      document.body.classList.add("light-theme");
      if (moonIcon) moonIcon.style.display = "none";
      if (sunIcon) sunIcon.style.display = "block";
    } else {
      document.body.classList.remove("light-theme");
      if (moonIcon) moonIcon.style.display = "block";
      if (sunIcon) sunIcon.style.display = "none";
    }
  }

  if (savedTheme === "light") {
    updateThemeUI(true);
  } else {
    updateThemeUI(false);
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const isCurrentlyLight = document.body.classList.contains("light-theme");
      const targetIsLight = !isCurrentlyLight;
      updateThemeUI(targetIsLight);
      localStorage.setItem("portfolio_theme", targetIsLight ? "light" : "dark");
    });
  }
}

// --------------------------------------------------------------------------
// 5. Sticky Navbar & Mobile Drawer Menu
// --------------------------------------------------------------------------
function initMobileMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-item");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      menuToggle.classList.toggle("active");
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains("open")) {
        navMenu.classList.remove("open");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }
}

// --------------------------------------------------------------------------
// 6. Projects Carousel & Touch Swipe Engine
// --------------------------------------------------------------------------
function initProjectsCarousel() {
  const track = document.getElementById("carousel-track");
  const dotsContainer = document.getElementById("carousel-dots");
  const prevBtn = document.getElementById("prev-project");
  const nextBtn = document.getElementById("next-project");
  const wrapper = document.getElementById("carousel-wrapper");

  if (!track) return;

  track.innerHTML = PROJECTS.map((proj, idx) => `
    <article class="project-card" data-id="${proj.id}" data-index="${idx}">
      <div class="project-img-wrapper">
        <img
          src="${proj.featuredImg}"
          alt="${proj.title} Preview"
          class="project-img"
          onerror="this.src='img/homebg.JPG';"
        />
      </div>
      <div class="project-content">
        <span class="modal-badge">${proj.category}</span>
        <h3 class="project-title">${proj.title}</h3>
        <p class="project-summary">${proj.summary}</p>
        <div class="project-tools">
          ${proj.tools.map(t => `<span class="tool-chip">${t}</span>`).join('')}
        </div>
        <button class="btn btn-sm btn-outline open-modal-btn" data-id="${proj.id}" style="margin-top: 0.5rem; align-self: flex-start;">
          ${proj.isGoogleDrive ? 'View Project Drive' : 'View Details & Gallery'}
        </button>
      </div>
    </article>
  `).join('');

  if (dotsContainer) {
    dotsContainer.innerHTML = PROJECTS.map((_, idx) => `
      <span class="dot ${idx === 0 ? 'active' : ''}" data-index="${idx}"></span>
    `).join('');
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      disableAutoPlay();
      navigateCarousel(currentSlideIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      disableAutoPlay();
      navigateCarousel(currentSlideIndex + 1);
    });
  }

  if (dotsContainer) {
    dotsContainer.querySelectorAll(".dot").forEach(dot => {
      dot.addEventListener("click", (e) => {
        disableAutoPlay();
        const idx = parseInt(e.target.dataset.index, 10);
        navigateCarousel(idx);
      });
    });
  }

  if (wrapper) {
    wrapper.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    wrapper.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  startAutoPlay();
}

function handleSwipe() {
  const swipeThreshold = 40;
  const deltaX = touchEndX - touchStartX;

  if (Math.abs(deltaX) > swipeThreshold) {
    disableAutoPlay();
    if (deltaX < 0) {
      navigateCarousel(currentSlideIndex + 1);
    } else {
      navigateCarousel(currentSlideIndex - 1);
    }
  }
}

function navigateCarousel(targetIndex) {
  const track = document.getElementById("carousel-track");
  const dots = document.querySelectorAll(".dot");
  const totalSlides = PROJECTS.length;

  if (!track || totalSlides === 0) return;

  if (targetIndex < 0) {
    currentSlideIndex = totalSlides - 1;
  } else if (targetIndex >= totalSlides) {
    currentSlideIndex = 0;
  } else {
    currentSlideIndex = targetIndex;
  }

  const cards = track.querySelectorAll(".project-card");
  if (cards.length > 0) {
    const cardWidth = cards[0].offsetWidth;
    const gap = 24;
    const moveOffset = (cardWidth + gap) * currentSlideIndex;
    track.style.transform = `translateX(-${moveOffset}px)`;
  }

  dots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === currentSlideIndex);
  });
}

function startAutoPlay() {
  if (isAutoPlayDisabled) return;
  autoPlayInterval = setInterval(() => {
    navigateCarousel(currentSlideIndex + 1);
  }, 4500);
}

function disableAutoPlay() {
  isAutoPlayDisabled = true;
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
  }
}

window.addEventListener("resize", () => {
  navigateCarousel(currentSlideIndex);
});

// --------------------------------------------------------------------------
// 7. Project Modal Popup (Whole Card Clickable + Specific Link Visibility)
// --------------------------------------------------------------------------
function initProjectModal() {
  const modal = document.getElementById("project-modal");
  const closeBtn = document.getElementById("modal-close-btn");
  const backdrop = modal ? modal.querySelector(".modal-backdrop") : null;

  // Make entire project card container clickable
  document.addEventListener("click", (e) => {
    const card = e.target.closest(".project-card");
    if (card) {
      const projId = card.dataset.id;
      const projectData = PROJECTS.find(p => p.id === projId);
      
      if (projectData) {
        populateAndOpenModal(projectData);
      }
    }
  });

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (backdrop) backdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("open")) {
      closeModal();
    }
  });
}

function populateAndOpenModal(proj) {
  const modal = document.getElementById("project-modal");
  const img = document.getElementById("modal-img");
  const thumbnailsContainer = document.getElementById("modal-thumbnails");
  const cat = document.getElementById("modal-category");
  const title = document.getElementById("modal-title");
  const desc = document.getElementById("modal-desc");
  const tools = document.getElementById("modal-tools");
  const highlights = document.getElementById("modal-highlights");
  const driveBtn = document.getElementById("modal-drive-btn");
  const demoLink = document.getElementById("modal-demo-link");
  const githubLink = document.getElementById("modal-github-link");

  if (!modal) return;

  if (img) {
    img.src = proj.featuredImg;
    img.alt = proj.title;
  }

  if (thumbnailsContainer) {
    if (proj.gallery && proj.gallery.length > 1) {
      thumbnailsContainer.style.display = "flex";
      thumbnailsContainer.innerHTML = proj.gallery.map((thumbSrc, idx) => `
        <img
          src="${thumbSrc}"
          alt="Thumbnail ${idx + 1}"
          class="modal-thumb ${idx === 0 ? 'active' : ''}"
          data-src="${thumbSrc}"
        />
      `).join('');

      thumbnailsContainer.querySelectorAll(".modal-thumb").forEach(thumb => {
        thumb.addEventListener("click", (e) => {
          thumbnailsContainer.querySelectorAll(".modal-thumb").forEach(t => t.classList.remove("active"));
          e.target.classList.add("active");
          if (img) img.src = e.target.dataset.src;
        });
      });
    } else {
      thumbnailsContainer.style.display = "none";
      thumbnailsContainer.innerHTML = "";
    }
  }

  if (cat) cat.textContent = proj.category;
  if (title) title.textContent = proj.title;
  if (desc) desc.textContent = proj.detailedDescription;
  
  if (tools) {
    tools.innerHTML = proj.tools.map(t => `<span class="chip chip-accent">${t}</span>`).join('');
  }

  if (highlights) {
    highlights.innerHTML = proj.highlights.map(h => `<li>${h}</li>`).join('');
  }

  // Handle Dynamic Action Link Visibility
  if (proj.isGoogleDrive) {
    if (driveBtn) {
      driveBtn.style.display = "inline-flex";
      driveBtn.href = proj.googleDriveLink || "#";
    }
    if (demoLink) demoLink.style.display = "none";
    if (githubLink) githubLink.style.display = "none";
  } else {
    if (driveBtn) driveBtn.style.display = "none";
    
    // Live Demo Web Button
    if (demoLink) {
      if (proj.demoLink) {
        demoLink.style.display = "inline-flex";
        demoLink.href = proj.demoLink;
      } else {
        demoLink.style.display = "none";
      }
    }
    
    // GitHub Source Code Button
    if (githubLink) {
      if (proj.githubLink) {
        githubLink.style.display = "inline-flex";
        githubLink.href = proj.githubLink;
      } else {
        githubLink.style.display = "none";
      }
    }
  }

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.getElementById("project-modal");
  if (modal) {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
}

// --------------------------------------------------------------------------
// 8. Contact Section - Copy Email Helper
// --------------------------------------------------------------------------
function initContactToast() {
  const copyBtn = document.getElementById("copy-email-btn");
  const emailText = document.getElementById("email-text");

  if (copyBtn && emailText) {
    copyBtn.addEventListener("click", () => {
      const email = emailText.textContent.trim();
      navigator.clipboard.writeText(email).then(() => {
        showToast("Email address copied to clipboard!");
      }).catch(() => {
        showToast("Failed to copy email automatically.");
      });
    });
  }
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (toast) {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  }
}

// --------------------------------------------------------------------------
// 9. Active Navigation State on Scroll
// --------------------------------------------------------------------------
function initActiveNavObserver() {
  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll(".nav-item");

  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -70% 0px",
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navItems.forEach(item => {
          const href = item.getAttribute("href");
          if (href === `#${id}`) {
            item.classList.add("active");
          } else {
            item.classList.remove("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}

// --------------------------------------------------------------------------
// 10. Ambient Falling Raindrop Canvas Animation
// --------------------------------------------------------------------------
function initRainCanvas() {
  const canvas = document.getElementById("rain-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const raindrops = [];
  const maxDrops = 70;

  for (let i = 0; i < maxDrops; i++) {
    raindrops.push({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 20 + 12,
      speed: Math.random() * 3.5 + 2,
      opacity: Math.random() * 0.45 + 0.15
    });
  }

  function animateRain() {
    ctx.clearRect(0, 0, width, height);

    const isLight = document.body.classList.contains("light-theme");
    const strokeBase = isLight ? "rgba(2, 132, 199, " : "rgba(56, 189, 248, ";
    const lineW = isLight ? 1.6 : 1.2;

    for (let i = 0; i < raindrops.length; i++) {
      const drop = raindrops[i];
      
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x, drop.y + drop.length);
      ctx.strokeStyle = strokeBase + (isLight ? drop.opacity * 1.5 : drop.opacity) + ")";
      ctx.lineWidth = lineW;
      ctx.stroke();

      drop.y += drop.speed;

      if (drop.y > height) {
        drop.y = -drop.length;
        drop.x = Math.random() * width;
      }
    }

    requestAnimationFrame(animateRain);
  }

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  animateRain();
}
