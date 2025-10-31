import React, { useEffect, useRef, useState, useCallback } from "react";
import "./ProductPage1.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Left from "../../Image/MenuLeft.png";
import Right from "../../Image/MenuRight.png";
import { IoIosArrowRoundForward } from "react-icons/io";
import { MdOutlineError } from "react-icons/md";
import { BiPackage } from "react-icons/bi";
import { FaShoppingBasket } from "react-icons/fa";

function ProductPage1() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(8);
  const [basketCount, setBasketCount] = useState(0);
  const [showBasketBtn, setShowBasketBtn] = useState(false);
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const API_BASE = `${API_BASE_URL}/api`;

  const catsRef = useRef(null);
  const [scrollActiveCat, setScrollActiveCat] = useState("all");
  const basketTimerRef = useRef(null);

  // Səbət sayını yoxla və yenilə
  const updateBasketCount = () => {
    const basket = JSON.parse(localStorage.getItem("my_basket")) || [];
    setBasketCount(basket.length);
    
    // Əgər səbətdə məhsul varsa button-u göstər
    if (basket.length > 0) {
      setShowBasketBtn(true);
    } else {
      setShowBasketBtn(false);
    }
  };

  // İlkin yüklənmə - səbət statusunu yoxla
  useEffect(() => {
    updateBasketCount();
  }, []);

  // localStorage dəyişikliklərini dinlə
  useEffect(() => {
    const handleStorageChange = () => {
      updateBasketCount();
    };

    // Storage event-i üçün listener (digər tab-lar üçün)
    window.addEventListener("storage", handleStorageChange);

    // Custom event üçün listener (eyni səhifə üçün)
    window.addEventListener("basketUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("basketUpdated", handleStorageChange);
    };
  }, []);

  // Periodic yoxlama (əlavə təhlükəsizlik üçün)
  useEffect(() => {
    const checkBasketChanges = () => {
      const currentBasket = JSON.parse(localStorage.getItem("my_basket")) || [];
      if (currentBasket.length !== basketCount) {
        updateBasketCount();
      }
    };

    const interval = setInterval(checkBasketChanges, 500);

    return () => clearInterval(interval);
  }, [basketCount]);

  // API-dən məlumatlar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get(`${API_BASE}/categories/`),
          axios.get(`${API_BASE}/products/`),
        ]);
        const cats = [{ id: "all", name_az: "Hamısı" }, ...catRes.data];
        setCategories(cats);
        setProducts(prodRes.data);
        setError(null);
      } catch (err) {
        console.error("API error:", err);
        setError("server_error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  // Mərkəzə yaxın kateqoriya
  const updateActiveByScroll = useCallback(() => {
    const el = catsRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;

    let bestId = scrollActiveCat;
    let bestDist = Number.POSITIVE_INFINITY;

    const items = Array.from(el.querySelectorAll("[data-cat-id]"));
    items.forEach((item) => {
      const r = item.getBoundingClientRect();
      const itemCenter = r.left + r.width / 2;
      const dist = Math.abs(itemCenter - centerX);
      if (dist < bestDist) {
        bestDist = dist;
        bestId = item.getAttribute("data-cat-id");
      }
    });

    setScrollActiveCat(bestId);
  }, [scrollActiveCat]);

  useEffect(() => {
    const el = catsRef.current;
    if (!el) return;

    const handler = () => updateActiveByScroll();
    el.addEventListener("scroll", handler, { passive: true });
    updateActiveByScroll();

    return () => {
      el.removeEventListener("scroll", handler);
    };
  }, [updateActiveByScroll]);

  // Kateqoriya klik
  const onCategoryClick = (catId) => {
    setSelectedCategory(catId);
    setVisibleCount(8);

    const el = catsRef.current;
    if (!el) return;
    const target = el.querySelector(`[data-cat-id="${catId}"]`);
    if (!target) return;

    const parentRect = el.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const offset =
      targetRect.left -
      (parentRect.left + parentRect.width / 2 - targetRect.width / 2);

    el.scrollBy({ left: offset, behavior: "smooth" });
  };

  // Səbətə əlavə et
  const handleAddToBasket = (item) => {
    const basket = JSON.parse(localStorage.getItem("my_basket")) || [];
    
    if (!basket.includes(item.id)) {
      basket.push(item.id);
      localStorage.setItem("my_basket", JSON.stringify(basket));
      
      // Custom event göndər (digər komponentləri yeniləmək üçün)
      window.dispatchEvent(new Event("basketUpdated"));
      
      // Səbət sayını yenilə
      updateBasketCount();
      
      // Button artıq updateBasketCount-da göstəriləcək
      // Əlavə animasiya effekti üçün pulse class əlavə et
      setShowBasketBtn(false);
      setTimeout(() => setShowBasketBtn(true), 10);
      
    } else {
      alert(`${item.name_az} artıq səbətdə var`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="productPage1">
        <img src={Left} className="left" alt="left-decor" />
        <img src={Right} className="right" alt="right-decor" />
        <div className="product-page">
          <div className="status-box loading-box">
            <div className="spinner"></div>
            <h2>Yüklənir...</h2>
            <p>Məhsullar yüklənir, zəhmət olmasa gözləyin.</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error === "server_error") {
    return (
      <div className="productPage1">
        <img src={Left} className="left" alt="left-decor" />
        <img src={Right} className="right" alt="right-decor" />
        <div className="product-page">
          <h2 className="title">Məhsullarımız</h2>
          <p className="subtitle">Ənənəvi ləzzətlərimizlə tanış olun</p>

          <div className="status-box error-box">
            <MdOutlineError className="status-icon error-icon" />
            <h2>Xəta baş verdi</h2>
            <p>Məhsullar yüklənərkən xəta baş verdi.</p>
            <p className="sub-text">
              Zəhmət olmasa səhifəni yeniləyin və ya bir az sonra yenidən cəhd
              edin.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="primary-btn"
            >
              Səhifəni yenilə
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No products state
  if (filteredProducts.length === 0) {
    return (
      <div className="productPage1">
        <img src={Left} className="left" alt="left-decor" />
        <img src={Right} className="right" alt="right-decor" />

        <div className="product-page">
          <h2 className="title">Məhsullarımız</h2>
          <p className="subtitle">Ənənəvi ləzzətlərimizlə tanış olun</p>

          <div className="categories" ref={catsRef}>
            {categories.map((cat) => {
              const isActiveUI =
                cat.id === selectedCategory ||
                cat.id === scrollActiveCat ||
                (selectedCategory === "all" && cat.id === "all");

              return (
                <div
                  key={cat.id}
                  data-cat-id={cat.id}
                  className={`category-btn ${isActiveUI ? "active" : ""}`}
                  onClick={() => onCategoryClick(cat.id)}
                >
                  {cat.name_az}
                </div>
              );
            })}
          </div>

          <div className="status-box no-product-box">
            <BiPackage className="status-icon package-icon" />
            <h2>Məhsul tapılmadı</h2>
            <p>Bu kateqoriyada məhsul mövcud deyil.</p>
            <p className="sub-text">
              Digər kateqoriyalardan seçim edə bilərsiniz.
            </p>
            <button
              onClick={() => onCategoryClick("all")}
              className="primary-btn"
            >
              Bütün məhsullar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="productPage1">
      <img src={Left} className="left" alt="left-decor" />
      <img src={Right} className="right" alt="right-decor" />

      <div className="product-page">
        <h2 className="title">Məhsullarımız</h2>
        <p className="subtitle">Ənənəvi ləzzətlərimizlə tanış olun</p>

        <div className="categories" ref={catsRef}>
          {categories.map((cat) => {
            const isActiveUI =
              cat.id === selectedCategory ||
              cat.id === scrollActiveCat ||
              (selectedCategory === "all" && cat.id === "all");

            return (
              <div
                key={cat.id}
                data-cat-id={cat.id}
                className={`category-btn ${isActiveUI ? "active" : ""}`}
                onClick={() => onCategoryClick(cat.id)}
              >
                {cat.name_az}
              </div>
            );
          })}
        </div>

        <div className="products">
          {visibleProducts.map((item, i) => (
            <div
              className="product-card fade-up"
              style={{ animationDelay: `${i * 40}ms` }}
              key={item.id}
            >
              <img src={item.image} alt={item.name_az} />
              <div className="info">
                <div className="text">
                  <h3>{item.name_az}</h3>
                  <p>{item.description_az}</p>
                </div>
                <span className="price">{item.cost} AZN</span>
              </div>
              <button
                className="add-btn"
                onClick={() => handleAddToBasket(item)}
              >
                Səbətə əlavə et
                <div className="icon">
                  <IoIosArrowRoundForward />
                </div>
              </button>
            </div>
          ))}
        </div>

        {visibleCount < filteredProducts.length && (
          <div
            className="more"
            onClick={() => setVisibleCount((prev) => prev + 8)}
          >
            Daha çox
          </div>
        )}
      </div>

      {/* Fixed Basket Button - Həmişə göstər əgər səbətdə məhsul varsa */}
      {showBasketBtn && basketCount > 0 && (
        <button 
          className="fixed-basket-btn"
          onClick={() => navigate('/basket')}
        >
          <FaShoppingBasket />
          <span className="basket-count">{basketCount}</span>
        </button>
      )}
    </div>
  );
}

export default ProductPage1;
