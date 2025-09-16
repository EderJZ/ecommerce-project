const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// Login
router.post('/login', (req, res) => {
  const db = req.db;
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Informe email e senha' });
  }

  db.get(
    'SELECT * FROM usuario WHERE email = ?',
    [email],
    async (err, row) => {
      if (err) {
        console.error("Erro no SQLite:", err);
        return res.status(500).json({ erro: 'Erro no banco de dados' });
      }
      if (!row) {
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }

      // Verificar senha
      const senhaValida = await bcrypt.compare(senha, row.senha_hash);
      if (!senhaValida) {
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }

      res.json({ mensagem: 'Login realizado com sucesso!', usuario: row });
    }
  );
});

// Registro
router.post('/register', async (req, res) => {
  const db = req.db;
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios.' });
  }

  db.get('SELECT * FROM usuario WHERE email = ?', [email], async (err, row) => {
    if (err) return res.status(500).json({ erro: err.message });
    if (row) return res.status(400).json({ erro: 'Email já cadastrado.' });

    // Criar hash da senha
    const hash = await bcrypt.hash(senha, 10);

    db.run(
      'INSERT INTO usuario (nome, email, senha_hash) VALUES (?, ?, ?)',
      [nome, email, hash],
      function(err) {
        if (err) return res.status(500).json({ erro: err.message });
        res.json({ usuario: { id: this.lastID, nome, email } });
      }
    );
  });
});

module.exports = router;
