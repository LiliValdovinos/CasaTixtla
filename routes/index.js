const express = require('express');
const router = express.Router();

// Datos estáticos para el menú example
const menuData = {
    pozoles: [
        { name: 'Pozole Verde', price: 125, description: 'Con salsa verde de tomate y cilantro fresco' },
        { name: 'Pozole Blanco', price: 115, description: 'Clásico pozole sin chile, perfecto para toda la familia' }
    ],
    antojitos: [
        { name: 'Tostadas de Tinga', price: 45, description: 'Crujientes tostadas con tinga de pollo desmenuzado' },
        { name: 'Quesadillas', price: 35, description: 'Quesadillas de queso oaxaca con tortilla artesanal' },
        { name: 'Flautas', price: 50, description: 'Flautas doradas rellenas de pollo, servidas con crema' }
    ],
    bebidas: [
        { name: 'Agua de Horchata', price: 25, description: 'Refrescante bebida de arroz con canela' },
        { name: 'Agua de Jamaica', price: 20, description: 'Agua fresca de flor de jamaica natural' },
        { name: 'Refrescos', price: 18, description: 'Coca-Cola, Sprite, Fanta y más opciones' }
    ]
};

const restaurantInfo = {
    name: 'Pozolería Casa Tixtla',
    established: 1976,
    experience: new Date().getFullYear() - 1976,
    customers: '10k+',
    natural: '100%',
    phone: '55 5440 8042',
    whatsapp: '+525547573789',
    address: 'C. Juan E. Hernández y Davalos 36, Algarín, Cuauhtémoc, 06880 Ciudad de México, CDMX',
    hours: 'Lun - Dom: 10:00 AM - 20:00 PM'
};

// Ruta principal
router.get('/', (req, res) => {
    res.render('index', {
        title: 'Inicio - Pozolería Casa Tixtla',
        menuData,
        restaurantInfo,
        isHome: true
    });
});   

// Ruta del menú
router.get('/menu', (req, res) => {
    res.render('menu', {
        title: 'Menú - Pozolería Casa Tixtla',
        menuData,
        isMenu: true
    });
});

// Ruta nosotros
router.get('/nosotros', (req, res) => {
    res.render('about', {
        title: 'Nosotros - Pozolería Casa Tixtla',
        restaurantInfo,
        isAbout: true
    });
});

// Ruta contacto
router.get('/contacto', (req, res) => {
    res.render('contact', {
        title: 'Contacto - Pozolería Casa Tixtla',
        restaurantInfo,
        isContact: true
    });
});

// API para búsqueda (AJAX)
router.get('/api/search', (req, res) => {
    const query = req.query.q?.toLowerCase() || '';
    
    if (!query) {
        return res.json({ results: [] });
    }
    
    const results = [];
    
    // Buscar en pozoles
    menuData.pozoles.forEach(item => {
        if (item.name.toLowerCase().includes(query) || 
            item.description.toLowerCase().includes(query)) {
            results.push({ ...item, category: 'Pozoles' });
        }
    });
    
    // Buscar en antojitos
    menuData.antojitos.forEach(item => {
        if (item.name.toLowerCase().includes(query) || 
            item.description.toLowerCase().includes(query)) {
            results.push({ ...item, category: 'Antojitos' });
        }
    });
    
    // Buscar en bebidas
    menuData.bebidas.forEach(item => {
        if (item.name.toLowerCase().includes(query) || 
            item.description.toLowerCase().includes(query)) {
            results.push({ ...item, category: 'Bebidas' });
        }
    });
    
    res.json({ results: results.slice(0, 10) }); // Máximo 10 resultados
});

module.exports = router;