import React, { useEffect, useState } from "react";
import "./BasketPage1.scss";
import { FiShoppingBag } from "react-icons/fi";
import Left from "../../Image/BasketLeft.png";
import Right from "../../Image/BasketRight.png";
import { MdTableBar } from "react-icons/md";
import { IoCloseCircleOutline } from "react-icons/io5";
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoIosArrowRoundForward,
} from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { RiDeleteBin5Line } from "react-icons/ri";
import axios from "axios";
import { Link } from "react-router-dom";

function BasketPage1() {
  const [isEmpty, setIsEmpty] = useState(false);
  const [basketProducts, setBasketProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [orderNote, setOrderNote] = useState("");

  useEffect(() => {
    const myBasket = JSON.parse(localStorage.getItem("my_basket")) || [];

    axios
      .get("https://efficiently-leads-table-august.trycloudflare.com/api/products/")
      .then((res) => {
        setAllProducts(res.data);

        const basketData = res.data.filter((p) => myBasket.includes(p.id));
        setBasketProducts(basketData);

        setIsEmpty(basketData.length === 0);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleConfirm = async () => {
    try {
      const tableNum = localStorage.getItem("table_num");
      const isExtraOrder = localStorage.getItem("extraOrder") === "true";
      const existingOrderId = localStorage.getItem("order_id");

      if (!tableNum) {
        alert("Masa nömrəsi tapılmadı!");
        return;
      }

      // 🔹 1. Cədvəli tap
      const tablesRes = await axios.get("https://efficiently-leads-table-august.trycloudflare.com/api/tables/");
      const tables = Array.isArray(tablesRes.data) ? tablesRes.data : [];
      const foundTable = tables.find(
        (t) => Number(t.table_num) === Number(tableNum)
      );

      if (!foundTable) {
        alert("Masa tapılmadı!");
        return;
      }

      // 🔹 2. Masanın statusunu dəyiş (YENİ sifariş üçün)
      if (!isExtraOrder) {
        await axios.patch(
          `https://efficiently-leads-table-august.trycloudflare.com/api/tables/${foundTable.id}/`,
          { status: "sendOrder" }
        );
      }

      const currentTime = new Date().toISOString();
      let response;

      if (isExtraOrder && existingOrderId) {
        // ✅ ƏLAVƏ SİFARİŞ → Mövcud sifarişi yenilə

        // 🔹 Mövcud sifarişi əldə et
        const existingOrderRes = await axios.get(
          `https://efficiently-leads-table-august.trycloudflare.com/api/baskets/${existingOrderId}/`
        );
        const existingOrder = existingOrderRes.data;

        // 🔹 Köhnə extra_items və items
        const existingExtraItems = existingOrder.extra_items || [];
        const existingItems = existingOrder.items || [];

        // 🔹 Yeni extra_items yarat - mövcud extra_items üzərinə əlavə et
        const newExtraItems = [
          ...existingExtraItems,
          ...basketProducts.map((p, index) => ({
            id: existingExtraItems.length + index + 1,
            productID: p.id,
            count: p.quantity || 1,
            isOrderAvailable: true,
          })),
        ];

        // 🔹 Bütün məhsulların ümumi dəyərlərini hesabla (köhnə + yeni)
        const allItemsTotal = calculateAllItemsTotal(
          existingItems,
          newExtraItems
        );
        const allItemsTime = calculateAllItemsTime(
          existingItems,
          newExtraItems
        );

        // 🔹 Payload formalaşdır
        const payload = {
          table_id: foundTable.id,
          note:
            orderNote.trim() ||
            existingOrder.note ||
            "Xüsusi not qeyd edilməyib.",
          service_cost: (allItemsTotal * 0.1).toFixed(2),
          total_cost: (allItemsTotal * 1.1).toFixed(2),
          total_time: allItemsTime,
          status: "sendOrder",
          food_status: existingOrder.food_status || [
            { time: currentTime, sendOrder: true },
            { time: "", sendKitchen: false },
            { time: "", makeFood: false },
            { time: "", deliveredFood: false },
          ],
          extra_items: newExtraItems,
          items: existingItems, // Köhnə items dəyişməz qalır
        };

        response = await axios.patch(
          `https://efficiently-leads-table-august.trycloudflare.com/api/baskets/${existingOrderId}/`,
          payload,
          { headers: { "Content-Type": "application/json" } }
        );
        console.log("🔁 Mövcud sifariş yeniləndi:", response.data);

        // Əlavə sifariş uğurla tamamlandı mesajı
        alert("Əlavə sifariş uğurla göndərildi!");
      } else {
        // 🆕 YENİ sifariş
        const payload = {
          table_id: foundTable.id,
          note: `${orderNote.trim() || "Xüsusi not qeyd edilməyib."}`,
          service_cost: calculateServiceFee(),
          total_cost: calculateGrandTotal(),
          total_time: calculateTotalTime(),
          status: "sendOrder",
          food_status: [
            { time: currentTime, sendOrder: true },
            { time: "", sendKitchen: false },
            { time: "", makeFood: false },
            { time: "", deliveredFood: false },
          ],
          items: basketProducts.map((p) => ({
            product: p.id,
            count: p.quantity || 1,
            name_az: p.name_az,
            name_en: p.name_en,
            name_ru: p.name_ru,
            description_az: p.description_az,
            description_en: p.description_en,
            description_ru: p.description_ru,
            cost: p.cost.toString(),
            time: p.preparation_time || 10,
          })),
          extra_items: [], // Yeni sifarişdə extra_items boş
        };

        response = await axios.post(
          "https://efficiently-leads-table-august.trycloudflare.com/api/baskets/",
          payload,
          { headers: { "Content-Type": "application/json" } }
        );
        console.log("✅ Yeni sifariş yaradıldı:", response.data);

        // Yeni id-ni yadda saxla
        localStorage.setItem("extraOrder", "true");
        localStorage.setItem("order_id", response.data.id);
      }

      setShowPopup(true);
      localStorage.removeItem("my_basket");
      // localStorage.removeItem("extraOrder"); // Extra order flag-i təmizlə
      setBasketProducts([]);
      setIsEmpty(true);
      setOrderNote("");
    } catch (err) {
      console.error("❌ Sifariş xətası:", err.response?.data || err);
      alert("Sifariş göndərilmədi. Yenidən cəhd edin.");
    }
  };

  // 🔹 Bütün məhsulların (items + extra_items) ümumi qiymətini hesabla
  const calculateAllItemsTotal = (existingItems, extraItems) => {
    let total = 0;

    // Köhnə items-ların ümumi qiyməti
    if (existingItems && existingItems.length > 0) {
      total += existingItems.reduce((sum, item) => {
        return sum + (parseFloat(item.cost) || 0) * (item.count || 1);
      }, 0);
    }

    // Yeni extra_items-ların ümumi qiyməti
    if (extraItems && extraItems.length > 0) {
      extraItems.forEach((extraItem) => {
        const product = allProducts.find((p) => p.id === extraItem.productID);
        if (product && extraItem.isOrderAvailable) {
          total += (parseFloat(product.cost) || 0) * (extraItem.count || 1);
        }
      });
    }

    return parseFloat(total.toFixed(2));
  };

  // 🔹 Bütün məhsulların hazırlanma vaxtını hesabla
  const calculateAllItemsTime = (existingItems, extraItems) => {
    const productGroups = {};

    // Köhnə items-ları əlavə et
    if (existingItems && existingItems.length > 0) {
      existingItems.forEach((item) => {
        if (!productGroups[item.product]) {
          productGroups[item.product] = {
            preparation_time: item.time || 10,
            totalQuantity: 0,
          };
        }
        productGroups[item.product].totalQuantity += item.count || 1;
      });
    }

    // Yeni extra_items-ları əlavə et
    if (extraItems && extraItems.length > 0) {
      extraItems.forEach((extraItem) => {
        if (extraItem.isOrderAvailable) {
          const product = allProducts.find((p) => p.id === extraItem.productID);
          if (product) {
            if (!productGroups[product.id]) {
              productGroups[product.id] = {
                preparation_time: product.time || 10,
                totalQuantity: 0,
              };
            }
            productGroups[product.id].totalQuantity += extraItem.count || 1;
          }
        }
      });
    }

    let totalTime = 0;
    Object.values(productGroups).forEach((group) => {
      const baseTime = group.preparation_time || 10;

      if (group.totalQuantity === 1) {
        totalTime += baseTime;
      } else {
        const averageTime = baseTime * (1 + (group.totalQuantity - 1) * 0.3);
        totalTime += averageTime;
      }
    });

    return Math.round(totalTime);
  };

  const increaseQuantity = (productId) => {
    setBasketProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId && (product.quantity || 1) < 50
          ? { ...product, quantity: (product.quantity || 1) + 1 }
          : product
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setBasketProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId && (product.quantity || 1) > 1
          ? { ...product, quantity: product.quantity - 1 }
          : product
      )
    );
  };

  const removeFromBasket = (productId) => {
    const updatedBasket = basketProducts.filter(
      (product) => product.id !== productId
    );
    setBasketProducts(updatedBasket);

    const myBasket = JSON.parse(localStorage.getItem("my_basket")) || [];
    const updatedLocalBasket = myBasket.filter((id) => id !== productId);
    localStorage.setItem("my_basket", JSON.stringify(updatedLocalBasket));

    setIsEmpty(updatedBasket.length === 0);
  };

  const masa = localStorage.getItem("table_num");

  const addToBasket = (product) => {
    const myBasket = JSON.parse(localStorage.getItem("my_basket")) || [];

    if (!myBasket.includes(product.id)) {
      const updatedBasket = [...myBasket, product.id];
      localStorage.setItem("my_basket", JSON.stringify(updatedBasket));

      setBasketProducts((prev) => [...prev, { ...product, quantity: 1 }]);
      setIsEmpty(false);
    }
  };

  const calculateTotal = () => {
    return basketProducts
      .reduce((total, product) => {
        return total + product.cost * (product.quantity || 1);
      }, 0)
      .toFixed(2);
  };

  const calculateTotalTime = () => {
    const productGroups = {};

    basketProducts.forEach((product) => {
      if (!productGroups[product.id]) {
        productGroups[product.id] = {
          ...product,
          totalQuantity: 0,
        };
      }
      productGroups[product.id].totalQuantity += product.quantity || 1;
    });

    let totalTime = 0;
    Object.values(productGroups).forEach((group) => {
      const baseTime = group.time || 10;

      if (group.totalQuantity === 1) {
        totalTime += baseTime;
      } else {
        const averageTime = baseTime * (1 + (group.totalQuantity - 1) * 0.3);
        totalTime += averageTime;
      }
    });

    return Math.round(totalTime);
  };

  const calculateServiceFee = () => {
    const total = parseFloat(calculateTotal());
    return (total * 0.1).toFixed(2);
  };

  const calculateGrandTotal = () => {
    const total = parseFloat(calculateTotal());
    const serviceFee = parseFloat(calculateServiceFee());
    return (total + serviceFee).toFixed(2);
  };

  const isMaxQuantity = (quantity) => {
    return (quantity || 1) >= 50;
  };

  const otherProducts = allProducts.filter(
    (p) => !basketProducts.find((bp) => bp.id === p.id)
  );

  return (
    <div className="basket-page">
      <div className="frontPage">
        <img src={Left} className="left" alt="left-decor" />
        <img src={Right} className="right" alt="right-decor" />
      </div>

      <div className="basketPage">
        <h1 className="title">Səbətim</h1>

        <div className="table-info">
          <div className="icon">
            <MdTableBar />
          </div>
          <span className="label">Masa:</span>
          <span className="value">{masa ? masa : "-"}</span>
        </div>

        {isEmpty ? (
          <div className="empty-basket">
            <FiShoppingBag className="empty-icon" />
            <h2>Səbətiniz boşdur</h2>
            <p>Sifariş vermək üçün məhsul əlavə edin</p>
          </div>
        ) : (
          <div className="basket-content">
            <div className="product">
              {basketProducts.map((item) => (
                <div className="product-card" key={item.id}>
                  <div className="left">
                    <div className="product-image">
                      <img src={item.image} alt={item.name_az} />
                    </div>
                    <div className="text">
                      <h3>{item.name_az}</h3>
                      <p>{item.description_az}</p>
                    </div>
                  </div>
                  <div className="right">
                    <div className="product-controls">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        disabled={(item.quantity || 1) <= 1}
                        className={(item.quantity || 1) <= 1 ? "disabled" : ""}
                      >
                        -
                      </button>
                      <span>{item.quantity || 1}</span>
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        disabled={isMaxQuantity(item.quantity)}
                        className={
                          isMaxQuantity(item.quantity) ? "disabled" : ""
                        }
                      >
                        +
                      </button>
                    </div>
                    <span className="price">
                      {(item.cost * (item.quantity || 1)).toFixed(2)} AZN
                    </span>
                    <div
                      className="closeBtn"
                      onClick={() => removeFromBasket(item.id)}
                    >
                      <IoCloseCircleOutline />
                    </div>
                    <div
                      className="closeResp"
                      onClick={() => removeFromBasket(item.id)}
                    >
                      <span>Sil</span>
                      <RiDeleteBin5Line />
                    </div>
                  </div>
                </div>
              ))}

              <div className="total-section">
                <form action="">
                  <div className="box1">
                    <label>Məhsul qiyməti</label>
                    <p>{calculateTotal()}</p>
                    <span>₼</span>
                  </div>
                  <div className="box1">
                    <label>Servis haqqı</label>
                    <p>{calculateServiceFee()}</p>
                    <span>₼</span>
                  </div>
                  <div className="box1">
                    <label>Ümumi hesab</label>
                    <p>{calculateGrandTotal()}</p>
                    <span>₼</span>
                  </div>
                  <div className="box1">
                    <label>Hazırlanma müddəti</label>
                    <p>{calculateTotalTime()}</p>
                    <span>dəqiqə</span>
                  </div>
                </form>
              </div>

              <input
                placeholder="Mətbəx üçün qeyd"
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
              />

              {/* Əlavə sifariş olduğunu göstərən info */}
              {localStorage.getItem("extraOrder") === "true" && (
                <div className="extra-order-info">
                  <p>
                    📝 <strong>Əlavə sifariş rejimi:</strong> Mövcud
                    sifarişinizə yeni məhsullar əlavə olunacaq.
                  </p>
                </div>
              )}

              <button className="confirm-btn" onClick={handleConfirm}>
                <div className="buttonnn">
                  {localStorage.getItem("extraOrder") === "true"
                    ? "Əlavə sifarişi təsdiq et"
                    : "Təsdiq et"}
                </div>
              </button>
            </div>
            {showPopup && (
              <div className="popup-overlayyyy">
                <div className="popup-box">
                  <div className="popup-icon">✔</div>
                  <h2>
                    {localStorage.getItem("extraOrder") === "true"
                      ? "Əlavə sifarişiniz uğurla tamamlandı!"
                      : "Sifarişiniz uğurla tamamlandı!"}
                  </h2>
                  <p>
                    Sifarişinizi <b>"Sifariş"</b> bölməsində izləyə bilərsiniz.
                  </p>
                  <Link to={"/myOrder"}>
                    <button className="popup-btn">Sifarişi izləyin</button>
                  </Link>
                </div>
              </div>
            )}

            <h2 className="other-products">Digər məhsullar</h2>
            <div className="other-list">
              <Swiper
                slidesPerView={3}
                spaceBetween={30}
                freeMode={true}
                loop={true}
                pagination={{ clickable: true }}
                navigation={{
                  prevEl: ".custom-prev",
                  nextEl: ".custom-next",
                }}
                modules={[FreeMode, Pagination, Navigation]}
                breakpoints={{
                  320: { slidesPerView: 1 },
                  576: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1200: { slidesPerView: 4 },
                }}
                className="mySwiper"
              >
                <div className="custom-nav">
                  <button className="custom-prev">
                    <IoIosArrowBack />
                  </button>
                  <button className="custom-next">
                    <IoIosArrowForward />
                  </button>
                </div>

                {otherProducts.map((item) => (
                  <SwiperSlide key={item.id}>
                    <div className="product-card1 ">
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
                        onClick={() => addToBasket(item)}
                      >
                        Səbətə əlavə et
                        <div className="icon">
                          <IoIosArrowRoundForward />
                        </div>
                      </button>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BasketPage1;
