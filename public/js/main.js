// Main JavaScript file for Pozolería website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeSearch();
    initializeNavbar();
    initializeSmoothScroll();
    initializeAnimations();
    setCurrentYear();
});

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    let searchTimeout;

    if (searchInput && searchResults) {
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            
            // Clear previous timeout
            clearTimeout(searchTimeout);
            
            if (query.length < 2) {
                hideSearchResults();
                return;
            }
            
            // Debounce search requests
            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, 300);
        });

        // Hide results when clicking outside
        document.addEventListener('click', function(event) {
            if (!searchInput.contains(event.target) && !searchResults.contains(event.target)) {
                hideSearchResults();
            }
        });

        // Handle escape key
        searchInput.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                hideSearchResults();
                this.blur();
            }
        });
    }
}

async function performSearch(query) {
    const searchResults = document.getElementById('searchResults');
    
    try {
        // Show loading state
        searchResults.innerHTML = '<div class="p-3 text-center"><div class="spinner mx-auto"></div></div>';
        searchResults.classList.remove('d-none');
        
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        displaySearchResults(data.results);
    } catch (error) {
        console.error('Error performing search:', error);
        searchResults.innerHTML = '<div class="p-3 text-center text-muted">Error en la búsqueda</div>';
    }
}

function displaySearchResults(results) {
    const searchResults = document.getElementById('searchResults');
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="p-3 text-center text-muted">No se encontraron resultados</div>';
        return;
    }
    
    const resultsHTML = results.map(item => `
        <div class="search-item">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <div class="fw-bold">${item.name}</div>
                    <div class="search-category">${item.category}</div>
                    <div class="small text-muted">${item.description}</div>
                </div>
                <div class="search-price">$${item.price}</div>
            </div>
        </div>
    `).join('');
    
    searchResults.innerHTML = resultsHTML;
}

function hideSearchResults() {
    const searchResults = document.getElementById('searchResults');
    if (searchResults) {
        searchResults.classList.add('d-none');
    }
}

// Navbar scroll effect
function initializeNavbar() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
}

// Smooth scrolling for anchor links
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Intersection Observer for animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate
    document.querySelectorAll('.menu-card, .display-4, .lead').forEach(el => {
        observer.observe(el);
    });
}

// Set current year in footer
function setCurrentYear() {
    const yearElements = document.querySelectorAll('[data-year]');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(element => {
        element.textContent = currentYear;
    });
}

// Form validation
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
        }
    });
    
    return isValid;
}

// WhatsApp integration
function sendWhatsAppMessage(message) {
    const phone = '+523312345678'; // Restaurant phone number
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

// Phone call function
function makePhoneCall(phoneNumber) {
    window.location.href = `tel:${phoneNumber}`;
}

// Utility functions
const Utils = {
    // Format currency
    formatCurrency: function(amount) {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 0
        }).format(amount);
    },
    
    // Show notification
    showNotification: function(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    },
    
    // Debounce function
    debounce: function(func, wait) {
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
};

// Export functions for use in other scripts
window.PozoleriaApp = {
    sendWhatsAppMessage,
    makePhoneCall,
    validateForm,
    Utils
};

// Add some CSS classes for animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    .navbar-scrolled {
        background-color: rgba(33, 37, 41, 0.95) !important;
        backdrop-filter: blur(10px);
    }
    
    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;
document.head.appendChild(style);