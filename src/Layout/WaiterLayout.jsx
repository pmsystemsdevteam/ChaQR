import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ChefWaiterNav from "./ChefWaiterNav/ChefWaiterNav";
import WaiterHomePage from "../Page/WaiterHomePage/WaiterHomePage";
import WaiterAlltablePage from "../Page/WaiterAlltablePage/WaiterAlltablePage";
import WaiterMenuPage from "../Page/WaiterMenuPage/WaiterMenuPage";
import WaiterLogin from "../Page/WaiterLogin/WaiterLogin";


function WaiterLayout() {
  return (
    <div id="waiterLayout">
      <Routes>
        <Route path="/login" element={<WaiterLogin />} />
        <Route path="/" element={<PublicLayout><WaiterHomePage /></PublicLayout>} />
        <Route
          path="/allTable"
          element={
            <ProtectedRoute>
              <WaiterAlltablePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/waiterMenu"
          element={
            <ProtectedRoute>
              <WaiterMenuPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}


function PublicLayout({ children }) {
  return (
    <>
      <ChefWaiterNav userType="waiter" isPublic={true} />
      <main className="waiterLayout__content">{children}</main>
    </>
  );
}


function ProtectedRoute({ children }) {
  const token = localStorage.getItem("waiterToken");
  
  if (!token) {
    return <Navigate to="/waiter/login" replace />;
  }

  return (
    <>
      <ChefWaiterNav userType="waiter" isPublic={false} />
      <main className="waiterLayout__content">{children}</main>
    </>
  );
}


export default WaiterLayout;
