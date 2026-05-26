document.addEventListener('DOMContentLoaded', () => {
    
    const WHATSAPP_NUMBER = '5519988822112';

    const contactForm = document.getElementById('contact-form');
    function attachWhatsAppHandler() {
        const form = document.getElementById('contact-form');
        if (!form) return;
        if (form.dataset.attached === '1') return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const message = (form.querySelector('#contact-message') || {}).value?.trim() || '';
            const text = `${message}`;

            if (!WHATSAPP_NUMBER || WHATSAPP_NUMBER === 'WHATSAPP_NUMBER') {
                alert('Por favor, configure seu número de WhatsApp no arquivo script.js (variável WHATSAPP_NUMBER).');
                return;
            }

            const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
            window.open(waUrl, '_blank');
            form.reset();
        });

        form.dataset.attached = '1';
    }

    if (contactForm) attachWhatsAppHandler();

    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const selectedFilter = button.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');

                if (selectedFilter === 'all' || itemCategory === selectedFilter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 400);
                }
            });
        });
    });

    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('card-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    portfolioItems.forEach(item => {
        cardObserver.observe(item);
    });

    portfolioItems.forEach(item => {
        const overlay = item.querySelector('.overlay');
        const img = item.querySelector('.image-wrapper img');
        const title = item.querySelector('.item-info h3').innerText;
        const description = item.querySelector('.item-info p').innerText;

        overlay.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxCaption.innerHTML = '<strong>' + title + '</strong><br>' + description;
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightbox = () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
            closeLightbox();
        }
    });

    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '1rem 4rem';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.02)';
        } else {
            header.style.padding = '1.5rem 4rem';
            header.style.boxShadow = 'none';
        }
    });
});