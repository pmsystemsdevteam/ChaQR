import React, { useState } from "react";
import "./AdminArcitecturePage.scss";

function AdminArchitecturePage() {
  const [activeTab, setActiveTab] = useState("gunluk");

  const analytics = {
    gunlukGelir: {
      amount: "45,000 AZN",
      change: "+4.5%",
      label: "Ortalama günlük müştəri",
    },
    masaSayi: { count: 35, label: "Ümumi masa sayı" },
    sifarishSayi: { count: 8000, label: "Günlük sifariş sayı" },
  };

  const infoMetrics = [
    { label: "Masa dolulığu:", value: "78%" },
    { label: "İçki Başına Sifariş:", value: "78%" },
    { label: "Masa Başına Gedir:", value: "78%" },
    { label: "Sifariş Orta Dəyəri:", value: "78%" },
  ];

  const topProducts = [
    { id: 1, name: "Sezar salatı", time: "16:15", quantity: 16 },
    { id: 2, name: "Sezar salatı", time: "16:15", quantity: 16 },
    { id: 3, name: "Sezar salatı", time: "16:15", quantity: 16 },
    { id: 4, name: "Sezar salatı", time: "16:15", quantity: 16 },
    { id: 5, name: "Sezar salatı", time: "16:15", quantity: 16 },
  ];

  return (
    <div className="architecture-page">
      <div className="architecture-container">
        <header className="page-header">
          <h1>Restoran Arxitektura & Analitika</h1>
          <p>İş performansı və infrastruktur göstəriciləri</p>
        </header>

        <div className="tabs">
          <button
            className={`tab ${activeTab === "gunluk" ? "active" : ""}`}
            onClick={() => setActiveTab("gunluk")}
          >
            Günlük
          </button>
          <button
            className={`tab ${activeTab === "haftalik" ? "active" : ""}`}
            onClick={() => setActiveTab("haftalik")}
          >
            Həftəlik
          </button>
          <button
            className={`tab ${activeTab === "ayliq" ? "active" : ""}`}
            onClick={() => setActiveTab("ayliq")}
          >
            Aylıq
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Günlük Gəlir</h3>
            <div className="stat-value">
              {analytics.gunlukGelir.amount}
              <span className="change-positive">
                {analytics.gunlukGelir.change}
              </span>
            </div>
            <p className="stat-label">{analytics.gunlukGelir.label}</p>
          </div>

          <div className="stat-card">
            <h3>Masa sayı</h3>
            <div className="stat-value">{analytics.masaSayi.count}</div>
            <p className="stat-label">{analytics.masaSayi.label}</p>
          </div>

          <div className="stat-card">
            <h3>Sifariş sayı</h3>
            <div className="stat-value">{analytics.sifarishSayi.count}</div>
            <p className="stat-label">{analytics.sifarishSayi.label}</p>
          </div>
        </div>

        <div className="content-grid">
          <div className="info-section">
            <h2>Məlumat Analitikası</h2>
            <div className="metrics-list">
              {infoMetrics.map((metric, index) => (
                <div key={index} className="metric-row">
                  <span className="metric-label">{metric.label}</span>
                  <span className="metric-value">{metric.value}</span>
                </div>
              ))}
            </div>

            <div className="report-buttons">
              <div className="report-item">
                <div className="icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="report-text">
                  <h4>Günlük Hesabat</h4>
                  <p>Günlük satış və sifariş hesabatı</p>
                </div>
                <button className="download-btn">Yüklə</button>
              </div>

              <div className="report-item">
                <div className="icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="report-text">
                  <h4>Həftəlik Hesabat</h4>
                  <p>Həftəlik satış və sifariş hesabatı</p>
                </div>
                <button className="download-btn">Yüklə</button>
              </div>

              <div className="report-item">
                <div className="icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="report-text">
                  <h4>Aylıq Hesabat</h4>
                  <p>Aylıq satış və sifariş hesabatı</p>
                </div>
                <button className="download-btn">Yüklə</button>
              </div>
            </div>
          </div>

          <div className="products-section">
            <h2>Günlük ən çox satılan məhsullar</h2>
            <div className="products-list">
              {topProducts.map((product) => (
                <div key={product.id} className="product-item">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1200px-Good_Food_Display_-_NCI_Visuals_Online.jpg"
                    className="product-image"
                  />
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <span className="product-time">{product.time}</span>
                  </div>
                  <span className="product-quantity">
                    {product.quantity} ədəd
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminArchitecturePage;
