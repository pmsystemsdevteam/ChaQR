// src/Layout/WaiterLayout.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ChefNav from "./ChefNav/ChefNav";
import WaiterHomePage from "../Page/WaiterHomePage/WaiterHomePage";
import WaiterLoginPage from "../Page/WaiterLoginPage/WaiterLoginPage";
import WaiterAlltablePage from "../Page/WaiterAlltablePage/WaiterAlltablePage";
import WaiterMenuPage from "../Page/WaiterMenuPage/WaiterMenuPage";
import WaiterButton from "../Components/WaiterButton/WaiterButton";

function WaiterLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname.includes("/waiter/login");

  return (
    <div id="waiterLayout">
      {/* login səhifəsində nav gizlədilir */}
      {!isLoginPage && <ChefNav />}
      <WaiterButton />

      <main className="waiterLayout__content">
        <Routes>
          <Route path="/" element={<WaiterHomePage />} />
          <Route path="/login" element={<WaiterLoginPage />} />
          <Route path="/allTable" element={<WaiterAlltablePage />} />
          <Route path="/waiterMenu" element={<WaiterMenuPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default WaiterLayout;
