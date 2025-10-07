import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProdutoForm from "./components/ProdutoForm";

export default function App({ modoEscuro, toggleModo }) {
  const [produtos, setProdutos] = useState([]);
  const [quantidades, setQuantidades] = useState({});
  const [pesquisa, setPesquisa] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      modoEscuro ? "dark" : "light"
    );
  }, [modoEscuro]);

  const carregarProdutos = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/produtos/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      if (!res.ok) {
        throw new Error(`Erro ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setProdutos(data);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true });
    } else {
      carregarProdutos();
    }
  }, [navigate]);

  const handleQtdChange = (id, val) =>
    setQuantidades((q) => ({ ...q, [id]: val }));


  const alterarStock = async (id, tipo) => {
    const q = parseInt(quantidades[id], 10);
  
    if (isNaN(q) || q <= 0) {
      alert("Insere uma quantidade válida");
      return;
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Sessão expirada. Por favor, faz login novamente.");
      navigate("/login", { replace: true });
      return;
    }
  
    try {
      const res = await fetch("http://127.0.0.1:8000/api/movimentos/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ produto: id, tipo, quantidade: q }),
      });
  
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }
  
      if (!res.ok) {
        const data = await res.json();
        alert("Erro: " + (data.detail || "Não foi possível alterar o stock."));
        return;
      }
  
      carregarProdutos();
      setQuantidades((prev) => ({ ...prev, [id]: "" }));
    } catch (err) {
      console.error("Erro ao alterar stock:", err);
      alert("Erro ao comunicar com o servidor.");
    }
  };
  

 const S = {
    container: { padding: "80px 20px 20px", minHeight: "100vh",
      background: modoEscuro ? "#343541" : "#f7f7f8",
      color: modoEscuro ? "#eee" : "#111", transition: "background .3s" },
    title: { textAlign: "center", margin: "0 0 1rem",
      fontSize: "2rem", fontWeight: 600 },
    subNav: { display: "flex", justifyContent: "center",
      gap: "1rem", marginBottom: "1.5rem" },
    linkCritico: { color: modoEscuro ? "#82cfff" : "#0d6efd",
      textDecoration: "none", fontWeight: 500 },
    input: { display: "block", width: "100%", maxWidth: 400,
      margin: "0 auto 1.5rem", padding: ".6rem", borderRadius: 4,
      border: "1px solid #888", background: modoEscuro ? "#2e2e2e" : "#fff",
      color: modoEscuro ? "#eee" : "#111" },
    table: { width: "100%", maxWidth: 1200, margin: "1rem auto",
      borderCollapse: "separate", borderSpacing: 0, borderRadius: 8,
      overflow: "hidden",
      boxShadow: modoEscuro
        ? "0 2px 8px rgba(0,0,0,.5)"
        : "0 2px 8px rgba(0,0,0,.1)" },
    th: { background: modoEscuro ? "#2a2a2a" : "#ececec",
      padding: ".75rem 1rem", textAlign: "left", fontWeight: 600 },
    tr: (i) => ({
      background:
        i % 2 === 0
          ? modoEscuro
            ? "#343541"
            : "#fff"
          : modoEscuro
          ? "#2e2e2e"
          : "#f7f7f7",
    }),
    td: { padding: ".65rem 1rem" },
    estadoCell: { display: "flex", alignItems: "center",
      gap: ".5rem", flexWrap: "nowrap", minWidth: 460 },
    qtyInput: { width: 60, padding: ".3rem", borderRadius: 4,
      border: "1px solid #888", textAlign: "center",
      background: modoEscuro ? "#2e2e2e" : "#fff",
      color: modoEscuro ? "#eee" : "#111" },
    btnBase: { border: "none", borderRadius: 4,
      padding: ".4rem .8rem", margin: "0 .2rem",
      cursor: "pointer", color: "#fff", fontWeight: 600 },
    btnGreen: { background: "#4caf50" },
    btnRed: { background: "#e53935" },
    btnOrange: { background: "#ffa500" },
    btnGray: { background: "#666" },
  };

  return (
    <div style={S.container}>
      <Navbar modoEscuro={modoEscuro} toggleModo={toggleModo} />

      <h1 style={S.title}>📦 Inventário</h1>

      <ProdutoForm onAdd={carregarProdutos} />

      <div style={S.subNav}>
        <Link to="/critico" style={S.linkCritico}>
          ⚠️ Produtos Pendentes
        </Link>
        <Link to="/historico" style={S.linkCritico}>
          📜 Histórico
        </Link>
      </div>

      <input
        style={S.input}
        placeholder="🔎 Procurar por nome ou código…"
        value={pesquisa}
        onChange={(e) => setPesquisa(e.target.value)}
      />

      <table style={S.table}>
        <thead>
          <tr>
            {["Nome", "Código", "Quantidade", "Mínimo", "Preço", "Estado"].map(
              (h) => (
                <th key={h} style={S.th}>
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {produtos
            .filter(
              (p) =>
                p.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
                String(p.codigo_barras).includes(pesquisa)
            )
            .map((prod, i) => (
              <tr key={prod.id} style={S.tr(i)}>
                <td style={S.td}>{prod.nome}</td>
                <td style={S.td}>{prod.codigo_barras}</td>
                <td style={S.td}>{prod.quantidade}</td>
                <td style={S.td}>{prod.quantidade_minima}</td>
                <td style={S.td}>
                  {Number(prod.preco || 0).toFixed(2)} €
                </td>
                <td style={S.td}>
                  <div style={S.estadoCell}>
                    <input
                      type="number"
                      min="1"
                      placeholder="Qtd"
                      value={quantidades[prod.id] || ""}
                      onChange={(e) =>
                        handleQtdChange(prod.id, e.target.value)
                      }
                      style={S.qtyInput}
                    />
                    <button
                      onClick={() => alterarStock(prod.id, "entrada")}
                      style={{ ...S.btnBase, ...S.btnGreen }}
                    >
                      + Stock
                    </button>
                    <button
                      onClick={() => alterarStock(prod.id, "saida")}
                      style={{ ...S.btnBase, ...S.btnRed }}
                    >
                      − Stock
                    </button>
                    {prod.pedido_reposicao ? (
                      <button
                        onClick={async () => {
                          const token = localStorage.getItem("token");
                          await fetch(
                            `http://127.0.0.1:8000/api/produtos/${prod.id}/`,
                            {
                              method: "PATCH",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Token ${token}`,
                              },
                              body: JSON.stringify({
                                pedido_reposicao: false,
                              }),
                            }
                          );
                          carregarProdutos();
                        }}
                        style={{ ...S.btnBase, ...S.btnGray }}
                      >
                        ❌ Cancelar
                      </button>
                    ) : (
                      <button
                        onClick={async () => {
                          const token = localStorage.getItem("token");
                          await fetch(
                            `http://127.0.0.1:8000/api/produtos/${prod.id}/`,
                            {
                              method: "PATCH",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Token ${token}`,
                              },
                              body: JSON.stringify({
                                pedido_reposicao: true,
                              }),
                            }
                          );
                          carregarProdutos();
                        }}
                        style={{ ...S.btnBase, ...S.btnOrange }}
                      >
                        📦 Pedir
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <footer style={{
      textAlign: 'center',
      marginTop: '2rem',
      padding: '1rem',
      fontSize: '0.85rem',
      color: '#ccc'
    }}>
      © 2024-2025 | Fábio Almeida – 2022291 | Projeto Académico – ISTEC Lisboa
    </footer>
    </div>
    
    
    
  );

}
