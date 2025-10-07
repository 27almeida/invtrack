import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function Historico({ modoEscuro, toggleModo }) {
  const [movimentos, setMovimentos] = useState([]);
  const [produtoMap, setProdutoMap] = useState({});
  const navigate = useNavigate();


  const carregarProdutos = async (token) => {
    const res = await fetch("http://127.0.0.1:8000/api/produtos/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    if (!res.ok) throw new Error("Não autorizado");
    const data = await res.json();
    const mapa = {};
    data.forEach((p) => { mapa[p.id] = p.nome; });
    setProdutoMap(mapa);
  };
  const carregarHistorico = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
      return;
    }

    try {
      await carregarProdutos(token);
      const res = await fetch("http://127.0.0.1:8000/api/movimentos/", {
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
      if (!res.ok) throw new Error("Erro ao buscar histórico");

      let data = await res.json();
      data.sort((a, b) => b.id - a.id);
      setMovimentos(data);
    } catch (err) {
      console.error(err);
      localStorage.removeItem("token");
      navigate("/login", { replace: true });
    }
  };

  useEffect(() => {
    carregarHistorico();
    const iv = setInterval(carregarHistorico, 10000);
    return () => clearInterval(iv);
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

      <h1 style={S.title}>📜 Histórico de Movimentos</h1>

      <div style={S.subNav}>
        <Link to="/" style={S.linkVoltar}>
          🏠 Voltar ao Inventário
        </Link>
      </div>

      <table style={S.table}>
        <thead>
          <tr>
            <th style={S.th}>Produto</th>
            <th style={S.th}>Tipo</th>
            <th style={S.th}>Quantidade</th>
          </tr>
        </thead>
        <tbody>
          {movimentos.map((mov, i) => (
            <tr key={mov.id} style={S.tr(i)}>
              <td style={S.td}>
                {produtoMap[mov.produto] || `#${mov.produto}`}
              </td>
              <td style={S.td}>
                {mov.tipo === "entrada" ? "+ Entrada" : "− Saída"}
              </td>
              <td style={S.td}>{mov.quantidade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
