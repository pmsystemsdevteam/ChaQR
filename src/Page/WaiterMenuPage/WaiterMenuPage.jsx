import React, { useEffect, useState } from "react";
import "./WaiterMenuPage.scss";
import { FaPlus, FaMinus } from "react-icons/fa";
import { GrRestaurant } from "react-icons/gr";
import axios from "axios";
import { IoCloseSharp } from "react-icons/io5";
import * as LucideIcons from "lucide-react";
function WaiterMenuPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [basket, setBasket] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://172.20.5.167:8001/api";

  // --- Kategoriyaları çək ---
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/categories/`);
      setCategories(res.data);
      if (res.data.length > 0) setActiveCategory(res.data[0].id);
    } catch (err) {
      console.error("Kateqoriyalar alınmadı:", err);
    }
  };

  // --- Məhsulları çək ---
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/products/`);
      setProducts(res.data);
    } catch (err) {
      console.error("Məhsullar alınmadı:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // --- Səbət funksiyaları ---
  const addToBasket = (product) => {
    const exist = basket.find((item) => item.id === product.id);
    if (exist) {
      setBasket(
        basket.map((x) =>
          x.id === product.id ? { ...x, count: x.count + 1 } : x
        )
      );
    } else {
      setBasket([...basket, { ...product, count: 1 }]);
    }
  };

  const removeFromBasket = (product) => {
    const exist = basket.find((item) => item.id === product.id);
    if (!exist) return;
    if (exist.count === 1) {
      setBasket(basket.filter((x) => x.id !== product.id));
    } else {
      setBasket(
        basket.map((x) =>
          x.id === product.id ? { ...x, count: x.count - 1 } : x
        )
      );
    }
  };
  const totalPrice = basket
    .reduce((acc, item) => acc + parseFloat(item.cost) * item.count, 0)
    .toFixed(2);

  // --- Aktiv kateqoriyaya uyğun məhsullar ---
  const filteredProducts = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;

  if (loading)
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>Yüklənir...</div>
    );

  return (
    <div id="waiterMenuPage">
      {/* Sol hissə */}
      <div className="left">
        <div className="categoryBar">
          {categories.map((cat) => {
            const IconComp = LucideIcons[cat.icon] || LucideIcons.Utensils; // ✅ burda olmalıdır
            return (
              <div
                key={cat.id}
                className={`categoryCard ${
                  activeCategory === cat.id ? "active" : ""
                }`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <div className="icon">
                  <IconComp />
                </div>
                <div className="text">
                  <h4>{cat.name_az}</h4>
                </div>
              </div>
            );
          })}
        </div>
        {/* <span class="mdi--restaurant"></span> */}
        <div className="productSection">
          {filteredProducts.map((product) => {
            const inBasket = basket.find((x) => x.id === product.id);
            return (
              <div className="productCard" key={product.id}>
                <div className="up">
                  <img src={product.image} alt={product.name_az} />
                  <div className="info">
                    <h3>{product.name_az}</h3>
                    <p>{product.description_az}</p>
                  </div>
                </div>
                <div className="down">
                  <div className="price">
                    {parseFloat(product.cost).toFixed(2)} <p>₼</p>
                  </div>
                  <div className="quantity">
                    <button onClick={() => removeFromBasket(product)}>
                      <FaMinus />
                    </button>
                    <span>{inBasket ? inBasket.count : 1}</span>
                    <button onClick={() => addToBasket(product)}>
                      <FaPlus />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sağ hissə - səbət */}
      <div className="basketSection">
        <div className="basketScroll">
          {basket.length === 0 ? (
            <p className="empty">Səbət boşdur</p>
          ) : (
            basket.map((item) => (
              <div className="basketItem" key={item.id}>
                <img src={item.image} alt={item.name_az} />
                <div className="basketInfo">
                  <h5>
                    {categories.find((c) => c.id === item.category)?.name_az ||
                      "Kateqoriya"}
                  </h5>
                  <p>{item.name_az}</p>
                  <span className="count">{item.count} ədəd</span>
                </div>
                <div
                  className="deleteBtn"
                  onClick={() => removeFromBasket(item)}
                >
                  <IoCloseSharp />
                </div>
                <div className="price">
                  {(parseFloat(item.cost) * item.count).toFixed(2)} <p>₼</p>
                </div>
              </div>
            ))
          )}
          <input className="note" placeholder="Mətbəx üçün qeyd" />
        </div>

        <div className="basketFooter">
          <p className="total">Cəmi: {totalPrice} ₼</p>
          <button className="confirmBtn">Sifarişi təsdiqlə</button>
        </div>
      </div>
    </div>
  );
}

export default WaiterMenuPage;
