import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import ChefNav from "./ChefNav/ChefNav";
import WaiterHomePage from "../Page/WaiterHomePage/WaiterHomePage";
import WaiterLoginPage from "../Page/WaiterLoginPage/WaiterLoginPage";
import WaiterAlltablePage from "../Page/WaiterAlltablePage/WaiterAlltablePage";
import WaiterMenuPage from "../Page/WaiterMenuPage/WaiterMenuPage";

function WaiterLayout() {
  const path = window.location.pathname;
  return (
    <div id="waiterLayout">
      {path === "/waiter/login" ? null : <ChefNav />}

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
