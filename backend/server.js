const express = require('express');
const connectDB = require('./config/database');
const cors = require('cors');
require('./cron/emailReminderCron');  // Inicializa o cron job de lembretes de e-mail
require('dotenv').config();
const path = require('path');

// Conectar ao MongoDB
connectDB();

const app = express();

// CORS deve ser aplicado aqui, antes das rotas
app.use(cors({
    origin: 'http://localhost:8080', // Permitir o front-end local
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
  
// Middleware para parsear JSON
app.use(express.json());

// Servir arquivos estáticos para o frontend
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Definir rotas da API
app.use('/api', require('./routes/index'));

// Para todas as rotas que não são da API, servir o index.html do Vue.js
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public', 'index.html'));
});

/* Servir as páginas HTML para o frontend
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/auth/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/auth/register.html'));
});

app.get('/confirm-account/:token', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/auth/account-confirmation.html'));
});


app.get('/forgot-password', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/auth/forgot-password.html'));
});

app.get('/reset-password/:token', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/auth/reset-password.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/home/home.html'));
});

// Rotas administração
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/pages/admin/admin.html'));
});*/

// Rodar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
