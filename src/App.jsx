import "./App.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { IoReload } from "react-icons/io5";
import MainLayout from "./Layout/MainLayout";
import AdminLayout from "./Layout/AdminLayout";
import { Toaster } from "react-hot-toast";
import ChefLayout from "./Layout/ChefLayout";
import WaiterLayout from "./Layout/WaiterLayout";
import LoginPage from "./Page/WaiterLogin/WaiterLogin";

function RefreshButton() {
  const location = useLocation();
  
  // Yalnız admin, waiter və chef səhifələrində göstər
  const showRefreshButton = 
    location.pathname.startsWith('/admin') || 
    location.pathname.startsWith('/waiter') || 
    location.pathname.startsWith('/chef');

  const handleRefresh = () => {
    window.location.reload();
  };

  if (!showRefreshButton) return null;

  return (
    <button 
      onClick={handleRefresh}
      className="refresh-button"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '12px',
        borderRadius: '50%',
        border: 'none',
        backgroundColor: '#007bff',
        color: 'white',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'rotate(180deg)';
        e.currentTarget.style.backgroundColor = '#0056b3';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'rotate(0deg)';
        e.currentTarget.style.backgroundColor = '#007bff';
      }}
    >
      <IoReload size={24} />
    </button>
  );
}

function App() {
  return (
    <div className="App">
      <Toaster />
      <BrowserRouter>
        <RefreshButton />
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
