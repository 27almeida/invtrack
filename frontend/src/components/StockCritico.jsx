import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function StockCritico({ modoEscuro, toggleModo }) {
  const [produtos, setProdutos] = useState([]);
  const navigate = useNavigate();

  const carregarCriticos = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
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

      const data = await res.json();
      const criticos = data.filter(
        (p) =>
          p.quantidade < p.quantidade_minima || p.pedido_reposicao === true
      );
      setProdutos(criticos);
    } catch (err) {
      console.error("Falha ao carregar críticos:", err);
    }
  };

  useEffect(() => {
    carregarCriticos();
  }, []);

  const S = {
    container: {
      padding: "80px 20px 20px",
      minHeight: "100vh",
      background: modoEscuro ? "#343541" : "#f7f7f8",
      color: modoEscuro ? "#eee" : "#111",
      transition: "background .3s, color .3s",
    },
    title: {
      textAlign: "center",
      margin: "0 0 1rem",
      fontSize: "2rem",
      fontWeight: 600,
    },
    subNav: {
      display: "flex",
      justifyContent: "center",
      gap: "1rem",
      marginBottom: "1.5rem",
    },
    linkVoltar: {
      color: modoEscuro ? "#82cfff" : "#0d6efd",
      textDecoration: "none",
      fontWeight: 500,
    },
    table: {
      width: "100%",
      maxWidth: 1200,
      margin: "1rem auto",
      borderCollapse: "separate",
      borderSpacing: 0,
      borderRadius: 8,
      overflow: "hidden",
      boxShadow: modoEscuro
        ? "0 2px 8px rgba(0,0,0,.5)"
        : "0 2px 8px rgba(0,0,0,.1)",
    },
    th: {
      background: modoEscuro ? "#2a2a2a" : "#ececec",
      padding: ".75rem 1rem",
      textAlign: "left",
      fontWeight: 600,
    },
    tr: (i) => ({
      background:
        i % 2 === 0
          ? modoEscuro
            ? "#343541"
            : "#fff"
          : modoEscuro
          ? "#2e2e2e"
          : "#f7f7f7",
      transition: "background .2s",
    }),
    td: { padding: ".65rem 1rem" },
  };

  return (
    <div style={S.container}>
      <Navbar modoEscuro={modoEscuro} toggleModo={toggleModo} />

      <h1 style={S.title}>⚠️ Produtos Pendentes</h1>

      <div style={S.subNav}>
        <Link to="/" style={S.linkVoltar}>
          🏠 Voltar ao Inventário
        </Link>
      </div>

      {produtos.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          Todos os produtos estão OK e sem pedidos pendentes ✅
        </p>
      ) : (
        <table style={S.table}>
          <thead>
            <tr>
              {["Nome", "Código", "Quantidade", "Mínimo", "Preço", "Pedido"].map(
                (h) => (
                  <th key={h} style={S.th}>
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {produtos.map((p, i) => (
              <tr key={p.id} style={S.tr(i)}>
                <td style={S.td}>{p.nome}</td>
                <td style={S.td}>{p.codigo_barras}</td>
                <td style={S.td}>{p.quantidade}</td>
                <td style={S.td}>{p.quantidade_minima}</td>
                <td style={S.td}>{Number(p.preco).toFixed(2)} €</td>
                <td style={S.td}>
                  {p.pedido_reposicao ? "📦 Pedido Pendente" : "⛔ Stock Baixo"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
