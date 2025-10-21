import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./Layout/MainLayout";
import AdminLayout from "./Layout/AdminLayout";

import { Toaster } from "react-hot-toast";
import ChefLayout from "./Layout/ChefLayout";
import WaiterLayout from "./Layout/WaiterLayout";
import LoginPage from "./Page/LoginPage/LoginPage";

function App() {
  return (
    <div className="App">
      <Toaster />
      <BrowserRouter>
        <Routes>
          {/* Ana sayfa rotaları MainLayout içinde */}
          <Route path="/*" element={<MainLayout />} />

          {/* Şef rotaları ChefLayout içinde */}
          <Route path="/chef/*" element={<ChefLayout />} />

          {/* Ofisiant rotaları WaiterLayout içinde */}
          <Route path="/waiter/*" element={<WaiterLayout />} />

          {/* Admin rotaları AdminLayout içinde */}
          <Route path="/admin/*" element={<AdminLayout />} />

          {/* Login sayfası için ayrı bir route */}
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
