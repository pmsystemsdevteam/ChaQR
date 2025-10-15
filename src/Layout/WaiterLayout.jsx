import React from "react";
import { Routes, Route } from "react-router-dom";
import ChefNav from "./ChefNav/ChefNav";
import WaiterHomePage from "../Page/WaiterHomePage/WaiterHomePage";
import WaiterLoginPage from "../Page/WaiterLoginPage/WaiterLoginPage";
import WaiterAlltablePage from "../Page/WaiterAlltablePage/WaiterAlltablePage";

function WaiterLayout() {
  return (
    <div id="waiterLayout">
      <ChefNav />

      <main className="waiterLayout__content">
        <Routes>
          <Route path="/" element={<WaiterHomePage />} />
          <Route path="/login" element={<WaiterLoginPage />} />
          <Route path="/allTable" element={<WaiterAlltablePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default WaiterLayout;
