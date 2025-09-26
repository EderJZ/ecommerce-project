// backend/tables.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'sqlite/MeuBanco.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Erro ao conectar SQLite:', err);
  else console.log('Banco SQLite conectado!');
});

// Array com todas as tabelas
const tabelas = [
  `CREATE TABLE IF NOT EXISTS TipoUsuario (
    id_tipo_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT CHECK(tipo IN ('cliente','administrador','usuario'))
  )`,

  `CREATE TABLE IF NOT EXISTS Usuario (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    id_tipo_usuario INTEGER,
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(id_tipo_usuario) REFERENCES TipoUsuario(id_tipo_usuario)
  )`,

  `CREATE TABLE IF NOT EXISTS GestaoUsuario (
    id_gestao INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER,
    permissao VARCHAR(100),
    FOREIGN KEY(id_usuario) REFERENCES Usuario(id_usuario)
  )`,

  `CREATE TABLE IF NOT EXISTS Categoria (
    id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT
  )`,

  `CREATE TABLE IF NOT EXISTS Produto (
    id_produto INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(150) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2),
    estoque INTEGER,
    id_categoria INTEGER,
    imagem_url VARCHAR(255),
    FOREIGN KEY(id_categoria) REFERENCES Categoria(id_categoria)
  )`,

  `CREATE TABLE IF NOT EXISTS Pedido (
    id_pedido INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER,
    data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT CHECK(status IN ('pendente','enviado','entregue','cancelado')),
    FOREIGN KEY(id_usuario) REFERENCES Usuario(id_usuario)
  )`,

  `CREATE TABLE IF NOT EXISTS ItemPedido (
    id_item INTEGER PRIMARY KEY AUTOINCREMENT,
    id_pedido INTEGER,
    id_produto INTEGER,
    quantidade INTEGER,
    preco_unitario DECIMAL(10,2),
    FOREIGN KEY(id_pedido) REFERENCES Pedido(id_pedido),
    FOREIGN KEY(id_produto) REFERENCES Produto(id_produto)
  )`,

  `CREATE TABLE IF NOT EXISTS Endereco (
    id_endereco INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER,
    logradouro VARCHAR(255),
    numero VARCHAR(10),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado CHAR(2),
    cep CHAR(8),
    FOREIGN KEY(id_usuario) REFERENCES Usuario(id_usuario)
  )`
];

// Garante execução em ordem
db.serialize(() => {
  tabelas.forEach(sql => {
    db.run(sql, (err) => {
      if (err) console.error('Erro ao criar tabela:', err.message);
    });
  });

  console.log('Todas as tabelas foram criadas (se não existiam).');

  // Inserir tipos de usuário padrão
  db.run(
    `INSERT OR IGNORE INTO TipoUsuario (id_tipo_usuario, tipo) VALUES 
      (1, 'cliente'),
      (2, 'administrador'),
      (3, 'usuario')`
  );

  // Inserir usuário admin
  const senhaPlano = "admin123";
  const senhaHash = bcrypt.hashSync(senhaPlano, 10);

  db.get("SELECT * FROM Usuario WHERE email = ?", ["admin@teste.com"], (err, row) => {
    if (!row) {
      db.run(
        `INSERT INTO Usuario (nome, email, senha_hash, id_tipo_usuario) VALUES (?, ?, ?, ?)`,
        ["Administrador", "admin@teste.com", senhaHash, 2],
        (err) => {
          if (err) console.error("Erro ao inserir usuário admin:", err.message);
          else console.log("Usuário admin criado! Email: admin@teste.com | Senha: admin123");
        }
      );
    }
  });
});

module.exports = db;
