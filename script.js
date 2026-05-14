document.addEventListener('DOMContentLoaded', function() {
    
    // ========== YOUR FORMSPREE ENDPOINT ==========
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xkoykodk';
    // =============================================
    
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (navLinks) navLinks.classList.remove('active');
            }
        });
    });
    
    // ========== CONTACT FORM WITH EMAIL (FORMSPREE) ==========
    
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const submitBtn = document.getElementById('submitBtn');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            const phone = document.getElementById('phone')?.value.trim();
            const service = document.getElementById('service')?.value;
            const message = document.getElementById('message')?.value.trim();
            
            // Validation
            if (!name) {
                showMessage('Please enter your name', 'error');
                return;
            }
            if (!email) {
                showMessage('Please enter your email', 'error');
                return;
            }
            if (!isValidEmail(email)) {
                showMessage('Please enter a valid email address', 'error');
                return;
            }
            if (!message) {
                showMessage('Please enter your message', 'error');
                return;
            }
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            try {
                // Send to Formspree
                const response = await fetch(FORMSPREE_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        phone: phone || 'Not provided',
                        service: service || 'Not selected',
                        message: message
                    })
                });
                
                if (response.ok) {
                    showMessage(`Thanks ${name}! We'll get back to you within 24 hours.`, 'success');
                    contactForm.reset();
                } else {
                    const data = await response.json();
                    showMessage(data.error || 'Something went wrong. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showMessage('Network error. Please check your connection and try again.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            }
        });
    }
    
    function showMessage(msg, type) {
        if (!formMessage) return;
        formMessage.textContent = msg;
        formMessage.className = `form-message ${type}`;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (formMessage) {
                formMessage.textContent = '';
                formMessage.className = 'form-message';
            }
        }, 5000);
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // ========== SERVICE MODAL ==========
    
    const existingModal = document.querySelector('.modal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3></h3>
            <p></p>
        </div>
    `;
    document.body.appendChild(modal);
    
    const serviceDetails = {
        'IT Support': '24/7 enterprise-grade IT support with average 15-minute response time. Includes network monitoring, cybersecurity, and cloud backup. Starting at $49/month.',
        'Web Development': 'Custom websites and web apps built with modern technology. Fully responsive, SEO optimized, and blazing fast loading speeds. Starting at $999.',
        'Tech Repair': 'Professional hardware repair with 90-day warranty. Same-day service for most issues. Data recovery and performance upgrades available. Diagnostic is free!',
        'IT Consulting': 'Strategic tech consulting to help your business scale. Cloud migration, digital transformation, and IT infrastructure planning. Free initial consultation.'
    };
    
    document.querySelectorAll('.service-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.service-card');
            const serviceName = card?.getAttribute('data-service');
            const modalH3 = modal.querySelector('h3');
            const modalP = modal.querySelector('p');
            if (modalH3) modalH3.textContent = serviceName;
            if (modalP) modalP.textContent = serviceDetails[serviceName] || 'Contact us for more information about this service.';
            modal.style.display = 'flex';
        });
    });
    
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
    
    // ========== COUNTER ANIMATION ==========
    
    function animateCounter(element, target) {
        let current = 0;
        const increment = Math.ceil(target / 50);
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = current;
            }
        }, 20);
    }
    
    const clientCounter = document.getElementById('clientCount');
    const projectCounter = document.getElementById('projectCount');
    const yearCounter = document.getElementById('yearCount');
    
    if (clientCounter && projectCounter && yearCounter) {
        // Check if counters are visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(clientCounter, 587);
                    animateCounter(projectCounter, 1243);
                    animateCounter(yearCounter, 5);
                    observer.disconnect();
                }
            });
        });
        observer.observe(clientCounter);
    }
    
    // ========== AUTO-UPDATE FOOTER YEAR ==========
    
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // ========== NAVBAR SCROLL EFFECT ==========
    
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.style.background = 'white';
                navbar.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
            } else {
                navbar.style.background = 'white';
                navbar.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)';
            }
        }
    });
    
    console.log('✅ The Tech Clinic website loaded! Contact form is connected to Formspree.');
});