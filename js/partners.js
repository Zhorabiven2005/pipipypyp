// Partners page JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    initializePartnersPage();
    initializeAnimations();
    initializeInteractivity();
});

function initializePartnersPage() {
    // Add fade-in animation to main content
    const heroContent = document.querySelector('.partners-hero-content');
    if (heroContent) {
        heroContent.classList.add('fade-in');
    }
    
    // Initialize intersection observer for animations
    initializeScrollAnimations();
    
    // Initialize floating elements
    initializeFloatingElements();
}

function initializeAnimations() {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.partner-card, .benefit-card, .section-header, .benefits-header');
    animateElements.forEach(el => observer.observe(el));
}

function initializeScrollAnimations() {
    // Add scroll-based animations
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.partners-bg');
        
        if (parallax) {
            const speed = scrolled * 0.3;
            parallax.style.transform = `translateY(${speed}px)`;
        }
        
        // Animate floating elements based on scroll
        const elements = document.querySelectorAll('.element');
        elements.forEach((element, index) => {
            const speed = scrolled * (0.1 + index * 0.05);
            element.style.transform = `translateY(${speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    }, 16));
}

function initializeFloatingElements() {
    const elements = document.querySelectorAll('.element');
    
    elements.forEach((element, index) => {
        // Add random movement
        setInterval(() => {
            const randomX = (Math.random() - 0.5) * 20;
            const randomY = (Math.random() - 0.5) * 20;
            element.style.transform += ` translate(${randomX}px, ${randomY}px)`;
        }, 3000 + index * 500);
    });
}

function initializeInteractivity() {
    // Partner card interactions
    const partnerCards = document.querySelectorAll('.partner-card');
    partnerCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click animation
        card.addEventListener('click', function() {
            this.style.transform = 'translateY(-15px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-15px) scale(1.02)';
            }, 150);
        });
    });
    
    // Benefit card interactions
    const benefitCards = document.querySelectorAll('.benefit-card');
    benefitCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Button interactions
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Handle button actions
            handleButtonAction(this.textContent.trim());
        });
    });
    
    // CTA section interactions
    const ctaStats = document.querySelectorAll('.stat-item');
    ctaStats.forEach(stat => {
        const number = stat.querySelector('.stat-number');
        if (number) {
            animateCounter(number);
        }
    });
}

function handleButtonAction(buttonText) {
    switch (buttonText) {
        case 'Стать партнером':
        case 'Подать заявку':
            showPartnerApplicationModal();
            break;
        case 'Узнать больше':
        case 'Связаться с нами':
            showContactModal();
            break;
        default:
            console.log('Button clicked:', buttonText);
    }
}

function showPartnerApplicationModal() {
    const modal = document.createElement('div');
    modal.className = 'partner-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Стать партнером Capico</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form class="partner-form">
                    <div class="form-group">
                        <label for="partnerName">Имя и фамилия</label>
                        <input type="text" id="partnerName" required>
                    </div>
                    <div class="form-group">
                        <label for="partnerEmail">Email</label>
                        <input type="email" id="partnerEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="partnerPhone">Телефон</label>
                        <input type="tel" id="partnerPhone" required>
                    </div>
                    <div class="form-group">
                        <label for="partnerCompany">Компания/Сайт</label>
                        <input type="text" id="partnerCompany">
                    </div>
                    <div class="form-group">
                        <label for="partnerExperience">Опыт в партнерских программах</label>
                        <select id="partnerExperience" required>
                            <option value="">Выберите опыт</option>
                            <option value="beginner">Новичок</option>
                            <option value="intermediate">Средний</option>
                            <option value="advanced">Продвинутый</option>
                            <option value="expert">Эксперт</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="partnerMessage">Дополнительная информация</label>
                        <textarea id="partnerMessage" rows="4"></textarea>
                    </div>
                    <button type="submit" class="btn-primary">Отправить заявку</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .partner-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .modal-content {
            background: #1a1a1a;
            border-radius: 20px;
            padding: 0;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            animation: scaleIn 0.3s ease;
        }
        
        .modal-header {
            background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%);
            padding: 20px;
            border-radius: 20px 20px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .modal-header h3 {
            color: #fff;
            margin: 0;
            font-size: 24px;
            font-weight: 700;
        }
        
        .modal-close {
            background: none;
            border: none;
            color: #fff;
            font-size: 30px;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.3s ease;
        }
        
        .modal-close:hover {
            opacity: 1;
        }
        
        .modal-body {
            padding: 30px;
        }
        
        .partner-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .form-group {
            display: flex;
            flex-direction: column;
        }
        
        .form-group label {
            color: #fff;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
            padding: 12px;
            border: 1px solid #333;
            border-radius: 8px;
            background: #2a2a2a;
            color: #fff;
            font-size: 16px;
            transition: border-color 0.3s ease;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #8b5cf6;
            box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes scaleIn {
            from { 
                opacity: 0;
                transform: scale(0.8);
            }
            to { 
                opacity: 1;
                transform: scale(1);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        modal.remove();
        style.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            style.remove();
        }
    });
    
    // Form submission
    const form = modal.querySelector('.partner-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправляем...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showSuccessMessage('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
            modal.remove();
            style.remove();
        }, 2000);
    });
}

function showContactModal() {
    const modal = document.createElement('div');
    modal.className = 'contact-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Связаться с нами</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="contact-info">
                    <div class="contact-item">
                        <div class="contact-icon">📧</div>
                        <div>
                            <h4>Email</h4>
                            <p>partners@capico.com</p>
                        </div>
                    </div>
                    <div class="contact-item">
                        <div class="contact-icon">📞</div>
                        <div>
                            <h4>Телефон</h4>
                            <p>+7 (999) 123-45-67</p>
                        </div>
                    </div>
                    <div class="contact-item">
                        <div class="contact-icon">💬</div>
                        <div>
                            <h4>Telegram</h4>
                            <p>@capico_partners</p>
                        </div>
                    </div>
                </div>
                <button class="btn-primary" onclick="window.open('mailto:partners@capico.com')">
                    Написать нам
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles (reuse existing styles)
    const existingStyle = document.querySelector('style');
    if (existingStyle) {
        const additionalStyles = `
            .contact-info {
                display: flex;
                flex-direction: column;
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .contact-item {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 15px;
                background: rgba(139, 92, 246, 0.1);
                border-radius: 10px;
            }
            
            .contact-icon {
                font-size: 24px;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(139, 92, 246, 0.2);
                border-radius: 50%;
            }
            
            .contact-item h4 {
                color: #fff;
                margin: 0 0 5px 0;
                font-size: 16px;
                font-weight: 600;
            }
            
            .contact-item p {
                color: #8b5cf6;
                margin: 0;
                font-size: 14px;
            }
        `;
        existingStyle.textContent += additionalStyles;
    }
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function animateCounter(element) {
    const text = element.textContent;
    const number = parseFloat(text.replace(/[^\d.]/g, ''));
    const suffix = text.replace(/[\d.]/g, '');
    
    if (isNaN(number)) return;
    
    let current = 0;
    const increment = number / 60; // 60 frames for smooth animation
    const duration = 2000; // 2 seconds
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(current) + suffix;
    }, duration / 60);
}

function showSuccessMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        font-weight: 600;
        z-index: 10001;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
    `;
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 300);
    }, 5000);
}

// Utility functions
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
    };
}

// Initialize partner statistics animation when page loads
window.addEventListener('load', function() {
    const statNumbers = document.querySelectorAll('.cta-stats .stat-number');
    statNumbers.forEach((stat, index) => {
        setTimeout(() => {
            animateCounter(stat);
        }, index * 200);
    });
});
