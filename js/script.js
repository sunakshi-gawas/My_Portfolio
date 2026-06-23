// ===== Portfolio Website Script - Clean Version =====

// ===== 1: Mobile Navigation =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('.navbar');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !hamburger.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

// ===== 2: Navbar Scroll Effect =====
window.addEventListener('scroll', () => {
    if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 100);
    }
});

// ===== 3: Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
        }
    });
});

// ===== 5: Scroll To Top Button =====
const scrollTopBtn = document.createElement('button');
scrollTopBtn.id = 'scroll-top-btn';
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
scrollTopBtn.style.cssText = `
    position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px;
    border-radius: 50%; background: linear-gradient(135deg, #6E3482, #A56ABD);
    color: white; border: none; font-size: 1.2rem; cursor: pointer;
    opacity: 0; transform: scale(0); transition: all 0.3s ease;
    z-index: 1000; box-shadow: 0 5px 20px rgba(110, 52, 130, 0.4);
`;
document.body.appendChild(scrollTopBtn);

scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
scrollTopBtn.addEventListener('mouseenter', () => scrollTopBtn.style.transform = 'scale(1.1) rotate(360deg)');
scrollTopBtn.addEventListener('mouseleave', () => scrollTopBtn.style.transform = 'scale(1)');

// ===== 6: Combined Scroll Listener =====
window.addEventListener('scroll', () => {
    // Scroll to top button visibility
    const show = window.pageYOffset > 500;
    scrollTopBtn.style.opacity = show ? '1' : '0';
    scrollTopBtn.style.transform = show ? 'scale(1)' : 'scale(0)';
});

// ===== 7: Cursor Trail (desktop only) =====
if (window.innerWidth > 768) {
    let cursorTrail = [];
    document.addEventListener('mousemove', (e) => {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = e.pageX + 'px';
        trail.style.top = e.pageY + 'px';
        document.body.appendChild(trail);
        cursorTrail.push(trail);
        if (cursorTrail.length > 10) cursorTrail.shift().remove();
        setTimeout(() => {
            trail.remove();
            cursorTrail = cursorTrail.filter(t => t !== trail);
        }, 500);
    });
}

// ===== 8: Dynamic Styles =====
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    .cursor-trail {
        position: absolute; width: 5px; height: 5px;
        background: radial-gradient(circle, #6E3482, transparent);
        border-radius: 50%; pointer-events: none;
        animation: trailFade 0.5s ease-out forwards; z-index: 9999;
    }
    @keyframes trailFade {
        0% { transform: scale(1); opacity: 0.8; }
        100% { transform: scale(0); opacity: 0; }
    }
    @keyframes ripplePulse {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(1.5); opacity: 0; }
    }
    @keyframes confettiFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(dynamicStyles);

// ===== 9: DOMContentLoaded — All DOM-dependent logic =====
document.addEventListener('DOMContentLoaded', function() {

    // --- 9a: Intersection Observer (scroll animations) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const animateObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('animate-in');
        });
    }, observerOptions);

    document.querySelectorAll(
        '.hero-text, .hero-visual, .about-text, .about-stats, .portfolio-item, .contact-info, .contact-form, .section-header'
    ).forEach(el => animateObserver.observe(el));

    // --- 9b: Fade-in for misc elements ---
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.work-item, .stat-card, .tech-item, .testimonial-card')
        .forEach(el => fadeObserver.observe(el));

    // --- 9c: Bento grid observer ---
    const bentoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            }
        });
    }, observerOptions);
    document.querySelectorAll('.bento-item').forEach(item => bentoObserver.observe(item));

    // --- 9d: Stats counter animation ---
    const animateValue = (element, start, end, duration, suffix) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.textContent = Math.floor(progress * (end - start) + start) + suffix;
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const originalText = target.textContent;
                const endValue = parseInt(originalText);
                const suffix = originalText.includes('%') ? '%' : '+';
                target.textContent = '0' + suffix;
                animateValue(target, 0, endValue, 2000, suffix);
                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(stat => statsObserver.observe(stat));

    // --- 9e: Role carousel ---
    const roles = document.querySelectorAll('.role');
    if (roles.length > 0) {
        let currentRoleIndex = 0;
        roles.forEach(r => r.classList.remove('active'));
        roles[0].classList.add('active');
        setInterval(() => {
            roles[currentRoleIndex].classList.remove('active');
            currentRoleIndex = (currentRoleIndex + 1) % roles.length;
            roles[currentRoleIndex].classList.add('active');
        }, 3000);
    }

    // --- 9f: Floating elements stagger ---
    document.querySelectorAll('.float-element').forEach((el, i) => {
        el.style.animationDelay = `${i * 0.2}s`;
    });

    // --- 9g: Typing effect for greeting ---
    const greetingText = document.querySelector('.greeting-text');
    if (greetingText) {
        const text = greetingText.textContent;
        greetingText.textContent = '';
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                greetingText.textContent += text.charAt(i++);
                setTimeout(typeWriter, 100);
            }
        }
        setTimeout(typeWriter, 500);
    }

    // --- 9h: Tech items ripple effect ---
    document.querySelectorAll('.tech-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute; width: 100%; height: 100%;
                background: radial-gradient(circle, rgba(110,52,130,0.15) 0%, transparent 70%);
                top: 0; left: 0; border-radius: 12px;
                animation: ripplePulse 0.6s ease-out; pointer-events: none;
            `;
            this.style.position = 'relative';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // --- 9i: Mouse parallax on project cards ---
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const moveX = ((e.clientX - rect.left) - rect.width / 2) / 20;
            const moveY = ((e.clientY - rect.top) - rect.height / 2) / 20;
            card.style.transform = `translateY(-8px) scale(1.02) rotateX(${-moveY}deg) rotateY(${moveX}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1) rotateX(0) rotateY(0)';
        });
    });

    // --- 9j: Contact form with validation ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const nameField    = document.getElementById('name');
        const emailField   = document.getElementById('email');
        const subjectField = document.getElementById('subject');
        const messageField = document.getElementById('message');
        const submitBtn    = document.getElementById('submitBtn');
        const formStatus   = document.getElementById('formStatus');

        function validateField(field, type) {
            const value = field.value.trim();
            const errorEl = document.getElementById(`${field.id}-error`);
            let isValid = true, errorMessage = '';

            if (type === 'name' && value.length < 2) {
                isValid = false; errorMessage = 'Name must be at least 2 characters.';
            } else if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                isValid = false; errorMessage = 'Please enter a valid email address.';
            } else if (type === 'message' && value.length < 10) {
                isValid = false; errorMessage = 'Message must be at least 10 characters.';
            }

            field.classList.toggle('error', !isValid);
            field.classList.toggle('valid', isValid);
            if (errorEl) {
                errorEl.textContent = errorMessage;
                errorEl.classList.toggle('show', !isValid);
            }
            return isValid;
        }

        function clearFieldError(field) {
            field.classList.remove('error', 'valid');
            const errorEl = document.getElementById(`${field.id}-error`);
            if (errorEl) { errorEl.textContent = ''; errorEl.classList.remove('show'); }
        }

        function showFormStatus(message, type) {
            formStatus.textContent = message;
            formStatus.className = `form-status ${type} show`;
            if (type === 'success') setTimeout(() => formStatus.classList.remove('show'), 5000);
        }

        [nameField, emailField, subjectField, messageField].forEach(field => {
            if (!field) return;
            field.addEventListener('blur', () => {
                if (field.id !== 'subject') validateField(field, field.id);
            });
            field.addEventListener('focus', () => clearFieldError(field));
        });

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const valid = validateField(nameField, 'name') &
                          validateField(emailField, 'email') &
                          validateField(messageField, 'message');
            if (!valid) { showFormStatus('Please correct the errors above.', 'error'); return; }

            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            formStatus.classList.remove('show');

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) {
                    showFormStatus("✅ Message sent! I'll get back to you soon.", 'success');
                    contactForm.reset();
                    [nameField, emailField, subjectField, messageField].forEach(f => f?.classList.remove('valid', 'error'));
                } else throw new Error();
            } catch {
                showFormStatus('❌ Failed to send. Please email me directly.', 'error');
            } finally {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });
    }

    // --- 9k: Scroll Spy — active nav link ---
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');

    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active-nav'));
                const activeLink = document.querySelector(`.nav-menu a[href="#${entry.target.id}"]`);
                if (activeLink) activeLink.classList.add('active-nav');
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(section => scrollSpyObserver.observe(section));

    // --- 9l: Page loaded ---
    document.body.classList.add('loaded');

    // --- 9m: Konami Code Easter Egg ---
    let konamiCode = [];
    const konamiSequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode.splice(-konamiSequence.length - 1, konamiCode.length - konamiSequence.length);
        if (konamiCode.join('').includes(konamiSequence.join(''))) {
            document.body.style.animation = 'rainbow 2s infinite';
            for (let i = 0; i < 50; i++) {
                setTimeout(() => {
                    const confetti = document.createElement('div');
                    confetti.textContent = ['🎉','✨','🎊','⭐'][Math.floor(Math.random() * 4)];
                    confetti.style.cssText = `position:fixed;top:-50px;left:${Math.random()*100}%;font-size:30px;animation:confettiFall 3s ease-out forwards;z-index:10000;pointer-events:none;`;
                    document.body.appendChild(confetti);
                    setTimeout(() => confetti.remove(), 3000);
                }, i * 50);
            }
            setTimeout(() => { document.body.style.animation = ''; }, 5000);
        }
    });

    // --- 9n: Console signature ---
    console.log('%c👋 Hey Developer!', 'font-size: 24px; font-weight: bold; color: #6E3482;');
    console.log('%c✨ Built with vanilla JavaScript!', 'font-size: 14px; color: #A56ABD');
    console.log("%c💼 Interested in hiring? Let's talk!", 'font-size: 14px; color: #49225B; font-weight: bold;');
});

// ===== 10: Page Load Animation =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.6s ease';
        document.body.style.opacity = '1';
    }, 100);
    console.log(`%c🚀 Page ready in ${Math.round(performance.now())}ms`, 'font-size: 14px; color: #A56ABD; font-weight: bold;');
});
