import React, { useEffect, useRef, useState, useCallback } from "react";
import "./ProductPage1.scss";
import axios from "axios";

import Left from "../../Image/MenuLeft.png";
import Right from "../../Image/MenuRight.png";
import { IoIosArrowRoundForward } from "react-icons/io";

const API_BASE = "http://172.20.5.167:8001/api";

function ProductPage1() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);

  // 🔹 Mobil scroll-aktiv kateqoriya üçün
  const catsRef = useRef(null);
  const [scrollActiveCat, setScrollActiveCat] = useState("all");

  // 🔹 API-dən məlumatlar
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
      } catch (err) {
        console.error("API error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔹 Filter
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  // 🔹 Mərkəzə yaxın kateqoriya hesablayan helper (mobil)
  const updateActiveByScroll = useCallback(() => {
    const el = catsRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;

    let bestId = scrollActiveCat;
    let bestDist = Number.POSITIVE_INFINITY;

    // uşaq düymələr
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

  // 🔹 Scroll dinləyicisi (yalnız mobil ölçüdə aktiv olur)
  useEffect(() => {
    const el = catsRef.current;
    if (!el) return;

    const handler = () => updateActiveByScroll();
    el.addEventListener("scroll", handler, { passive: true });

    // İlk renderdə də hesabla
    updateActiveByScroll();

    return () => {
      el.removeEventListener("scroll", handler);
    };
  }, [updateActiveByScroll]);

  // 🔹 Kateqoriya klik
  const onCategoryClick = (catId) => {
    setSelectedCategory(catId);
    setVisibleCount(8);

    // klik edilən elementi mərkəzə yaxınlaşdır (smooth scroll)
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

  if (loading) return <div className="loading">Yüklənir...</div>;

  return (
    <div className="productPage1">
      <img src={Left} className="left" alt="left-decor" />
      <img src={Right} className="right" alt="right-decor" />

      <div className="product-page">
        <h2 className="title">Məhsullarımız</h2>
        <p className="subtitle">Ənənəvi ləzzətlərimizlə tanış olun</p>

        {/* 🔹 Kategoriyalar */}
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

        {/* 🔹 Məhsullar */}
        <div className="products">
          {visibleProducts.map((item, i) => (
            <div className="product-card fade-up" style={{ animationDelay: `${i * 40}ms` }} key={item.id}>
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
                onClick={() => {
                  const basket = JSON.parse(localStorage.getItem("my_basket")) || [];
                  if (!basket.includes(item.id)) {
                    basket.push(item.id);
                    localStorage.setItem("my_basket", JSON.stringify(basket));
                    alert(`${item.name_az} səbətə əlavə olundu ✅`);
                  } else {
                    alert(`${item.name_az} artıq səbətdə var`);
                  }
                }}
              >
                Səbətə əlavə et
                <div className="icon">
                  <IoIosArrowRoundForward />
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* 🔹 Daha çox */}
        {visibleCount < filteredProducts.length && (
          <div className="more" onClick={() => setVisibleCount((prev) => prev + 8)}>
            Daha çox
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductPage1;
