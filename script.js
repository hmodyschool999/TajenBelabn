/**
 * Tajen Belabn - Modern Script
 * Developed for High Performance & Smooth UX
 */

document.addEventListener('DOMContentLoaded', () => {

    /* 1. Mobile Navigation Logic */
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    }

    /* 2. Sticky Header Effect */
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* 3. Hero Slider Functionality */
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    const slideInterval = 5000;

    function nextSlide() {
        if (slides.length === 0) return;
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    if (slides.length > 0) {
        setInterval(nextSlide, slideInterval);
    }

    /* 4. Scroll Reveal Animation (Intersection Observer) */
    const revealElements = document.querySelectorAll('.reveal-text, .reveal-up, .reveal-right, .reveal-left');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* 5. Floating Action Button (FAB) Logic */
    const fabTrigger = document.querySelector('#fab-trigger');
    const fabWrapper = document.querySelector('.fab-wrapper');
    const hiringSection = document.querySelector('.hiring-banner');

    if (fabWrapper) {
        fabWrapper.style.opacity = '0';
        fabWrapper.style.transform = 'translateY(100px) scale(0.5)';
        fabWrapper.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
        fabWrapper.style.visibility = 'hidden';
    }

    if (hiringSection && fabWrapper) {
        const fabObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    fabWrapper.style.visibility = 'visible';
                    fabWrapper.style.opacity = '1';
                    fabWrapper.style.transform = 'translateY(0) scale(1)';
                } else {
                    const rect = hiringSection.getBoundingClientRect();
                    if (rect.top > window.innerHeight) {
                        fabWrapper.style.opacity = '0';
                        fabWrapper.style.transform = 'translateY(100px) scale(0.5)';
                        fabWrapper.style.visibility = 'hidden';
                        fabWrapper.classList.remove('active');
                        if (fabTrigger) fabTrigger.style.transform = 'rotate(0deg)';
                    }
                }
            });
        }, {
            threshold: 0.1 
        });

        fabObserver.observe(hiringSection);
    }

    if (fabTrigger && fabWrapper) {
        fabTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            fabWrapper.classList.toggle('active');
            fabTrigger.style.transform = fabWrapper.classList.contains('active') 
                ? 'rotate(45deg)' 
                : 'rotate(0deg)';
        });

        document.addEventListener('click', (e) => {
            if (!fabWrapper.contains(e.target)) {
                fabWrapper.classList.remove('active');
                if (fabTrigger) fabTrigger.style.transform = 'rotate(0deg)';
            }
        });
    }

});