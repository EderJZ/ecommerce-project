const express = require('express');
const router = express.Router();

// Login
router.post('/login', (req, res) => {
  const db = req.db;
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Informe email e senha' });
  }
  db.get(
  'SELECT * FROM usuario WHERE email = ? AND senha_hash = ?',
  [email, senha],
  (err, row) => {
    if (err) {
      console.error("Erro no SQLite:", err); // 🔍 log do erro
      return res.status(500).json({ erro: 'Erro no banco de dados' });
    }
    if (!row) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }
    res.json({ mensagem: 'Login realizado com sucesso!', usuario: row });
  }
);
});

module.exports = router;
