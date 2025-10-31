import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Dashboard.scss";
import logo from "../../Image/AdminLogo.png";
import { MdOutlineLogout } from "react-icons/md";

function Dashboard() {
  const navigate = useNavigate();

  const menuItems = [
    { id: 1, name: "İdarə sistemi", path: "/admin" },
    { id: 2, name: "Bütün sifarişlər", path: "/admin/orders" },
    { id: 3, name: "Masalar", path: "/admin/tables" },
    { id: 4, name: "Məhsullar", path: "/admin/products-add" },
    { id: 5, name: "Kateqoriyalar", path: "/admin/category-add" },
    { id: 6, name: "Maliyyə", path: "/admin/finance" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminRefreshToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  return (
    <aside className="sidebar-ui">
      <img src={logo} alt="" />

      <ul className="menu">
        {menuItems.map((item) => (
          <li key={item.id}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                "menu-btn" + (isActive ? " is-active" : "")
              }
              end={item.path === "/admin"}
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="logout-wrap">
        <button type="button" className="logout-btn" onClick={handleLogout}>
          Çıxış
          <span className="key">
            <MdOutlineLogout />
          </span>
        </button>
      </div>
    </aside>
  );
}

export default Dashboard;
