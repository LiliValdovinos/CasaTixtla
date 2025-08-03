const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

// Importar rutas
const indexRoutes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

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

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor de Casa Tixtla corriendo en http://localhost:${PORT}`);
    console.log(`Archivos estáticos servidos desde: ${path.join(__dirname, 'public')}`);
});

module.exports = app;