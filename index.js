document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    const mainHeader = document.getElementById('main-header');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerButton = document.querySelector('.hamburger-button button');
    const scrollThreshold = 50;

    function setHeaderState() {
        if (!mainHeader) return;
        if (window.pageYOffset > scrollThreshold) {
            mainHeader.classList.add('header-scrolled');
            if (hamburgerButton) hamburgerButton.style.color = 'var(--primary-color)';
        } else {
            mainHeader.classList.remove('header-scrolled');
            if (hamburgerButton) hamburgerButton.style.color = 'white';
        }
    }

    setHeaderState();

    window.addEventListener('scroll', setHeaderState);

    const navLinks = mobileMenu.querySelectorAll('a.header-nav-link-mobile');

    if (hamburgerButton && mobileMenu) {
        hamburgerButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('mobile-menu-active');
            const icon = hamburgerButton.querySelector('svg');
            const isMenuOpen = mobileMenu.classList.contains('mobile-menu-active');
            const isHeaderScrolled = mainHeader.classList.contains('header-scrolled');

            if (isMenuOpen) {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
                hamburgerButton.style.color = isHeaderScrolled ? 'var(--primary-color)' : 'white';
            } else {
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>';
                hamburgerButton.style.color = isHeaderScrolled ? 'var(--primary-color)' : 'white';
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('mobile-menu-active');
                const icon = hamburgerButton.querySelector('svg');
                icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>';
                if (mainHeader.classList.contains('header-scrolled')) {
                    hamburgerButton.style.color = 'var(--primary-color)';
                } else {
                    hamburgerButton.style.color = 'white';
                }
            });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    const contactForm = document.getElementById('contact-form');
    const thankYouMessage = document.getElementById('thankYouMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Disable the submit button to prevent multiple submissions
            const submitButton = contactForm.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
            }

            try {
                const token = await grecaptcha.execute('6LcEFmYrAAAAAEiA7b5PxpXHcpgWpO5P9HX8ZLVN', { action: 'submit' });

                const formData = new FormData(contactForm);
                formData.append('g-recaptcha-response', token);

                const scriptURL = 'https://script.google.com/macros/s/AKfycby_VV-NDhyZDTEaBkN7aEdsDcreIpp0JUX0eWMcUHpXeKANx94wVOWPXhNBvDZchY70Zw/exec';

                // We are not using FormData directly to avoid preflight issues.
                // Instead, we use URLSearchParams which sends as 'application/x-www-form-urlencoded'.
                const body = new URLSearchParams(formData);

                const response = await fetch(scriptURL, {
                    method: 'POST',
                    body: body,
                });

                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }

                // Hide the form and show the custom thank you message
                contactForm.style.display = 'none';
                if (thankYouMessage) {
                    thankYouMessage.classList.remove('hidden');
                } else {
                    console.warn('Thank you message element not found.');
                    // Optionally reset button if thank you message fails to show
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.textContent = 'Send Message';
                    }
                }
                // contactForm.reset(); // Optionally keep this if you want to reset when showing again

            } catch (error) {
                console.error('Error submitting form:', error);
                let errorMessage = 'There was an error sending your message. Please try again.';
                if (error.message.includes('Server error')) {
                    errorMessage = 'There was a server issue. Please try again later.';
                } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
                    errorMessage = 'Network error. Please check your internet connection and try again.';
                }
                alert(errorMessage);
                // Re-enable the submit button in case of error
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Send Message';
                }
            }
        });
    }

    const animatedElements = document.querySelectorAll('.animate');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Carousel Functionality
    const carouselTrack = document.querySelector('#advisory-board .flex.overflow-x-auto');
    const advisorCards = carouselTrack ? Array.from(carouselTrack.children) : [];
    const prevButton = document.querySelector('#advisory-board button[aria-label="Previous Advisor"]');
    const nextButton = document.querySelector('#advisory-board button[aria-label="Next Advisor"]');
    let currentScroll = 0;

    function updateCarouselButtons() {
        if (!carouselTrack || !prevButton || !nextButton || advisorCards.length === 0) return;

        const trackWidth = carouselTrack.scrollWidth;
        const containerWidth = carouselTrack.clientWidth;

        // Show/hide buttons based on scrollability
        if (trackWidth > containerWidth) {
            prevButton.classList.remove('hidden');
            nextButton.classList.remove('hidden');
        } else {
            prevButton.classList.add('hidden');
            nextButton.classList.add('hidden');
            return; // No need to update if not scrollable
        }

        // Disable prev button if at the beginning
        if (carouselTrack.scrollLeft <= 0) {
            prevButton.disabled = true;
            prevButton.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            prevButton.disabled = false;
            prevButton.classList.remove('opacity-50', 'cursor-not-allowed');
        }

        // Disable next button if at the end
        // Add a small tolerance (e.g., 1px) for floating point inaccuracies
        if (carouselTrack.scrollLeft >= (trackWidth - containerWidth - 1)) {
            nextButton.disabled = true;
            nextButton.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            nextButton.disabled = false;
            nextButton.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }


    if (carouselTrack && prevButton && nextButton && advisorCards.length > 0) {
        prevButton.addEventListener('click', () => {
            const cardWidth = advisorCards[0].offsetWidth + parseFloat(getComputedStyle(advisorCards[0]).marginRight);
            carouselTrack.scrollBy({ left: -cardWidth, behavior: 'smooth' });
        });

        nextButton.addEventListener('click', () => {
            const cardWidth = advisorCards[0].offsetWidth + parseFloat(getComputedStyle(advisorCards[0]).marginRight);
            carouselTrack.scrollBy({ left: cardWidth, behavior: 'smooth' });
        });

        // Update buttons on scroll (e.g., user manual scroll)
        carouselTrack.addEventListener('scroll', updateCarouselButtons);
        // Update buttons on load and resize
        window.addEventListener('load', updateCarouselButtons);
        window.addEventListener('resize', updateCarouselButtons); // For responsive changes

        updateCarouselButtons(); // Initial check
    }

    function fixWidowsInTextBlocks() {
        document.querySelectorAll('p, h1, h2, h3, h4, h5, h6').forEach(el => {
            el.innerHTML = el.innerHTML.replace(/\s+([^\s<]+)\s*$/, '&nbsp;$1');
        });
    }

    fixWidowsInTextBlocks();
}); 