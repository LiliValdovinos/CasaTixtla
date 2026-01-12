const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

// Importar rutas
const indexRoutes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Configurar Handlebars como motor de plantillas
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear datos del formulario
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas
app.use('/', indexRoutes);

// Middleware para manejo de errores 404
app.use((req, res) => {
    res.status(404).render('404', {
        title: 'Página no encontrada - Casa Tixtla'
    });
});

// Middleware para manejo de errores generales
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).render('404', {
        title: 'Error del servidor - Casa Tixtla'
    });
});

// Iniciar servidor
const server = app.listen(PORT, () => {
    console.log(`==========================================`);
    console.log(`Casa Tixtla - Servidor Iniciado`);
    console.log(`==========================================`);
    console.log(`Entorno: ${NODE_ENV}`);
    console.log(`Puerto: ${PORT}`);
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`Archivos estáticos: ${path.join(__dirname, 'public')}`);
    console.log(`==========================================`);
});

// Manejo graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM recibido. Cerrando servidor...');
    server.close(() => {
        console.log('Servidor cerrado correctamente');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\nSIGINT recibido. Cerrando servidor...');
    server.close(() => {
        console.log('Servidor cerrado correctamente');
        process.exit(0);
    });
});

module.exports = app;