import { Route, Routes } from "react-router-dom";
import ScrollToTop from "../Components/ScrollToTop";
import AdminManagePage from "../Page/AdminManagePage/AdminManagePage";
import AdminOrdersPage from "../Page/AdminOrdersPage/AdminOrdersPage";
import Dashboard from "./Dashboard/Dashboard";
import AdminProductPage from "../Page/AdminProductPage/AdminProductPage";
import AdminCategoryPage from "../Page/AdminCategoryPage/AdminCategoryPage";
import AdminArcitecturePage from "../Page/AdminArcitecturePage/AdminArcitecturePage";
import AdminProtectedRoute from "./AdminProtectedRoute";
import AdminLogin from "../Page/AdminLogin/AdminLogin";
import AdminTablesPage from "../Page/AdminTablePage/AdminTablesPage";

function AdminLayout() {
  return (
    <Routes>
      {/* Login route - protected DEYIL */}
      <Route path="/login" element={<AdminLogin />} />
      
      {/* Protected routes */}
      <Route
        path="/*"
        element={
          <AdminProtectedRoute>
            <div className="adminLayout">
              <ScrollToTop behavior="smooth" />
              <Dashboard />
              <Routes>
                <Route path="/" element={<AdminManagePage />} />
                <Route path="/orders" element={<AdminOrdersPage />} />
                <Route path="/products-add" element={<AdminProductPage />} />
                <Route path="/tables" element={<AdminTablesPage/>} />
                <Route path="/category-add" element={<AdminCategoryPage />} />
                <Route path="/finance" element={<AdminArcitecturePage />} />
              </Routes>
            </div>
          </AdminProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AdminLayout;
