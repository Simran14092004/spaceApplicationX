// Enhanced Navigation and Smooth Scrolling System
const BASE_URL = 'https://spaceapplicationx.onrender.com';

// Elements
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav__link');

/* Menu show */
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

/* Menu hidden */
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}
// Hide menu when any nav link is clicked (for mobile UX)
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
});



/* Enhanced smooth scroll and navigation system */
const handleNavigation = (event) => {
    event.preventDefault();
    
    const link = event.target;
    const href = link.getAttribute('href');
    
    // Close mobile menu immediately
    if (navMenu) {
        navMenu.classList.remove('show-menu');
    }
    
    // Handle different types of links
    if (href.startsWith('#')) {
        // Same page anchor link
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
        }
    } else if (href.includes('#')) {
        // Cross-page anchor link (e.g., index.html#about)
        const [page, sectionId] = href.split('#');
        
        if (window.location.pathname.includes(page) || page === '/') {
            // Already on target page, scroll to section
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                });
            }
        } else {
            // Navigate to different page with section
            window.location.href = href;
        }
    } else {
        // Regular page navigation
        window.location.href = href;
    }
};

// Attach event listeners to all navigation links
navLinks.forEach((link) => {
    link.addEventListener('click', handleNavigation);
});

// Handle page load scrolling for cross-page navigation
window.addEventListener('load', () => {
    const hash = window.location.hash;
    if (hash) {
        const targetSection = document.getElementById(hash.substring(1));
        if (targetSection) {
            setTimeout(() => {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                });
            }, 100);
        }
    }
});

// HERO SECTION SLIDER
document.addEventListener("DOMContentLoaded", function () {
    const heroSlides = document.querySelectorAll(".hero-slider img");
    const heroDots = document.querySelectorAll(".slider-dots .dot");

    let currentHeroSlide = 0;
    const slideInterval = 3000;
    let heroTimer;

    function showHeroSlide(index) {
        if (heroSlides.length === 0) return;
        
        heroSlides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add("active");
            } else {
                slide.classList.remove("active");
            }
        });

        heroDots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
        });

        currentHeroSlide = index;
    }

    function startHeroAutoSlide() {
        if (heroSlides.length > 0) {
            heroTimer = setInterval(() => {
                currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
                showHeroSlide(currentHeroSlide);
            }, slideInterval);
        }
    }

    if (heroDots.length > 0) {
        heroDots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                clearInterval(heroTimer);
                showHeroSlide(index);
                startHeroAutoSlide();
            });
        });
    }

    if (heroSlides.length > 0) {
        showHeroSlide(currentHeroSlide);
        startHeroAutoSlide();
    }
});

/*=============== SWIPER TRAVEL ARTICLE ===============*/ 
const swiperTravel = new Swiper('.travel__swiper', {
    loop: true,
    spaceBetween: 32,
    grabCursor: true,
    slidesPerView: 'auto',
    centeredSlides: 'auto',

    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
  
    breakpoints: {
        600: {
            slidesPerView: 2,
        },
        900: {
            slidesPerView: 3,
        },
    },
});

/*=============== SWIPER SERVICES ===============*/ 
const swiperServices = new Swiper('.Services__swiper', {
    loop: true,
    spaceBetween: 32,
    grabCursor: true,
    slidesPerView: 'auto',
    centeredSlides: 'auto',

    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
  
    breakpoints: {
        600: {
            slidesPerView: 2,
        },
        900: {
            slidesPerView: 3,
        },
    },
});

// Inject modal HTML and initialize
document.addEventListener('DOMContentLoaded', () => {
  fetch(`${BASE_URL}/auth-modal`)
 .then(res => res.text())
    .then(html => {
      document.getElementById('auth-modal-container').innerHTML = html;
      window.AuthModal.init(); // Initialize after injection
    })
    .catch(err => console.error('Modal load error:', err));
});


// Initialize authentication system
document.addEventListener('DOMContentLoaded', () => {
    loadAuthModal();
});

/*=============== SHOW SCROLL UP ===============*/ 
const scrollUp = () => {
    const scrollUp = document.getElementById('scroll-up');
    if (scrollUp) {
        window.scrollY >= 350 
            ? scrollUp.classList.add('show-scroll')
            : scrollUp.classList.remove('show-scroll');
    }
};
window.addEventListener('scroll', scrollUp);

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]');

const scrollActive = () => {
    const scrollDown = window.scrollY;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute('id');
        const navLink = document.querySelector(`.nav__list a[href*="${sectionId}"]`);
        
        if (navLink) {
            if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
                navLink.classList.add('active-link');
            } else {
                navLink.classList.remove('active-link');
            }
        }
    });
};

window.addEventListener('scroll', scrollActive);

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    distance: '50px',
    duration: 2000,
    easing: 'ease-out',
    reset: true,
});

ScrollReveal().reveal('.scroll-reveal', {
  origin: 'bottom',
  distance: '20px',
  duration: 800,
  delay: 100,
  easing: 'ease-in-out',
  reset: false
});

// Reveal independent text block below hero
sr.reveal('.text-section .section__title', { origin: 'bottom', delay: 300 });
sr.reveal('.text-section .section__description', { origin: 'bottom', delay: 500 });



// Hero Section Animations
if (document.querySelector('.hero-slider img.active')) {
    sr.reveal('.hero-slider img.active', { delay: 200, origin: 'top' });
}
if (document.querySelector('.hero')) {
    sr.reveal('.hero', { delay: 400, origin: 'bottom' });
}

// About Section Animations
sr.reveal('.about__card', { interval: 200 });
if (document.querySelector('.about__img')) {
    sr.reveal('.about__img', { origin: 'left', delay: 400 });
}
if (document.querySelector('.about__info, .about__description')) {
    sr.reveal('.about__info, .about__description', { origin: 'right', delay: 500 });
}
if (document.querySelector('.social-icons')) {
    sr.reveal('.social-icons', { origin: 'bottom', delay: 600 });
}

// Travel Section Animations
if (document.querySelector('.travel__lines')) {
    sr.reveal('.travel__lines', { origin: 'left', delay: 300 });
}
if (document.querySelector('.travel__container')) {
    sr.reveal('.travel__container', { delay: 400, origin: 'bottom' });
}
if (document.querySelector('.travel__card')) {
    sr.reveal('.travel__card', { interval: 150 });
}

// Email Signup Animations
if (document.querySelector('.signup-box')) {
    sr.reveal('.signup-box', { origin: 'bottom', delay: 500 });
}
if (document.querySelector('#signup-form input, #signup-form button')) {
    sr.reveal('#signup-form input, #signup-form button', { origin: 'bottom', interval: 200 });
}

// Footer Animations
if (document.querySelector('.footer__planet-1')) {
    sr.reveal('.footer__planet-1', { origin: 'left', delay: 400 });
}
if (document.querySelector('.footer__planet-2')) {
    sr.reveal('.footer__planet-2', { origin: 'right', delay: 500 });
}

// Inject modal HTML and initialize
document.addEventListener('DOMContentLoaded', () => {
  fetch(`${BASE_URL}/auth-modal`)
 .then(res => res.text())
    .then(html => {
      document.getElementById('auth-modal-container').innerHTML = html;
      window.AuthModal.init(); // Initialize after injection
    })
    .catch(err => console.error('Modal load error:', err));
});


//Accordion functionality
function toggleAccordion(headerElement) {
  const item = headerElement.closest('.accordion-item');
  const content = item.querySelector('.accordion-content');

  // Toggle active class
  item.classList.toggle('active');

  // Show/hide content
  if (item.classList.contains('active')) {
    content.style.maxHeight = content.scrollHeight + 'px';
  } else {
    content.style.maxHeight = null;
  }
}

