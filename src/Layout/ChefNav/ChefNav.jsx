import React from "react";
import "./ChefNav.scss";
// import logo from "../../assets/chefLogo.png"; // şəkil faylını burada saxlayacaqsan
import Logo from "../../Image/Logo.png";

function ChefNav() {
  return (
    <nav id="chefNav">
      <div className="chefNav__container">
        {/* <img src={logo} alt="Chef Logo" className="chefNav__logo" /> */}
        <img src={Logo} alt="" className="chefNav__logo" />
      </div>
    </nav>
  );
}

export default ChefNav;
