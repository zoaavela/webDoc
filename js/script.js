/* ================================================================
   AU FIL DU COURT - IMMERSIVE ANIMATIONS
   Advanced Animation & Interaction Engine
   ================================================================ */

// ================================================================
// INITIALIZATION
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
    initIntroAnimation();
    initNavigation();
    initScrollReveal();
    initParallax();
    initHorizontalScroll();
    initSmoothAnchors();
    initChapterCards();
    initVideoSection();
});

// ================================================================
// INTRO ANIMATION - Curtain Reveal
// ================================================================
function initIntroAnimation() {
    const introCurtain = document.querySelector('.intro-curtain');
    const pageIntro = document.querySelector('.page-intro');
    
    // Home page intro
    if (introCurtain) {
        // Prevent scroll during animation
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            document.body.style.overflow = '';
            document.body.classList.add('intro-complete');
        }, 3000);
    }
    
    // Articles page intro
    if (pageIntro) {
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            document.body.style.overflow = '';
        }, 2300);
    }
}

// ================================================================
// NAVIGATION - Scroll Effects
// ================================================================
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navbar) return;

    // Scroll Effect
    let ticking = false;

    function updateNavbar() {
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });

    // Mobile Menu
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// ================================================================
// SCROLL REVEAL - Intersection Observer
// ================================================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll(`
        .reveal,
        .reveal-left,
        .reveal-right,
        .reveal-scale,
        .video-wrapper,
        .video-info,
        .chapter-card,
        .article-card,
        .related-card,
        .stat-item,
        .article-preview
    `);

    if (revealElements.length === 0) return;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
}

// ================================================================
// PARALLAX - Hero Background
// ================================================================
function initParallax() {
    const heroElements = document.querySelectorAll('.hero-media img, .doc-hero-bg');
    
    if (heroElements.length === 0) return;

    let ticking = false;

    function updateParallax() {
        const scrollY = window.scrollY;
        
        heroElements.forEach(el => {
            const section = el.closest('section') || el.closest('.hero') || el.closest('.doc-hero');
            if (!section) return;
            
            const sectionHeight = section.offsetHeight;
            
            if (scrollY < sectionHeight) {
                const yOffset = scrollY * 0.3;
                el.style.transform = `translateY(${yOffset}px) scale(1.1)`;
            }
        });
        
        // Hero content fade
        const heroContent = document.querySelector('.hero-content, .doc-hero-content');
        if (heroContent && scrollY < 600) {
            const opacity = 1 - (scrollY / 500);
            const translateY = scrollY * 0.2;
            heroContent.style.opacity = Math.max(0, opacity);
            heroContent.style.transform = `translateY(${translateY}px)`;
        }
        
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
}

// ================================================================
// HORIZONTAL SCROLL - Articles Carousel
// ================================================================
function initHorizontalScroll() {
    const scrollContainer = document.querySelector('.articles-scroll');
    
    if (!scrollContainer) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    scrollContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        scrollContainer.classList.add('grabbing');
        startX = e.pageX - scrollContainer.offsetLeft;
        scrollLeft = scrollContainer.scrollLeft;
    });

    scrollContainer.addEventListener('mouseleave', () => {
        isDown = false;
        scrollContainer.classList.remove('grabbing');
    });

    scrollContainer.addEventListener('mouseup', () => {
        isDown = false;
        scrollContainer.classList.remove('grabbing');
    });

    scrollContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollContainer.offsetLeft;
        const walk = (x - startX) * 2;
        scrollContainer.scrollLeft = scrollLeft - walk;
    });

    // Touch support
    let touchStartX;
    let touchScrollLeft;

    scrollContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].pageX;
        touchScrollLeft = scrollContainer.scrollLeft;
    }, { passive: true });

    scrollContainer.addEventListener('touchmove', (e) => {
        const touchX = e.touches[0].pageX;
        const walk = (touchStartX - touchX) * 1.5;
        scrollContainer.scrollLeft = touchScrollLeft + walk;
    }, { passive: true });
}

// ================================================================
// SMOOTH ANCHORS - Hash Navigation
// ================================================================
function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const navHeight = document.querySelector('.navbar')?.offsetHeight || 80;
                const targetPosition = target.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                history.pushState(null, '', href);
            }
        });
    });

    // Handle initial hash
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if (target) {
                const navHeight = document.querySelector('.navbar')?.offsetHeight || 80;
                window.scrollTo({
                    top: target.offsetTop - navHeight - 20,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
}

// ================================================================
// CHAPTER CARDS - Staggered Animation
// ================================================================
function initChapterCards() {
    const chaptersSection = document.querySelector('.chapters-section');
    if (!chaptersSection) return;

    const chapterCards = chaptersSection.querySelectorAll('.chapter-card');
    if (chapterCards.length === 0) return;

    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                chapterCards.forEach((card, index) => {
                    card.style.transitionDelay = `${index * 0.1}s`;
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, 100);
                });
                staggerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    staggerObserver.observe(chaptersSection);
}

// ================================================================
// VIDEO SECTION - Focus Effects
// ================================================================
function initVideoSection() {
    const videoWrapper = document.querySelector('.video-wrapper');
    if (!videoWrapper) return;

    videoWrapper.addEventListener('mousemove', (e) => {
        const rect = videoWrapper.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        videoWrapper.style.setProperty('--mouse-x', `${x}%`);
        videoWrapper.style.setProperty('--mouse-y', `${y}%`);
    });
}

// ================================================================
// ARTICLE CARDS - Staggered Animation
// ================================================================
function initArticleCards() {
    const articlesGrid = document.querySelector('.articles-grid');
    if (!articlesGrid) return;

    const articleCards = articlesGrid.querySelectorAll('.article-card');
    if (articleCards.length === 0) return;

    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                articleCards.forEach((card, index) => {
                    card.style.transitionDelay = `${index * 0.15}s`;
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, 200);
                });
                staggerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });

    staggerObserver.observe(articlesGrid);
}

// Initialize article cards after DOM load
document.addEventListener('DOMContentLoaded', initArticleCards);

// ================================================================
// PLAY BUTTON - Video
// ================================================================
const playButtons = document.querySelectorAll('.doc-play, .play-button');
playButtons.forEach(button => {
    if (!button) return;
    
    button.addEventListener('click', function(e) {
        this.style.transform = 'translate(-50%, -50%) scale(0.9)';
        setTimeout(() => {
            this.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 150);
    });
});

// ================================================================
// LAZY LOADING - Images
// ================================================================
const lazyImages = document.querySelectorAll('img[data-src]');
if (lazyImages.length > 0) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    }, { rootMargin: '100px' });

    lazyImages.forEach(img => imageObserver.observe(img));
}

// ================================================================
// ACTIVE NAVIGATION - Scroll Spy
// ================================================================
const sections = document.querySelectorAll('section[id], article[id]');
const navLinksAll = document.querySelectorAll('.nav-link');

if (sections.length > 0 && navLinksAll.length > 0) {
    let scrollSpyTicking = false;
    
    function updateActiveNav() {
        const scrollY = window.pageYOffset + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinksAll.forEach(link => {
                    link.classList.remove('active');
                    const href = link.getAttribute('href');
                    if (href && (href === `#${sectionId}` || href.includes(sectionId))) {
                        link.classList.add('active');
                    }
                });
            }
        });
        
        scrollSpyTicking = false;
    }

    window.addEventListener('scroll', () => {
        if (!scrollSpyTicking) {
            requestAnimationFrame(updateActiveNav);
            scrollSpyTicking = true;
        }
    }, { passive: true });
}

// ================================================================
// PAGE LOAD COMPLETE
// ================================================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
