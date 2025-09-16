import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import "./Login.css";
import { Link } from "react-router-dom";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // Para feedback ao usuário

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          senha: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.erro || "Erro no login");
      } else {
        setMessage("✅ Login realizado com sucesso!");
        console.log("Usuário logado:", data.usuario);

        // Exemplo: salvar usuário no localStorage
        localStorage.setItem("usuario", JSON.stringify(data.usuario));

        // Aqui você pode redirecionar para outra página:
        // window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Erro ao conectar com backend:", error);
      setMessage("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h1>Acesse o sistema</h1>
        <div className="input-field">
          <input
            type="text"
            placeholder="E-mail"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <FaUser className="icon" />
        </div>
        <div className="input-field">
          <input
            type="password"
            placeholder="Senha"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FaLock className="icon" />
        </div>

        <div className="recall-forget">
          <label>
            <input type="checkbox" />
            Lembre de mim
          </label>
          <a href="#">Esqueceu sua senha?</a>
        </div>
        <button type="submit">Login</button>

        {message && <p style={{ marginTop: "10px" }}>{message}</p>}

        <div className="signup-link">
          <p>
            Não tem uma conta? <Link to="/register">Registrar</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
