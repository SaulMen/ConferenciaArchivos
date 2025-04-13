import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './consolePage.css';

export default function ConsolePage() {
  const [inputText, setInputText] = useState("");
  const [terminalOutput, setTerminalOutput] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      
      const response = await axios.post("http://54.158.17.188:8080/analizar", inputText);
      
      setTerminalOutput((prev) => prev + "\n" + response.data.output);
      console.log("Respuesta del servidor:", response.data);

      setInputText("");
    } catch (error) {
      console.error("Error al enviar el comando:", error);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <button className="btn" onClick={() => navigate("/")}>Consola</button>
        <button className="btn" onClick={() => navigate("/reportes")}>Reportes</button>
      </div>
      <div className="content">
        <textarea
          className="input-box"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Escribe aquí..."
        />
        <div className="terminal">
          <pre>{terminalOutput}</pre>
        </div>
      </div>
      <button className="submit-btn" onClick={handleSubmit}>Enviar</button>
    </div>
  );
}
