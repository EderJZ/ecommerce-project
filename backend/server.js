const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const usuariosRoutes = require('./routes/usuarios');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// garante que a pasta backend/sqlite existe
const sqliteDir = path.resolve(__dirname, 'sqlite');
if (!fs.existsSync(sqliteDir)) {
  fs.mkdirSync(sqliteDir);
}

// caminho do banco dentro da pasta backend/sqlite
const dbPath = path.resolve(sqliteDir, 'MeuBanco.db');

// Conexão com o banco
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao SQLite:', err.message);
  } else {
    console.log('Conectado ao banco SQLite em:', dbPath);
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
