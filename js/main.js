// /js/main.js

document.addEventListener("DOMContentLoaded", function () {
  // Hero Slider Functionality
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.getElementById("prev-slide");
  const nextBtn = document.getElementById("next-slide");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));
    slides[index].classList.add("active");
    dots[index].classList.add("active");
    currentSlide = index;
  }

  function nextSlide() {
    let nextIndex = currentSlide + 1;
    if (nextIndex >= slides.length) nextIndex = 0;
    showSlide(nextIndex);
  }

  function prevSlide() {
    let prevIndex = currentSlide - 1;
    if (prevIndex < 0) prevIndex = slides.length - 1;
    showSlide(prevIndex);
  }

  // Touch support for mobile slider
  const slider = document.querySelector(".hero-slider");
  if (slider) {
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches[0].screenX;
    });

    slider.addEventListener("touchend", function (e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });

    function handleSwipe() {
      const swipeThreshold = 50;
      const difference = touchStartX - touchEndX;

      if (Math.abs(difference) > swipeThreshold) {
        if (difference > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        resetInterval();
      }
    }
  }

  // Dots functionality
  if (dots.length > 0) {
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        showSlide(index);
        resetInterval();
      });
    });
  }

  // Navigation buttons
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetInterval();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetInterval();
    });
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (slides.length > 0) {
      if (e.key === "ArrowLeft") {
        prevSlide();
        resetInterval();
      } else if (e.key === "ArrowRight") {
        nextSlide();
        resetInterval();
      }
    }
  });

  // Mobile menu toggle
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      menuToggle.innerHTML = navLinks.classList.contains("active")
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        window.innerWidth <= 900 &&
        !navLinks.contains(e.target) &&
        !menuToggle.contains(e.target) &&
        navLinks.classList.contains("active")
      ) {
        navLinks.classList.remove("active");
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });

    // Close menu when clicking a link
    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 900) {
          navLinks.classList.remove("active");
          menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
      });
    });
  }

  // Auto slide functionality
  function startInterval() {
    if (slides.length > 0) {
      slideInterval = setInterval(nextSlide, 5000);
    }
  }

  function resetInterval() {
    clearInterval(slideInterval);
    startInterval();
  }

  if (slides.length > 0) {
    showSlide(0);
    startInterval();
  }

  // Handle scrolling to sections when coming from another page
  function scrollToHashSection() {
    const hash = window.location.hash;
    if (hash) {
      // Remove the # from the hash
      const targetId = hash.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Small delay to ensure page is fully loaded
        setTimeout(() => {
          const headerHeight = document.querySelector("header").offsetHeight;
          const bannerHeight =
            document.querySelector(".header-banner").offsetHeight;
          const totalOffset = headerHeight + bannerHeight + 20; // 20px extra padding

          window.scrollTo({
            top: targetElement.offsetTop - totalOffset,
            behavior: "smooth",
          });
        }, 100);
      }
    }
  }

  // Call on page load
  scrollToHashSection();

  // Handle anchor links on the same page
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector("header").offsetHeight;
        const bannerHeight =
          document.querySelector(".header-banner").offsetHeight;
        const totalOffset = headerHeight + bannerHeight + 20;

        window.scrollTo({
          top: targetElement.offsetTop - totalOffset,
          behavior: "smooth",
        });

        // Update URL hash without jumping
        history.pushState(null, null, targetId);
      }
    });
  });

  // Handle links from other pages that point to homepage sections
  document.querySelectorAll('a[href^="/#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      // Only prevent default if we're on the same page
      if (
        window.location.pathname === "/" ||
        window.location.pathname.endsWith("index.html")
      ) {
        e.preventDefault();
        const targetId = this.getAttribute("href").substring(2); // Remove /#
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          const headerHeight = document.querySelector("header").offsetHeight;
          const bannerHeight =
            document.querySelector(".header-banner").offsetHeight;
          const totalOffset = headerHeight + bannerHeight + 20;

          window.scrollTo({
            top: targetElement.offsetTop - totalOffset,
            behavior: "smooth",
          });

          // Update URL hash without jumping
          history.pushState(null, null, `#${targetId}`);
        }
      }
      // If on different page, let the default link behavior work
    });
  });

  // Update active nav link on scroll
  const sections = document.querySelectorAll("section[id]");

  function updateActiveNavLink() {
    let scrollPosition = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        document.querySelectorAll(".nav-links a").forEach((link) => {
          link.classList.remove("active");
          const href = link.getAttribute("href");
          if (href === `#${sectionId}` || href === `/#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveNavLink);

  // Header scroll effect
  window.addEventListener("scroll", function () {
    const header = document.querySelector("header");
    if (header) {
      if (window.scrollY > 100) {
        header.style.boxShadow = "0 10px 25px rgba(212, 175, 55, 0.2)";
      } else {
        header.style.boxShadow = "0 5px 20px rgba(212, 175, 55, 0.1)";
      }
    }
  });

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe cards for animation
  document
    .querySelectorAll(".seller-card, .category-card, .collection-card")
    .forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
      card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(card);
    });

  // Handle browser resize
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 900 && navLinks) {
        navLinks.classList.remove("active");
        if (menuToggle) menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
    }, 250);
  });

  // Prevent zoom on double tap (mobile)
  let lastTouchEnd = 0;
  document.addEventListener(
    "touchend",
    function (event) {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    },
    false,
  );
});
