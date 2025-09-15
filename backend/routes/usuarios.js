const express = require('express');
const router = express.Router();

// Listar todos usuários
router.get('/', (req, res) => {
  const db = req.db;
  db.all('SELECT * FROM usuario', [], (err, rows) => {
    if (err) {
      res.status(500).json({ erro: 'Erro ao buscar usuários' });
    } else {
      res.json(rows);
    }
  });
});

module.exports = router;
