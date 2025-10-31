import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ChefWaiterNav from "./ChefWaiterNav/ChefWaiterNav";
import ChefHomePage from "../Page/ChefHomePage/ChefHomePage";
import ChefLogin from "../Page/ChefLogin/ChefLogin";

function ChefLayout() {
  return (
    <div id="chefLayout">
      <Routes>
        <Route path="/login" element={<ChefLogin />} />
        <Route
          path="/*"
          element={
            <ProtectedLayout>
              <Routes>
                <Route path="/" element={<ChefHomePage />} />
              </Routes>
            </ProtectedLayout>
          }
        />
      </Routes>
    </div>
  );
}

function ProtectedLayout({ children }) {
  const token = localStorage.getItem("chefToken");
  if (!token) return <Navigate to="/chef/login" replace />;

  return (
    <>
      <ChefWaiterNav userType="chef" />
      <main className="chefLayout__content">{children}</main>
    </>
  );
}

export default ChefLayout;
