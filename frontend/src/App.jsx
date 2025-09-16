// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register"; // ajuste se o arquivo estiver dentro da pasta Register

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />        {/* página inicial */}
          <Route path="/login" element={<Login />} />  {/* rota login */}
          <Route path="/register" element={<Register />} /> {/* rota cadastro */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
