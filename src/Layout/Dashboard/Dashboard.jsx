import React from "react";
import { NavLink } from "react-router-dom";
import "./Dashboard.scss";
import logo from "../../Image/AdminLogo.png";
import { MdOutlineLogout } from "react-icons/md";
function Dashboard() {
  const menuItems = [
    { id: 1, name: "İdarə sistemi", path: "/admin" },
    { id: 2, name: "Bütün sifarişlər", path: "/admin/orders" },
    { id: 3, name: "Məhsullar", path: "/admin/products-add" },
    { id: 4, name: "Kateqoriyalar", path: "/admin/category-add" },
    { id: 4, name: "Arxitektura", path: "/admin/architecture" },
  ];

  return (
    <aside className="sidebar-ui">
      {/* Logo */}
      <img src={logo} alt="" />

      {/* Menu */}
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

      {/* Logout */}
      <div className="logout-wrap">
        <button type="button" className="logout-btn">
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
