const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const usuariosRoutes = require('./routes/usuarios');
const authRoutes = require('./routes/auth');


const app = express();
app.use(bodyParser.json());


const cors = require('cors');
app.use(cors());

// Conexão com o banco
const db = new sqlite3.Database('C:/SQLITE/MeuBanco.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao SQLite:', err.message);
  } else {
    console.log('Conectado ao banco SQLite!');
  }
});

// Disponibiliza o `db` para as rotas
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Rotas
app.use('/usuario', usuariosRoutes);
app.use('/auth', authRoutes);

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001 🚀');
});
