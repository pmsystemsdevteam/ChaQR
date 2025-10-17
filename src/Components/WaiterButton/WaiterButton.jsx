// src/Components/WaiterButton/WaiterButton.jsx
import React from "react";
import { FaUserLarge } from "react-icons/fa6";
import { BiSolidExit } from "react-icons/bi";
import { LuSquareMenu } from "react-icons/lu";
import { Link, useLocation } from "react-router-dom";
import "./WaiterButton.scss";

function WaiterButton() {
  const location = useLocation();
  const path = location.pathname;

  let Icon;
  let targetPath;
  let title;

  if (path === "/waiter/login") {
    Icon = LuSquareMenu;
    targetPath = "/waiter";
    title = "Menyu";
  } else if (path === "/waiter") {
    Icon = FaUserLarge;
    targetPath = "/waiter/login";
    title = "Giriş";
  } else {
    Icon = BiSolidExit;
    targetPath = "/waiter";
    title = "Çıxış";
  }

  return (
    <Link to={targetPath} className="waiterBtn" title={title}>
      <Icon />
    </Link>
  );
}

export default WaiterButton;
