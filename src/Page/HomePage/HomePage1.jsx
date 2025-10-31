import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./HomePage1.scss";
import { PiCallBellFill } from "react-icons/pi";
import { ImUserTie } from "react-icons/im";
import Left from "../../Image/HomeLeft.png";
import Right from "../../Image/HomeRight.png";

function HomePage1() {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const API_URL = `${API_BASE_URL}/api/tables/`;
  
  const [hasOrders, setHasOrders] = useState(false);
  const [restaurantSettings, setRestaurantSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restoran ayarlarını API-dən çəkmək
  const fetchRestaurantSettings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/restaurant/settings/`);
      setRestaurantSettings(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Restoran ayarları yüklənə bilmədi:", error);
      setLoading(false);
    }
  };

  // API-dən basket məlumatını yoxlayan funksiya
  const checkBasketFromAPI = async () => {
    try {
      const tableNum = localStorage.getItem("table_num");
      if (!tableNum) {
        setHasOrders(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/baskets/`);
      const userBasket = response.data.find(
        (basket) => String(basket.table.table_num) === String(tableNum)
      );

      if (userBasket && userBasket.items && userBasket.items.length > 0) {
        setHasOrders(true);
      } else {
        setHasOrders(false);
      }
    } catch (error) {
      console.error("Basket yoxlama xətası:", error);
      setHasOrders(false);
    }
  };

  useEffect(() => {
    fetchRestaurantSettings();
    checkBasketFromAPI();

    const handleStorageChange = () => {
      checkBasketFromAPI();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('basketUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('basketUpdated', handleStorageChange);
    };
  }, []);

  const handleOrderClick = () => {
    if (hasOrders) {
      navigate("/myOrder");
    } else {
      navigate("/product");
    }
  };

  const callWaiter = async () => {
    try {
      const tableNum = localStorage.getItem("table_num");
      if (!tableNum) {
        alert("Masa nömrəsi tapılmadı!");
        return;
      }

      const res = await axios.get(API_URL);
      const table = res.data.find(
        (t) => String(t.table_num) === String(tableNum)
      );

      if (!table) {
        alert("Masa tapılmadı!");
        return;
      }

      await axios.patch(`${API_URL}${table.id}/`, { status: "waitingWaiter" });

      console.log("📌 Ofisiant çağırıldı:", {
        table_id: table.id,
        table_num: table.table_num,
        status: "waitingWaiter",
      });

      alert("Ofisiant çağırıldı ✅");
    } catch (err) {
      console.error("❌ PATCH error:", err);
      alert("Xəta baş verdi, zəhmət olmasa yenidən yoxla!");
    }
  };

  if (loading) {
    return (
      <section id="homePage1">
        <div className="hero">
          <div className="hero__content">
            <p>Yüklənir...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!restaurantSettings) {
    return (
      <section id="homePage1">
        <div className="hero">
          <div className="hero__content">
            <p>Məlumat yüklənə bilmədi</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="homePage1">
      <div className="frontPage">
        <img src={Left} className="left" alt="" />
        <img src={Right} className="right" alt="" />
      </div>
      
      <div className="hero">
        <div className="hero__content">
          {restaurantSettings.restaurant_name && (
            <h1 className="hero__title">
              <span className="restaurantName">{restaurantSettings.restaurant_name}</span> Restoranına Xoş Gəlmisiniz
            </h1>
          )}

          {restaurantSettings.slogan && (
            <p className="hero__subtitle">
              {restaurantSettings.slogan}
            </p>
          )}

          <div className="hero__actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={handleOrderClick}
            >
              <div className="icon">
                <PiCallBellFill />
              </div>
              <span>{hasOrders ? "Sifarişlərimə bax" : "Özün sifariş et"}</span>
            </button>

            <button
              type="button"
              className="btn btn--secondary"
              onClick={callWaiter}
            >
              <div className="icon">
                <ImUserTie />
              </div>
              <span>Ofisiant ilə əlaqə</span>
            </button>
          </div>
        </div>
      </div>

      <div className="about-contact">
        <div className="about-contact__container">
          <div className="about-contact__grid">
            {restaurantSettings.about_description && (
              <div className="about-contact__left">
                <h2 className="section-title">Haqqımızda</h2>
                <p className="section-text">
                  {restaurantSettings.about_description}
                </p>
              </div>
            )}

            {(restaurantSettings.map_embed_url || restaurantSettings.location_text) && (
              <div className="about-contact__right">
                <h2 className="section-title">Ünvanımız</h2>
                <div className="map-wrapper">
                  {restaurantSettings.map_embed_url ? (
                    <iframe
                      src={restaurantSettings.map_embed_url}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`${restaurantSettings.restaurant_name} Xəritə`}
                    ></iframe>
                  ) : (
                    restaurantSettings.location_text && (
                      <p className="location-text">{restaurantSettings.location_text}</p>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomePage1;
