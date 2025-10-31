import React, { useState, useMemo } from "react";
import "./AdminArcitecturePage.scss";

function AdminArchitecturePage() {
  const [activeTab, setActiveTab] = useState("gunluk");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Bütün məhsullar");
  const [sortBy, setSortBy] = useState("sales_desc");
  const [dateRange, setDateRange] = useState({
    start: "2025-10-23",
    end: "2025-10-30",
  });

  const analyticsData = {
    gunluk: {
      gunlukGelir: {
        amount: "45,000 AZN",
        change: "+4.5%",
        label: "Ortalama günlük gəlir",
      },
      masaSayi: { count: 35, label: "Ümumi masa sayı" },
      sifarishSayi: { count: 8000, label: "Günlük sifariş sayı" },
      infoMetrics: [
        { label: "Masa doluluk dərəcəsi:", value: "78%" },
        { label: "Orta sifariş dəyəri:", value: "125 AZN" },
        { label: "Gəlir marjası:", value: "32%" },
        { label: "Müştəri sayı:", value: "360 nəfər" },
      ],
      topProducts: [
        {
          id: 1,
          name: "Lula Kəbab",
          category: "Yemeklər",
          price: "35 AZN",
          quantity: 48,
          revenue: "1,680 AZN",
        },
        {
          id: 2,
          name: "Sezar Salatı",
          category: "Salatlar",
          price: "28 AZN",
          quantity: 42,
          revenue: "1,176 AZN",
        },
        {
          id: 3,
          name: "Qız Buynuzu Biftek",
          category: "Yemeklər",
          price: "65 AZN",
          quantity: 36,
          revenue: "2,340 AZN",
        },
        {
          id: 4,
          name: "Zeytun Etiylə Plov",
          category: "Yemeklər",
          price: "30 AZN",
          quantity: 55,
          revenue: "1,650 AZN",
        },
        {
          id: 5,
          name: "Tiramisu",
          category: "Dessertlər",
          price: "18 AZN",
          quantity: 67,
          revenue: "1,206 AZN",
        },
      ],
    },
    haftalik: {
      gunlukGelir: {
        amount: "315,000 AZN",
        change: "+2.8%",
        label: "Həftəlik ümumi gəlir",
      },
      masaSayi: { count: 35, label: "Ümumi masa sayı" },
      sifarishSayi: { count: 56000, label: "Həftəlik sifariş sayı" },
      infoMetrics: [
        { label: "Orta masa doluluk:", value: "72%" },
        { label: "Orta sifariş dəyəri:", value: "128 AZN" },
        { label: "Gəlir marjası:", value: "30%" },
        { label: "Orta müştəri sayı:", value: "2,520 nəfər" },
      ],
      topProducts: [
        {
          id: 1,
          name: "Lula Kəbab",
          category: "Yemeklər",
          price: "35 AZN",
          quantity: 336,
          revenue: "11,760 AZN",
        },
        {
          id: 2,
          name: "Qız Buynuzu Biftek",
          category: "Yemeklər",
          price: "65 AZN",
          quantity: 252,
          revenue: "16,380 AZN",
        },
        {
          id: 3,
          name: "Sezar Salatı",
          category: "Salatlar",
          price: "28 AZN",
          quantity: 294,
          revenue: "8,232 AZN",
        },
        {
          id: 4,
          name: "Zeytun Etiylə Plov",
          category: "Yemeklər",
          price: "30 AZN",
          quantity: 385,
          revenue: "11,550 AZN",
        },
        {
          id: 5,
          name: "Tiramisu",
          category: "Dessertlər",
          price: "18 AZN",
          quantity: 469,
          revenue: "8,442 AZN",
        },
        {
          id: 6,
          name: "Coca Cola",
          category: "İçkilər",
          price: "5 AZN",
          quantity: 580,
          revenue: "2,900 AZN",
        },
      ],
    },
    ayliq: {
      gunlukGelir: {
        amount: "1,350,000 AZN",
        change: "+5.2%",
        label: "Aylıq ümumi gəlir",
      },
      masaSayi: { count: 35, label: "Ümumi masa sayı" },
      sifarishSayi: { count: 240000, label: "Aylıq sifariş sayı" },
      infoMetrics: [
        { label: "Orta masa doluluk:", value: "74%" },
        { label: "Orta sifariş dəyəri:", value: "126 AZN" },
        { label: "Gəlir marjası:", value: "31%" },
        { label: "Orta müştəri sayı:", value: "10,800 nəfər" },
      ],
      topProducts: [
        {
          id: 1,
          name: "Qız Buynuzu Biftek",
          category: "Yemeklər",
          price: "65 AZN",
          quantity: 1080,
          revenue: "70,200 AZN",
        },
        {
          id: 2,
          name: "Lula Kəbab",
          category: "Yemeklər",
          price: "35 AZN",
          quantity: 1440,
          revenue: "50,400 AZN",
        },
        {
          id: 3,
          name: "Zeytun Etiylə Plov",
          category: "Yemeklər",
          price: "30 AZN",
          quantity: 1650,
          revenue: "49,500 AZN",
        },
        {
          id: 4,
          name: "Sezar Salatı",
          category: "Salatlar",
          price: "28 AZN",
          quantity: 1260,
          revenue: "35,280 AZN",
        },
        {
          id: 5,
          name: "Tiramisu",
          category: "Dessertlər",
          price: "18 AZN",
          quantity: 2010,
          revenue: "36,180 AZN",
        },
        {
          id: 6,
          name: "Coca Cola",
          category: "İçkilər",
          price: "5 AZN",
          quantity: 3600,
          revenue: "18,000 AZN",
        },
        {
          id: 7,
          name: "Fanta",
          category: "İçkilər",
          price: "4 AZN",
          quantity: 2520,
          revenue: "10,080 AZN",
        },
      ],
    },
  };

  const currentData = analyticsData[activeTab];

  // Arasındırma və filtreleme
  const filteredAndSortedProducts = useMemo(() => {
    let products = [...currentData.topProducts];

    // Filtr tətbiq et
    if (selectedFilter !== "Bütün məhsullar") {
      products = products.filter((p) => p.category === selectedFilter);
    }

    // Axtarış tətbiq et
    if (searchQuery.trim()) {
      products = products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sıralama tətbiq et
    switch (sortBy) {
      case "sales_desc":
        products.sort((a, b) => b.quantity - a.quantity);
        break;
      case "sales_asc":
        products.sort((a, b) => a.quantity - b.quantity);
        break;
      case "revenue_desc":
        products.sort(
          (a, b) =>
            parseInt(b.revenue) - parseInt(a.revenue)
        );
        break;
      case "revenue_asc":
        products.sort(
          (a, b) =>
            parseInt(a.revenue) - parseInt(b.revenue)
        );
        break;
      case "name_asc":
        products.sort((a, b) => a.name.localeCompare(b.name, "az"));
        break;
      case "name_desc":
        products.sort((a, b) => b.name.localeCompare(a.name, "az"));
        break;
      default:
        break;
    }

    return products;
  }, [currentData.topProducts, selectedFilter, searchQuery, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedFilter("Bütün məhsullar");
    setSortBy("sales_desc");
  };

  const handleDateChange = (e, type) => {
    setDateRange({ ...dateRange, [type]: e.target.value });
  };

  return (
    <div className="architecture-page">
      <div className="architecture-container">
        <header className="page-header">
          <h1>Restoran Maliyyə Analitikası</h1>
          <p>Gəlir, xərc və performans göstəriciləri</p>
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

        <div className="date-range-filter">
          <div className="date-input-group">
            <label htmlFor="start-date">Başlanğıc tarixi:</label>
            <input
              id="start-date"
              type="date"
              value={dateRange.start}
              onChange={(e) => handleDateChange(e, "start")}
            />
          </div>
          <div className="date-input-group">
            <label htmlFor="end-date">Son tarixi:</label>
            <input
              id="end-date"
              type="date"
              value={dateRange.end}
              onChange={(e) => handleDateChange(e, "end")}
            />
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h3>Ümumi Gəlir</h3>
            <div className="stat-value">
              {currentData.gunlukGelir.amount}
              <span className="change-positive">
                {currentData.gunlukGelir.change}
              </span>
            </div>
            <p className="stat-label">{currentData.gunlukGelir.label}</p>
          </div>

          <div className="stat-card">
            <h3>Masa Sayı</h3>
            <div className="stat-value">{currentData.masaSayi.count}</div>
            <p className="stat-label">{currentData.masaSayi.label}</p>
          </div>

          <div className="stat-card">
            <h3>Sifariş Sayı</h3>
            <div className="stat-value">
              {currentData.sifarishSayi.count.toLocaleString("az-AZ")}
            </div>
            <p className="stat-label">{currentData.sifarishSayi.label}</p>
          </div>
        </div>

        <div className="content-grid">
          <div className="info-section">
            <h2>Maliyyə Göstəriciləri</h2>
            <div className="metrics-list">
              {currentData.infoMetrics.map((metric, index) => (
                <div key={index} className="metric-row">
                  <span className="metric-label">{metric.label}</span>
                  <span className="metric-value">{metric.value}</span>
                </div>
              ))}
            </div>

            <div className="report-buttons">
              <div className="report-item">
                <div className="icon-wrapper">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </div>
                <div className="report-text">
                  <h4>Maliyyə Hesabatı</h4>
                  <p>Gəlir və xərc detallı hesabatı</p>
                </div>
                <button className="download-btn">Yüklə</button>
              </div>

              <div className="report-item">
                <div className="icon-wrapper">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="12" y1="2" x2="12" y2="22"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <div className="report-text">
                  <h4>Gəlir Analizi</h4>
                  <p>Məhsul və xidmət gəlirliyi</p>
                </div>
                <button className="download-btn">Yüklə</button>
              </div>

              <div className="report-item">
                <div className="icon-wrapper">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2v20M2 12h20"></path>
                  </svg>
                </div>
                <div className="report-text">
                  <h4>Balans Hesabatı</h4>
                  <p>Mütəvazin hesab və vəsaitlər</p>
                </div>
                <button className="download-btn">Yüklə</button>
              </div>
            </div>
          </div>

          <div className="products-section">
            <div className="section-header">
              <h2>Ən Çox Satılan Məhsullar</h2>
              <span className="result-count">{filteredAndSortedProducts.length} nəticə</span>
            </div>

            <div className="search-and-filter">
              <div className="search-box">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Məhsul axtarışı..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                {searchQuery && (
                  <button
                    className="clear-search"
                    onClick={() => setSearchQuery("")}
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="filter-controls">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="filter-select"
                >
                  <option>Bütün məhsullar</option>
                  <option>Yemeklər</option>
                  <option>İçkilər</option>
                  <option>Dessertlər</option>
                  <option>Salatlar</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="sales_desc">Satışa görə (Yüksəkdən)</option>
                  <option value="sales_asc">Satışa görə (Aşağıdan)</option>
                  <option value="revenue_desc">Gəlirə görə (Yüksəkdən)</option>
                  <option value="revenue_asc">Gəlirə görə (Aşağıdan)</option>
                  <option value="name_asc">Ad (A-Z)</option>
                  <option value="name_desc">Ad (Z-A)</option>
                </select>

                {(searchQuery || selectedFilter !== "Bütün məhsullar" || sortBy !== "sales_desc") && (
                  <button className="clear-btn" onClick={handleClearFilters}>
                    Filtri Təmizlə
                  </button>
                )}
              </div>
            </div>

            <div className="products-list">
              {filteredAndSortedProducts.length > 0 ? (
                filteredAndSortedProducts.map((product) => (
                  <div key={product.id} className="product-item">
                    <img
                      src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&h=120&fit=crop"
                      alt={product.name}
                      className="product-image"
                    />
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <span className="product-category">{product.category}</span>
                      <span className="product-price">{product.price}</span>
                    </div>
                    <div className="product-stats">
                      <div className="stat-item">
                        <span className="stat-label">Sayı</span>
                        <span className="stat-value">{product.quantity}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Gəlir</span>
                        <span className="stat-value revenue">{product.revenue}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <p>Axtarış nəticəsi tapılmadı</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminArchitecturePage;
