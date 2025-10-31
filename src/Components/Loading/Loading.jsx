import React from "react";
import Lottie from "lottie-react";
import loader from "./loader.json"; // JSON faylın yolu
import './Loading.scss'

const ChaqrLoading = () => {
  return (
    <div
    className="chaqrLoadingContainer"
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Lottie
        animationData={loader}
        loop={true}
        autoplay={true}
        style={{
          width: 400, // 🔹 Genişlik
          height: 400, // 🔹 Hündürlük
          transform: "scale(1.5)", // 🔹 Əlavə böyütmə
        }}
      />
    </div>
  );
};

export default ChaqrLoading;
