// Active navigation link highlighting
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'home.html';
    const normalizedPage = decodeURIComponent(currentPage);

    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        const href = decodeURIComponent(link.getAttribute('href') || '');
        if (!href || href === '#') return;

        if (href === normalizedPage || (normalizedPage === 'index.html' && href === 'home.html') || (normalizedPage === '' && href === 'home.html')) {
            link.classList.add('active');
            const parentDropdown = link.closest('.dropdown');
            if (parentDropdown) {
                const parentLink = parentDropdown.querySelector('> a');
                if (parentLink) parentLink.classList.add('active');
            }
        }
    });
});

// Swiper initialization (if present on page)
if (typeof Swiper !== 'undefined' && document.querySelector('.morereviewsSwiper')) {
    new Swiper(".morereviewsSwiper", {
        slidesPerView: 5,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
            },
            576: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 3,
            },
            992: {
                slidesPerView: 4,
            },
            1200: {
                slidesPerView: 5,
            }
        }
    });
}