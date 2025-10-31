import React, { useEffect, useState } from "react";
import "./WaiterMenuPage.scss";
import { FaPlus, FaMinus } from "react-icons/fa";
import axios from "axios";
import { IoCloseSharp } from "react-icons/io5";
import * as LucideIcons from "lucide-react";
import { useNavigate } from "react-router-dom";

function WaiterMenuPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [basket, setBasket] = useState([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [settings, setSettings] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [existingBasket, setExistingBasket] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const BASE_URL = `${API_BASE_URL}/api`;
  const navigate = useNavigate();

  useEffect(() => {
    const tableId = localStorage.getItem("selectedTableId");
    if (!tableId) {
      alert("Masa seçilməyib!");
      navigate("/waiter/alltable");
      return;
    }
    setSelectedTable(tableId);
    fetchCategories();
    fetchSettings();
    loadData(tableId);
  }, []);

  const loadData = async (tableId) => {
    try {
      // Əvvəlcə məhsulları yüklə
      const productsRes = await axios.get(`${BASE_URL}/products/`);
      setProducts(productsRes.data);

      // Sonra mövcud sifarişi yoxla
      const basketsRes = await axios.get(`${BASE_URL}/baskets/`);
      const tableBasket = basketsRes.data.find(
        (b) => b.table.id === parseInt(tableId) && !b.is_cancelled
      );

      if (tableBasket) {
        setExistingBasket(tableBasket);
        setNote(tableBasket.note || "");
        
        // Mövcud sifarişi səbətə yüklə
        const loadedItems = tableBasket.items.map((item) => {
          const product = productsRes.data.find((p) => p.id === item.product);
          return {
            id: item.product,
            count: item.count,
            cost: item.cost,
            name_az: item.name_az,
            image: product?.image || null,
            category: product?.category || null,
          };
        });
        setBasket(loadedItems);
      }
    } catch (err) {
      console.error("Məlumatlar yüklənmədi:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/categories/`);
      setCategories(res.data);
      if (res.data.length > 0) setActiveCategory(res.data[0].id);
    } catch (err) {
      console.error("Kateqoriyalar alınmadı:", err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/settings/current/`);
      setSettings(res.data);
    } catch (err) {
      console.error("Parametrlər alınmadı:", err);
    }
  };

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

  const serviceCharge = settings
    ? ((totalPrice * parseFloat(settings.service_percent)) / 100).toFixed(2)
    : "0.00";

  const grandTotal = (
    parseFloat(totalPrice) + parseFloat(serviceCharge)
  ).toFixed(2);

  const confirmOrder = async () => {
    if (basket.length === 0) {
      alert("Səbət boşdur!");
      return;
    }

    if (!selectedTable) {
      alert("Masa seçilməyib!");
      return;
    }

    const orderData = {
      table_id: selectedTable,
      note: note,
      items: basket.map((item) => ({
        product: item.id,
        count: item.count,
      })),
    };

    try {
      if (existingBasket) {
        await axios.put(`${BASE_URL}/baskets/${existingBasket.id}/`, orderData);
        alert("Sifariş yeniləndi!");
      } else {
        await axios.post(`${BASE_URL}/baskets/`, orderData);
        alert("Sifariş təsdiqləndi!");
      }
      setBasket([]);
      setNote("");
      localStorage.removeItem("selectedTableId");
      navigate("/waiter/alltable");
    } catch (err) {
      console.error("Sifariş göndərilmədi:", err);
      alert("Xəta baş verdi!");
    }
  };

  const filteredProducts = activeCategory
    ? products.filter((p) => p.category === activeCategory)
    : products;

  if (loading)
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>Yüklənir...</div>
    );

  return (
    <div id="waiterMenuPage">
      <div className="left">
        <div className="categoryBar">
          {categories.map((cat) => {
            const IconComp = LucideIcons[cat.icon] || LucideIcons.Utensils;
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

        <div className="productSection">
          {filteredProducts.map((product) => {
            const inBasket = basket.find((x) => x.id === product.id);
            return (
              <div className="productCard" key={product.id}>
                <div className="up">
                  {product.image ? (
                    <img src={product.image} alt={product.name_az} />
                  ) : (
                    <div className="noImage">Şəkil yoxdur</div>
                  )}
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
                    <span>{inBasket ? inBasket.count : 0}</span>
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

      <div className="basketSection">
        {existingBasket && (
          <div className="existingOrderInfo">
            <p>Sifariş №{existingBasket.order_number}</p>
            {/* <span>Status: {existingBasket.table.status}</span> */}
          </div>
        )}
        <div className="basketScroll">
          {basket.length === 0 ? (
            <p className="empty">Səbət boşdur</p>
          ) : (
            basket.map((item) => (
              <div className="basketItem" key={item.id}>
                {item.image ? (
                  <img src={item.image} alt={item.name_az} />
                ) : (
                  <div className="noImage">Şəkil yoxdur</div>
                )}
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
                  title="Sil"
                >
                  <IoCloseSharp />
                </div>
                <div className="price">
                  {(parseFloat(item.cost) * item.count).toFixed(2)} <p>₼</p>
                </div>
              </div>
            ))
          )}
          <input
            className="note"
            placeholder="Mətbəx üçün qeyd"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="basketFooter">
          <p className="subtotal">Məhsullar: {totalPrice} ₼</p>
          <p className="service">
            Servis ({settings?.service_percent || 0}%): {serviceCharge} ₼
          </p>
          <p className="total">Cəmi: {grandTotal} ₼</p>
          <button className="confirmBtn" onClick={confirmOrder}>
            {existingBasket ? "Sifarişi yenilə" : "Sifarişi təsdiqlə"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default WaiterMenuPage;
