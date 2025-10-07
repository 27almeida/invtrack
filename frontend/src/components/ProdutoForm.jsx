import { useState } from "react";

export default function ProdutoForm({ onAdd }) {
  const [formData, setFormData] = useState({
    nome: "",
    codigo_barras: "",
    quantidade: "",
    quantidade_minima: "",
    preco: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    const res = await fetch("http://127.0.0.1:8000/api/produtos/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      },
      body: JSON.stringify({
        nome: formData.nome,
        codigo_barras: formData.codigo_barras,
        quantidade: parseInt(formData.quantidade),
        quantidade_minima: parseInt(formData.quantidade_minima),
        preco: parseFloat(formData.preco),
      }),
    });
  
    if (res.ok) {
      onAdd();
      setFormData({
        nome: "",
        codigo_barras: "",
        quantidade: "",
        quantidade_minima: "",
        preco: "",
      });
    } else {
      const data = await res.json();
      console.error("Erro ao adicionar produto:", data);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem", padding: "1rem", background: "#1e1e1e", borderRadius: "8px" }}>
      <h2 style={{ color: "white" }}>➕ Adicionar Produto</h2>

      <label>Nome:</label>
      <input name="nome" value={formData.nome} onChange={handleChange} required />

      <label>Código de Barras:</label>
      <input name="codigo_barras" value={formData.codigo_barras} onChange={handleChange} required />

      <label>Stock Atual:</label>
      <input name="quantidade" type="number" value={formData.quantidade} onChange={handleChange} required />

      <label>Quantidade Mínima:</label>
      <input name="quantidade_minima" type="number" value={formData.quantidade_minima} onChange={handleChange} required />

      <label>Preço:</label>
      <input name="preco" type="number" step="0.01" value={formData.preco} onChange={handleChange} required />

      <br />
      <button type="submit">Salvar</button>

      <style>{`
        form label {
          display: block;
          color: white;
          margin-top: 0.8rem;
        }
        form input {
            width: 100%;
            padding: 0.5rem;
            margin-top: 0.2rem;
            margin-bottom: 0.5rem;
            border-radius: 4px;
        border: 1px solid #ccc;
        }
        form button {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          border: none;
          background: #4caf50;
          color: white;
          cursor: pointer;
          border-radius: 4px;
        }
      `}</style>
    </form>
  );
}