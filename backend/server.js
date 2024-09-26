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

// Rodar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
