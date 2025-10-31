import React from "react";
import { useNavigate } from "react-router-dom";
import "./ChefWaiterNav.scss";
import { IoLogOutOutline } from "react-icons/io5";
import Logo from "../../Image/Logo.png";


function ChefWaiterNav({ userType = "chef", isPublic = false }) {
  const navigate = useNavigate();


  const getUserName = () => {
    try {
      if (userType === "chef") {
        const chefUser = localStorage.getItem("chefUser");
        if (chefUser) {
          const user = JSON.parse(chefUser);
          return user.name || "Chef";
        }
        return "Chef";
      } else if (userType === "waiter") {
        const waiterUser = localStorage.getItem("waiterUser");
        if (waiterUser) {
          const user = JSON.parse(waiterUser);
          return user.name || "Waiter";
        }
        return "Waiter";
      }
    } catch (error) {
      console.error("User məlumatı oxunmadı:", error);
      return userType === "chef" ? "Chef" : "Waiter";
    }
  };


  const handleLogout = () => {
    if (userType === "chef") {
      localStorage.removeItem("chefToken");
      localStorage.removeItem("chefUser");
      navigate("/chef/login", { replace: true });
    } else if (userType === "waiter") {
      localStorage.removeItem("waiterToken");
      localStorage.removeItem("waiterUser");
      navigate("/waiter/login", { replace: true });
    }
  };


  const handleLogin = () => {
    if (userType === "chef") {
      navigate("/chef/login");
    } else if (userType === "waiter") {
      navigate("/waiter/login");
    }
  };


  return (
    <nav id="chefWaiterNav" className={`chefWaiterNav chefWaiterNav--${userType}`}>
      <div className="chefWaiterNav__container">
        <img src={Logo} alt="Logo" className="chefWaiterNav__logo" />
        
        {!isPublic && (
          <div className="chefWaiterNav__userName">
            {getUserName()}
          </div>
        )}
        
        {isPublic ? (
          <button onClick={handleLogin} className="chefWaiterNav__logout">
            <span>Giriş</span>
          </button>
        ) : (
          <button onClick={handleLogout} className="chefWaiterNav__logout">
            <IoLogOutOutline />
            <span>Çıxış</span>
          </button>
        )}
      </div>
    </nav>
  );
}


export default ChefWaiterNav;
