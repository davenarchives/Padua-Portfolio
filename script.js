// Load components
const loadComponent = async (id, file) => {
  try {
    const res = await fetch(file)
    const html = await res.text()
    document.getElementById(id).innerHTML = html

    // Initialize mobile menu after header is loaded
    if (id === "header") {
      initializeMobileMenu()
    }
  } catch (error) {
    console.error(`Error loading ${file}:`, error)
  }
}

// Load all components
const sections = ["header", "hero", "about", "skills", "projects", "contact"]
sections.forEach((section) => {
  loadComponent(section, `components/${section}.html`)
})

// Initialize mobile menu
function initializeMobileMenu() {
  const mobileToggle = document.querySelector(".mobile-menu-toggle")
  const navLinks = document.querySelector(".nav-links")

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      mobileToggle.classList.toggle("active")
      navLinks.classList.toggle("active")
    })

    // Close mobile menu when clicking on a link
    navLinks.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        mobileToggle.classList.remove("active")
        navLinks.classList.remove("active")
      }
    })

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target)) {
        mobileToggle.classList.remove("active")
        navLinks.classList.remove("active")
      }
    })
  }
}

// Enhanced smooth scrolling for navigation links
document.addEventListener("click", (e) => {
  if (e.target.tagName === "A" && e.target.getAttribute("href")?.startsWith("#")) {
    e.preventDefault()
    const targetId = e.target.getAttribute("href")
    const target = document.querySelector(targetId)

    if (target) {
      const headerHeight = document.querySelector(".header")?.offsetHeight || 0
      const targetPosition = target.offsetTop - headerHeight

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    }
  }
})

// Enhanced skill bars animation with intersection observer
const observerOptions = {
  threshold: 0.5,
  rootMargin: "0px 0px -100px 0px",
}

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const skillFills = entry.target.querySelectorAll(".skill-fill")
      skillFills.forEach((fill, index) => {
        setTimeout(() => {
          const skillLevel = fill.getAttribute("data-skill")
          fill.style.width = skillLevel + "%"
        }, index * 200)
      })
      skillObserver.unobserve(entry.target)
    }
  })
}, observerOptions)

// Enhanced header background change on scroll
let lastScrollY = window.scrollY
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header")
  const currentScrollY = window.scrollY

  if (header) {
    if (currentScrollY > 100) {
      header.style.background = "rgba(255, 255, 255, 0.15)"
      header.style.backdropFilter = "blur(25px)"
    } else {
      header.style.background = "rgba(255, 255, 255, 0.1)"
      header.style.backdropFilter = "blur(20px)"
    }

    // Hide/show header on scroll
    if (currentScrollY > lastScrollY && currentScrollY > 200) {
      header.style.transform = "translateY(-100%)"
    } else {
      header.style.transform = "translateY(0)"
    }
  }

  lastScrollY = currentScrollY
})

// Enhanced project cards animation
const projectObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
          entry.target.style.animation = `fadeInUp 0.6s ease-out forwards`
        }, index * 150)
        projectObserver.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.1 },
)

// General scroll animation observer
const scrollObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
        scrollObserver.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
)

// Initialize observers when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Observe skills section
  setTimeout(() => {
    const skillsSection = document.querySelector("#skills")
    if (skillsSection) {
      skillObserver.observe(skillsSection)
    }

    // Observe project cards
    const projectCards = document.querySelectorAll(".project-card")
    projectCards.forEach((card) => {
      card.style.opacity = "0"
      card.style.transform = "translateY(50px)"
      card.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
      projectObserver.observe(card)
    })

    // Add scroll animations to other elements
    const animateElements = document.querySelectorAll(".about-text, .contact-item, .skill-card")
    animateElements.forEach((el, index) => {
      el.classList.add("animate-on-scroll")
      if (index < 4) el.classList.add(`stagger-${index + 1}`)
      scrollObserver.observe(el)
    })
  }, 1000)
})

// Add loading animation
window.addEventListener("load", () => {
  document.body.style.opacity = "0"
  document.body.style.transition = "opacity 0.5s ease-in-out"

  setTimeout(() => {
    document.body.style.opacity = "1"
  }, 100)
})

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments
    
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Apply throttling to scroll events
window.addEventListener(
  "scroll",
  throttle(() => {
    // Scroll-dependent animations can be added here
  }, 16),
) // ~60fps
