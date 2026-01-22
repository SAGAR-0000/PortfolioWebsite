// ============================================
// PERFORMANCE FIX: Cache DOM elements to avoid repeated queries
// ============================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

// ============================================
// PERFORMANCE FIX: Throttle scroll handlers using requestAnimationFrame
// This prevents layout thrashing and ensures smooth 60FPS scrolling
// ============================================
let ticking = false;

function updateNavbarOnScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    ticking = false;
}

// FIX: Add passive: true to enable browser scroll optimizations
// This tells the browser the handler won't call preventDefault()
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateNavbarOnScroll);
        ticking = true;
    }
}, { passive: true });

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scroll for anchor links
// FIX: Use passive listener for touch-friendly scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// TYPING EFFECT
// ============================================
const CONFIG = {
    typingTexts: [
        'AI/ML Engineer',
        'Cloud Architect',
        'Data Scientist',
        'GenAI Developer',
        'Problem Solver'
    ],
    typingSpeed: 100,
    deletingSpeed: 50,
    pauseDuration: 2000
};

function initTypingEffect() {
    const typingElement = document.getElementById('typingText');
    if (!typingElement) return;

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = CONFIG.typingTexts[textIndex];

        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? CONFIG.deletingSpeed : CONFIG.typingSpeed;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = CONFIG.pauseDuration;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % CONFIG.typingTexts.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

// Intersection Observer for fade-in animations
// FIX: Using CSS classes instead of inline styles for better performance
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // FIX: Use classList instead of direct style manipulation
            // This is more performant and allows CSS to handle transitions
            entry.target.classList.add('section-visible');
        }
    });
}, observerOptions);

// Observe all sections - use CSS class for initial state
document.querySelectorAll('section').forEach(section => {
    section.classList.add('section-hidden');
    observer.observe(section);
});

// ============================================
// PERFORMANCE FIX: Active nav link highlighting with throttling
// ============================================
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

// FIX: Cache section positions to avoid layout thrashing
// Reading offsetTop forces layout recalculation
let sectionPositions = [];
function cacheSectionPositions() {
    sectionPositions = Array.from(sections).map(section => ({
        id: section.getAttribute('id'),
        top: section.offsetTop
    }));
}

// Cache positions on load and resize
cacheSectionPositions();
window.addEventListener('resize', cacheSectionPositions, { passive: true });

// FIX: Throttled scroll handler for active link highlighting
let navTicking = false;

function updateActiveNavLink() {
    let current = '';
    const scrollPos = window.pageYOffset;

    // Use cached positions instead of reading offsetTop in loop
    sectionPositions.forEach(section => {
        if (scrollPos >= section.top - 200) {
            current = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
    navTicking = false;
}

// FIX: Add passive: true and RAF throttling
window.addEventListener('scroll', () => {
    if (!navTicking) {
        window.requestAnimationFrame(updateActiveNavLink);
        navTicking = true;
    }
}, { passive: true });

// Add active nav link styles and section animation styles
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--primary-color);
    }
    .nav-link.active::after {
        width: 100%;
    }
    /* FIX: CSS-based section animations for better GPU compositing */
    .section-hidden {
        opacity: 0;
        transform: translateY(30px) translateZ(0);
        transition: opacity 0.6s ease, transform 0.6s ease;
        will-change: opacity, transform;
    }
    .section-visible {
        opacity: 1;
        transform: translateY(0) translateZ(0);
    }
`;
document.head.appendChild(style);

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        const mailtoLink = `mailto:sagar.sahu2023@ssipmt.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
        window.location.href = mailtoLink;
        contactForm.reset();
        alert('Opening your email client...');
    });
}

// Initialize typing effect when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initTypingEffect();
});

console.log('Portfolio loaded successfully! 🚀');
