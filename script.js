// DOM Elements
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const progressBar = document.getElementById('progressBar');
const navLinks = document.querySelectorAll('.nav-link');

// Mobile Menu Toggle Functionality
function toggleMobileMenu() {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
}

// Close mobile menu when clicking on a link
function closeMobileMenu() {
    menuToggle.classList.remove('active');
    navMenu.classList.remove('active');
}

// Scroll Effects Handler
function handleScroll() {
    const scrolled = window.pageYOffset;
    
    // Change navbar appearance on scroll
    if (scrolled > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Update progress bar
    updateProgressBar();
    
    // Highlight current section
    highlightCurrentSection();
}

// Update Progress Bar
function updateProgressBar() {
    const winHeight = window.innerHeight;
    const docHeight = document.body.scrollHeight;
    const scrollTop = window.pageYOffset;
    const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
    progressBar.style.width = Math.min(scrollPercent, 100) + '%';
}

// Smooth Scrolling for Navigation Links
function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    
    if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
    
    // Close mobile menu if open
    closeMobileMenu();
}

// Highlight Current Section in Navigation
function highlightCurrentSection() {
    const sections = document.querySelectorAll('.content-section');
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            // Remove active class from all links
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to current section link
            const activeLink = document.querySelector([href="#${sectionId}"]);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

// Create Particle Effect
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = '-10px';
    particle.style.opacity = '0.8';
    
    document.body.appendChild(particle);
    
    // Animate particle
    setTimeout(() => {
        particle.style.top = window.innerHeight + 'px';
        particle.style.opacity = '0';
    }, 100);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 3000);
}

// Initialize Particle System
function initParticles() {
    setInterval(createParticle, 2000);
}

// Intersection Observer for Section Animations
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all section content
    document.querySelectorAll('.section-content').forEach(section => {
        observer.observe(section);
    });
}

// Handle Window Resize
function handleResize() {
    // Close mobile menu on resize to larger screen
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
}

// Keyboard Navigation Support
function handleKeyPress(e) {
    if (e.key === 'Escape') {
        closeMobileMenu();
    }
}

// Initialize Event Listeners
function initEventListeners() {
    // Mobile menu toggle
    menuToggle.addEventListener('click', toggleMobileMenu);
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
    
    // Scroll events
    window.addEventListener('scroll', handleScroll);
    
    // Resize events
    window.addEventListener('resize', handleResize);
    
    // Keyboard events
    document.addEventListener('keydown', handleKeyPress);
    
    // Click outside mobile menu to close
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

// Throttle Function for Performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Optimized Scroll Handler
const optimizedScrollHandler = throttle(handleScroll, 16);

// Initialize Application
function init() {
    // Set up event listeners
    initEventListeners();
    
    // Initialize intersection observer
    initIntersectionObserver();
    
    // Start particle system
    initParticles();
    
    // Initial calls
    handleScroll();
    highlightCurrentSection();
    
    // Replace scroll handler with optimized version
    window.removeEventListener('scroll', handleScroll);
    window.addEventListener('scroll', optimizedScrollHandler);
}

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', init);

// Additional Utility Functions
const NavigationUtils = {
    // Get current active section
    getCurrentSection: () => {
        const sections = document.querySelectorAll('.content-section');
        const scrollPos = window.scrollY + 200;
        
        for (let section of sections) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                return section.getAttribute('id');
            }
        }
        return null;
    },
    
    // Navigate to section programmatically
    navigateToSection: (sectionId) => {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    },
    
    // Check if mobile menu is open
    isMobileMenuOpen: () => {
        return navMenu.classList.contains('active');
    }
};

// Export utilities for external use
window.NavigationUtils = NavigationUtils;
