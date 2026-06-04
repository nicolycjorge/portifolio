document.addEventListener('DOMContentLoaded', () => {

    const WHATSAPP_NUMBER = '5519971317811';

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
                return;
            }

            const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
            window.open(waUrl, '_blank');
            form.reset();
        });

        form.dataset.attached = '1';
    }

    if (contactForm) attachWhatsAppHandler();

    // scroll-spy: destaca o item de navegação conforme a seção visível
    const navItems = document.querySelectorAll('.nav-item');
    const sections = Array.from(document.querySelectorAll('section[id]'));

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
                const link = document.querySelector('.nav-item[href="#' + id + '"]');
                if (link) link.classList.add('active');
            }
        });
    }, { threshold: 0.55, rootMargin: '0px 0px -20% 0px' });

    sections.forEach(s => sectionObserver.observe(s));

    navItems.forEach(n => {
        n.addEventListener('click', () => {
            navItems.forEach(x => x.classList.remove('active'));
            n.classList.add('active');
        });
    });

    // Scroll-spy fallback for mobile (some mobile browsers don't trigger IO reliably)
    let ticking = false;
    const headerOffset = () => document.querySelector('.main-header')?.offsetHeight || 0;
    const onScrollSpy = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const offset = headerOffset() + 8; // small buffer
            let current = sections[0];
            for (const sec of sections) {
                const rect = sec.getBoundingClientRect();
                if (rect.top <= offset && rect.bottom > offset) {
                    current = sec;
                    break;
                }
                // if none match, pick the one closest to top
                if (rect.top > 0 && Math.abs(rect.top) < Math.abs(current.getBoundingClientRect().top)) {
                    current = sec;
                }
            }
            const id = current.id;
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            const link = document.querySelector('.nav-item[href="#' + id + '"]');
            if (link) link.classList.add('active');
            ticking = false;
        });
    };

    window.addEventListener('scroll', onScrollSpy, { passive: true });

    // Hero parallax (mouse) - sutil
    const hero = document.querySelector('.hero-section');
    const heroContent = document.querySelector('.hero-content');
    if (hero && heroContent) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            const tx = x * 18; // horizontal shift
            const ty = y * 10; // vertical shift
            heroContent.style.transform = `translate(${tx}px, ${ty}px) scale(1.02)`;
        });
        hero.addEventListener('mouseleave', () => {
            heroContent.style.transform = '';
        });
    }

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

    // efeito tilt nas imagens e entrada em cascata
    const wrappers = document.querySelectorAll('.image-wrapper');
    wrappers.forEach(wrapper => {
        const img = wrapper.querySelector('img');
        if (!img) return;

        wrapper.addEventListener('mousemove', (e) => {
            const rect = wrapper.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width;
            const py = (e.clientY - rect.top) / rect.height;
            const rotateY = (px - 0.5) * 12; // degrees
            const rotateX = (0.5 - py) * 8;
            img.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
            img.style.boxShadow = '0 20px 40px rgba(0,0,0,0.08)';
        });

        wrapper.addEventListener('mouseleave', () => {
            img.style.transform = '';
            img.style.boxShadow = '';
        });
    });

    // stagger reveal inicial caso o observer não alcance imediatamente
    portfolioItems.forEach((item, i) => {
        setTimeout(() => {
            if (!item.classList.contains('card-visible')) {
                item.classList.add('card-visible');
            }
        }, 120 * i + 300);
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
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // activate nav item if page loaded with hash
    const applyHashActive = () => {
        const hash = window.location.hash.replace('#', '');
        if (!hash) return;
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        const link = document.querySelector('.nav-item[href="#' + hash + '"]');
        if (link) link.classList.add('active');
    };
    applyHashActive();
});
/* Ensure page content isn't hidden under the fixed header.
   JS calculates the actual header height and applies it as body padding-top.
*/
function syncBodyPaddingToHeader() {
    var header = document.querySelector('.main-header');
    if (!header) return;
    var height = header.offsetHeight;
    document.documentElement.style.setProperty('--header-height', height + 'px');
    document.body.style.paddingTop = height + 'px';
}

window.addEventListener('DOMContentLoaded', syncBodyPaddingToHeader);
window.addEventListener('load', syncBodyPaddingToHeader);
window.addEventListener('resize', function () {
    // debounce resize adjustments
    clearTimeout(window.__headerPaddingTimeout);
    window.__headerPaddingTimeout = setTimeout(syncBodyPaddingToHeader, 120);
});

// Also observe header size changes (if fonts/images change after load)
var headerEl = document.querySelector('.main-header');
if (window.ResizeObserver && headerEl) {
    var ro = new ResizeObserver(syncBodyPaddingToHeader);
    ro.observe(headerEl);
}