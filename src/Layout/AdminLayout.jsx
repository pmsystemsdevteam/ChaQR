import { Route, Routes } from "react-router-dom";
import ScrollToTop from "../Components/ScrollToTop";
import AdminManagePage from "../Page/AdminManagePage/AdminManagePage";
import AdminOrdersPage from "../Page/AdminOrdersPage/AdminOrdersPage";
import Dashboard from "./Dashboard/Dashboard";
import AdminProductPage from "../Page/AdminProductPage/AdminProductPage";
import AdminCategoryPage from "../Page/AdminCategoryPage/AdminCategoryPage";
import AdminArcitecturePage from "../Page/AdminArcitecturePage/AdminArcitecturePage";

function AdminLayout() {
  return (
    <div className="admin-layout">
      <ScrollToTop behavior="smooth" />
      <Dashboard />
      <Routes>
        <Route path="/" element={<AdminManagePage />} />
        <Route path="/orders" element={<AdminOrdersPage />} />
        <Route path="/products-add" element={<AdminProductPage />} />
        <Route path="/category-add" element={<AdminCategoryPage />} />
        <Route path="/architecture" element={<AdminArcitecturePage />} />
      </Routes>
    </div>
  );
}

export default AdminLayout;
