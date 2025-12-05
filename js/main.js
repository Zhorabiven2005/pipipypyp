// Main JavaScript file for public part of Capico trading platform

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeHeroAnimations();
    initializeFeatureCarousel();
    initializeScrollEffects();
    initializeFormValidation();
    initializeExchangeButtons();
});

// Navigation functionality
function initializeNavigation() {
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Only prevent default for anchor links (starting with #)
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
            // For external links (like partners.html), allow normal navigation
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Hero section animations
function initializeHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroCTA = document.querySelector('.hero-cta');
    const abstractLines = document.querySelector('.abstract-lines');
    const cryptoLogos = document.querySelectorAll('.crypto-logo');
    
    // Animate elements on page load
    setTimeout(() => {
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'translateY(0)';
    }, 300);
    
    setTimeout(() => {
        heroCTA.style.opacity = '1';
        heroCTA.style.transform = 'translateY(0)';
    }, 600);
    
    // Continuous animations for background elements
    setInterval(() => {
        abstractLines.style.transform = `translate(${Math.sin(Date.now() * 0.001) * 10}px, ${Math.cos(Date.now() * 0.001) * 5}px)`;
    }, 50);
    
    cryptoLogos.forEach((logo, index) => {
        setTimeout(() => {
            logo.style.opacity = '1';
            logo.style.transform = 'scale(1)';
        }, 800 + (index * 200));
    });
}

// Feature carousel functionality
function initializeFeatureCarousel() {
    const featureItems = document.querySelectorAll('.feature-item');
    const featureCards = document.querySelectorAll('.feature-card');
    const upButton = document.querySelector('.control-btn.up');
    const downButton = document.querySelector('.control-btn.down');
    
    let currentFeatureIndex = 0;
    
    // Feature item click handlers
    featureItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            setActiveFeature(index);
        });
    });
    
    // Control buttons
    upButton.addEventListener('click', () => {
        currentFeatureIndex = Math.max(0, currentFeatureIndex - 1);
        setActiveFeature(currentFeatureIndex);
    });
    
    downButton.addEventListener('click', () => {
        currentFeatureIndex = Math.min(featureItems.length - 1, currentFeatureIndex + 1);
        setActiveFeature(currentFeatureIndex);
    });
    
    function setActiveFeature(index) {
        // Remove active class from all items
        featureItems.forEach(item => item.classList.remove('active'));
        featureCards.forEach(card => {
            card.classList.remove('active', 'prev', 'next');
            card.style.display = 'none';
        });
        
        // Add active class to selected item
        featureItems[index].classList.add('active');
        
        // Show only the active card and its neighbors
        if (featureCards[index]) {
            featureCards[index].classList.add('active');
            featureCards[index].style.display = 'block';
        }
        
        // Show previous card if exists
        if (index > 0 && featureCards[index - 1]) {
            featureCards[index - 1].classList.add('prev');
            featureCards[index - 1].style.display = 'block';
        }
        
        // Show next card if exists
        if (index < featureCards.length - 1 && featureCards[index + 1]) {
            featureCards[index + 1].classList.add('next');
            featureCards[index + 1].style.display = 'block';
        }
        
        currentFeatureIndex = index;
    }
    
    // Initialize first feature (index 4 for "Отложенные ордера")
    setActiveFeature(4);
    
    // Auto-advance carousel
    setInterval(() => {
        currentFeatureIndex = (currentFeatureIndex + 1) % featureItems.length;
        setActiveFeature(currentFeatureIndex);
    }, 5000);
}

// Scroll effects and animations
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.stat-card, .feature-card, .focus-section, .device');
    animateElements.forEach(el => observer.observe(el));
}

// Form validation
function initializeFormValidation() {
    // Contact form validation (if exists)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            validateContactForm();
        });
    }
    
    // Newsletter form validation
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            validateNewsletterForm();
        });
    }
}

function validateContactForm() {
    const name = document.getElementById('contactName');
    const email = document.getElementById('contactEmail');
    const message = document.getElementById('contactMessage');
    
    let isValid = true;
    
    // Clear previous errors
    clearFormErrors();
    
    // Validate name
    if (!name.value.trim()) {
        showFieldError(name, 'Имя обязательно для заполнения');
        isValid = false;
    }
    
    // Validate email
    if (!email.value.trim()) {
        showFieldError(email, 'Email обязателен для заполнения');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showFieldError(email, 'Введите корректный email адрес');
        isValid = false;
    }
    
    // Validate message
    if (!message.value.trim()) {
        showFieldError(message, 'Сообщение обязательно для заполнения');
        isValid = false;
    }
    
    if (isValid) {
        showSuccessMessage('Сообщение отправлено успешно!');
        contactForm.reset();
    }
}

function validateNewsletterForm() {
    const email = document.getElementById('newsletterEmail');
    
    if (!email.value.trim()) {
        showFieldError(email, 'Email обязателен для заполнения');
        return;
    }
    
    if (!isValidEmail(email.value)) {
        showFieldError(email, 'Введите корректный email адрес');
        return;
    }
    
    showSuccessMessage('Вы успешно подписались на рассылку!');
    newsletterForm.reset();
}

function clearFormErrors() {
    const errorElements = document.querySelectorAll('.field-error');
    errorElements.forEach(el => el.remove());
    
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => input.classList.remove('is-invalid'));
}

function showFieldError(field, message) {
    field.classList.add('is-invalid');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error text-danger small mt-1';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function showSuccessMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Exchange buttons functionality
function initializeExchangeButtons() {
    const exchangeButtons = document.querySelectorAll('.exchange-btn');
    
    exchangeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            exchangeButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show exchange info
            const exchangeName = this.textContent.trim();
            showExchangeInfo(exchangeName);
        });
    });
}

function showExchangeInfo(exchangeName) {
    const exchangeInfo = {
        'BINANCE': 'Крупнейшая в мире криптовалютная биржа по объему торгов',
        'FTX': 'Современная платформа для торговли криптовалютами и деривативами',
        'Huobi': 'Одна из ведущих глобальных криптовалютных бирж',
        'OKX': 'Многофункциональная торговая платформа для цифровых активов',
        'BYBIT': 'Скоро доступно - деривативная биржа для профессиональных трейдеров'
    };
    
    const info = exchangeInfo[exchangeName] || 'Информация о бирже';
    
    // Create or update info tooltip
    let tooltip = document.querySelector('.exchange-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'exchange-tooltip';
        document.body.appendChild(tooltip);
    }
    
    tooltip.textContent = info;
    tooltip.style.display = 'block';
    
    // Position tooltip
    const activeButton = document.querySelector('.exchange-btn.active');
    const rect = activeButton.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
    tooltip.style.top = rect.bottom + 10 + 'px';
    
    // Hide tooltip after 3 seconds
    setTimeout(() => {
        tooltip.style.display = 'none';
    }, 3000);
}

// Statistics counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    counters.forEach((counter, index) => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const prefix = counter.getAttribute('data-prefix') || '';
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 2500 + (index * 200); // Staggered animation
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        // Add some randomness to make it more realistic
        const randomOffset = (Math.random() - 0.5) * 0.2 * target; // ±10% variation
        const finalTarget = Math.max(0, target + randomOffset);
        
        // Add delay for staggered effect
        setTimeout(() => {
            const timer = setInterval(() => {
                current += increment;
                if (current >= finalTarget) {
                    current = finalTarget;
                    clearInterval(timer);
                }
                
                // Format the number with proper capitalization and spacing
                let formattedValue;
                if (suffix.includes('B')) {
                    formattedValue = prefix + current.toFixed(1) + ' B+';
                } else if (suffix.includes('K')) {
                    formattedValue = current.toFixed(1) + ' K+';
                } else if (suffix.includes('M')) {
                    formattedValue = Math.floor(current) + ' M+';
                } else {
                    formattedValue = Math.floor(current);
                }
                
                counter.textContent = formattedValue;
            }, 16);
        }, index * 300); // 300ms delay between each counter
    });
}

// Initialize counter animation when statistics section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            // Start real-time updates after initial animation
            setTimeout(startRealTimeUpdates, 4000);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.statistics');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Real-time statistics updates
function startRealTimeUpdates() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    setInterval(() => {
        counters.forEach(counter => {
            const currentValue = parseFloat(counter.textContent.replace(/[^\d.]/g, ''));
            const baseTarget = parseFloat(counter.getAttribute('data-target'));
            const prefix = counter.getAttribute('data-prefix') || '';
            const suffix = counter.getAttribute('data-suffix') || '';
            
            // Add small random fluctuations to simulate real trading data
            const fluctuation = (Math.random() - 0.5) * 0.03 * baseTarget; // ±1.5% fluctuation
            const newValue = Math.max(0, currentValue + fluctuation);
            
            // Format the number with proper capitalization and spacing
            let formattedValue;
            if (suffix.includes('B')) {
                formattedValue = prefix + newValue.toFixed(1) + ' B+';
            } else if (suffix.includes('K')) {
                formattedValue = newValue.toFixed(1) + ' K+';
            } else if (suffix.includes('M')) {
                formattedValue = Math.floor(newValue) + ' M+';
            } else {
                formattedValue = Math.floor(newValue);
            }
            
            counter.textContent = formattedValue;
        });
    }, 8000); // Update every 8 seconds
}

// Device interaction animations
function initializeDeviceAnimations() {
    const devices = document.querySelectorAll('.device');
    
    devices.forEach(device => {
        device.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        device.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click animation
        device.addEventListener('click', function() {
            this.style.transform = 'translateY(-15px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-15px) scale(1.02)';
            }, 150);
        });
    });
}

// Initialize device animations
initializeDeviceAnimations();

// Play button functionality
function initializePlayButtons() {
    const playButtons = document.querySelectorAll('.play-btn, .focus-play-btn, .device-play-btn');
    
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            }, 100);
            
            // Show video modal or redirect
            showVideoModal();
        });
    });
}

function showVideoModal() {
    // Create video modal
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="video-modal-content">
            <button class="video-close">&times;</button>
            <div class="video-placeholder">
                <i class="fas fa-play-circle"></i>
                <p>Демонстрационное видео</p>
                <small>Здесь будет показано видео о возможностях платформы</small>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.video-close');
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .video-modal {
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
        
        .video-modal-content {
            background: #1a1a1a;
            border-radius: 15px;
            padding: 30px;
            max-width: 600px;
            width: 90%;
            position: relative;
            animation: scaleIn 0.3s ease;
        }
        
        .video-close {
            position: absolute;
            top: 15px;
            right: 20px;
            background: none;
            border: none;
            color: #fff;
            font-size: 30px;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.3s ease;
        }
        
        .video-close:hover {
            opacity: 1;
        }
        
        .video-placeholder {
            text-align: center;
            color: #fff;
            padding: 40px;
        }
        
        .video-placeholder i {
            font-size: 60px;
            color: #8b5cf6;
            margin-bottom: 20px;
        }
        
        .video-placeholder p {
            font-size: 24px;
            margin-bottom: 10px;
        }
        
        .video-placeholder small {
            color: #888;
        }
    `;
    document.head.appendChild(style);
}

// Initialize play buttons
initializePlayButtons();

// Loading animation
function showLoading() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <p>Загрузка...</p>
        </div>
    `;
    
    document.body.appendChild(loader);
    
    // Add loader styles
    const style = document.createElement('style');
    style.textContent = `
        .page-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }
        
        .loader-content {
            text-align: center;
            color: #fff;
        }
        
        .loader-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid #333;
            border-top: 3px solid #8b5cf6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

function hideLoading() {
    const loader = document.querySelector('.page-loader');
    if (loader) {
        loader.remove();
    }
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

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

// Performance optimization
const optimizedScrollHandler = throttle(function() {
    // Handle scroll events efficiently
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero-bg');
    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }
}, 16);

window.addEventListener('scroll', optimizedScrollHandler);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You could send this to an error tracking service
});

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
