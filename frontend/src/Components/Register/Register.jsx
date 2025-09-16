// src/pages/Register.jsx
import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import "./Register.css"; // Reaproveitando o CSS do login
import { Link } from "react-router-dom";

const Register = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (senha !== confirmaSenha) {
      setMessage("❌ As senhas não coincidem!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.erro || "Erro no cadastro");
      } else {
        setMessage("✅ Cadastro realizado com sucesso!");
        console.log("Usuário cadastrado:", data.usuario);
        // opcional: redirecionar para login
        // window.location.href = "/login";
      }
    } catch (error) {
      console.error("Erro ao conectar com backend:", error);
      setMessage("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h1>Cadastro</h1>

        <div className="input-field">
          <input
            type="text"
            placeholder="Nome"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <FaUser className="icon" />
        </div>

        <div className="input-field">
          <input
            type="email"
            placeholder="E-mail"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FaUser className="icon" />
        </div>

        <div className="input-field">
          <input
            type="password"
            placeholder="Senha"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <FaLock className="icon" />
        </div>

        <div className="input-field">
          <input
            type="password"
            placeholder="Confirme a senha"
            required
            value={confirmaSenha}
            onChange={(e) => setConfirmaSenha(e.target.value)}
          />
          <FaLock className="icon" />
        </div>

        <button type="submit">Cadastrar</button>

        {message && <p style={{ marginTop: "10px" }}>{message}</p>}

        <div className="signup-link">
          <p>
             Já tem uma conta? <Link to="/login">Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
