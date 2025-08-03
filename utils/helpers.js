const moment = require('moment');

module.exports = {
    // Format currency to Mexican pesos
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 0
        }).format(amount);
    },

    // Format date
    formatDate: (date, format = 'DD/MM/YYYY') => {
        return moment(date).format(format);
    },

    // Get current year
    currentYear: () => {
        return new Date().getFullYear();
    },

    // Truncate text
    truncate: (text, length = 100) => {
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    },

    // Check if current page
    isCurrentPage: (currentPath, targetPath) => {
        return currentPath === targetPath;
    },

    // Generate WhatsApp link
    generateWhatsAppLink: (phone, message = '') => {
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${phone}?text=${encodedMessage}`;
    },

    // Validate Mexican phone number
    isValidMexicanPhone: (phone) => {
        const mexicanPhoneRegex = /^(\+52|52)?[\s\-]?\(?([0-9]{2,3})\)?[\s\-]?([0-9]{3,4})[\s\-]?([0-9]{4})$/;
        return mexicanPhoneRegex.test(phone);
    }
};
