import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import App from "./App";
import StockCritico from "./components/StockCritico";
import Historico from "./components/Historico";
import Login from "./components/Login";
import Register from "./components/Register";
import PrivateRoute from "./components/PrivateRoute";

function Router() {
  const [modoEscuro, setModoEscuro] = useState(true);
  const toggleModo = () => setModoEscuro(m => !m);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <App modoEscuro={modoEscuro} toggleModo={toggleModo} />
            </PrivateRoute>
          }
        />
        <Route
          path="/critico"
          element={
            <PrivateRoute>
              <StockCritico modoEscuro={modoEscuro} toggleModo={toggleModo} />
            </PrivateRoute>
          }
        />
        <Route
          path="/historico"
          element={
            <PrivateRoute>
              <Historico modoEscuro={modoEscuro} toggleModo={toggleModo} />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<Router />);
