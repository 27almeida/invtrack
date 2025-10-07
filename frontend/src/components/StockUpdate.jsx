import { useState } from "react";

export default function StockUpdate({ produtoId, onUpdate }) {
  const [quantidade, setQuantidade] = useState("");

  const handleSubmit = async (tipo) => {
    const valor = parseInt(quantidade);

    if (isNaN(valor) || valor <= 0) {
      alert("Por favor insere uma quantidade válida (mínimo 1).");
      return;
    }

    const token = localStorage.getItem("token");

    const res = await fetch("http://127.0.0.1:8000/api/movimentos/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      },
      body: JSON.stringify({
        produto: produtoId,
        tipo: tipo,
        quantidade: valor,
      }),
    });

    if (res.ok) {
      onUpdate();
      setQuantidade("");
    } else {
      alert("Erro ao atualizar stock.");
    }
  };

  return (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <input
        type="number"
        value={quantidade}
        onChange={(e) => setQuantidade(e.target.value)}
        placeholder="Qtd"
        min="1"
        style={{ width: "60px", padding: "0.3rem" }}
      />
      <button onClick={() => handleSubmit("entrada")} style={{ background: "green", color: "white" }}>
        + Stock
      </button>
      <button onClick={() => handleSubmit("saida")} style={{ background: "red", color: "white" }}>
        - Stock
      </button>
    </div>
  );
}
