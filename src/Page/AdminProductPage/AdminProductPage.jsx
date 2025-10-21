import React, { useState } from "react";
import "./AdminProductPage.scss";
import { FaTrash, FaEdit } from "react-icons/fa";
import { MdImage } from "react-icons/md";
import DeletePopUp from "../../Components/DeletePopUp/DeletePopUp";

function AdminProductPage() {
  const [formData, setFormData] = useState({
    nameAz: "",
    nameEn: "",
    nameRu: "",
    descriptionAz: "",
    descriptionEn: "",
    descriptionRu: "",
    category: "",
    price: "",
    preparationTime: "",
    halal: false,
    vegan: false,
    visible: false,
    image: null,
  });

  // Delete Popup state
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteType, setDeleteType] = useState(""); // "form" və ya "product"
  const [productToDelete, setProductToDelete] = useState(null);

  const [products, setProducts] = useState([
    {
      id: 1,
      image: "https://via.placeholder.com/60",
      category: "İsti yeməklər",
      name: "Yarpaq dolması",
      price: 12,
      preparationTime: 5,
      description:
        "də və aşır.ı əmək ilə məhsullarına, havi verilərinin və şəklik yolu lə.oğunu",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/60",
      category: "İsti yeməklər",
      name: "Yarpaq dolması",
      price: 12,
      preparationTime: 5,
      description:
        "də və aşır.ı əmək ilə məhsullarına, havi verilərinin və şəklik yolu lə.oğunu",
    },
    {
      id: 3,
      image: "https://via.placeholder.com/60",
      category: "İsti yeməklər",
      name: "Yarpaq dolması",
      price: 12,
      preparationTime: 5,
      description:
        "də və aşır.ı əmək ilə məhsullarına, havi verilərinin və şəklik yolu lə.oğunu",
    },
    {
      id: 4,
      image: "https://via.placeholder.com/60",
      category: "İsti yeməklər",
      name: "Yarpaq dolması",
      price: 12,
      preparationTime: 5,
      description:
        "də və aşır.ı əmək ilə məhsullarına, havi verilərinin və şəklik yolu lə.oğunu",
    },
  ]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
    }
  };

  // ✅ Form "Sil" düyməsinə basıldıqda POPUP AÇILIR
  const handleFormDeleteClick = () => {
    setDeleteType("form");
    setIsDeletePopupOpen(true);
  };

  // ✅ Cədvəldəki ZİBİL QABI ikonuna basıldıqda POPUP AÇILIR
  const handleProductDeleteClick = (product) => {
    setDeleteType("product");
    setProductToDelete(product);
    setIsDeletePopupOpen(true);
  };

  // Silinmə təsdiqlənəndə
  const handleConfirmDelete = () => {
    if (deleteType === "form") {
      // Formu təmizlə
      setFormData({
        nameAz: "",
        nameEn: "",
        nameRu: "",
        descriptionAz: "",
        descriptionEn: "",
        descriptionRu: "",
        category: "",
        price: "",
        preparationTime: "",
        halal: false,
        vegan: false,
        visible: false,
        image: null,
      });
      console.log("✅ Form məlumatları təmizləndi");
    } else if (deleteType === "product" && productToDelete) {
      // Məhsulu sil
      setProducts(products.filter((prod) => prod.id !== productToDelete.id));
      console.log("✅ Məhsul silindi:", productToDelete);
      
      // Buraya API çağırışı əlavə edə bilərsiniz
      // await deleteProductAPI(productToDelete.id);
    }
  };

  // Popup bağlananda
  const handleCloseDeletePopup = () => {
    setIsDeletePopupOpen(false);
    setDeleteType("");
    setProductToDelete(null);
  };

  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form göndərildi:", formData);
    // Buraya API çağırışı əlavə edin
    // await createProductAPI(formData);
  };

  // Düzəliş et düyməsi
  const handleEditProduct = (product) => {
    setFormData({
      nameAz: product.name,
      nameEn: product.name,
      nameRu: product.name,
      descriptionAz: product.description,
      descriptionEn: product.description,
      descriptionRu: product.description,
      category: product.category,
      price: product.price,
      preparationTime: product.preparationTime,
      halal: false,
      vegan: false,
      visible: false,
      image: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete mesajını dinamik olaraq yarat
  const getDeleteMessage = () => {
    if (deleteType === "form") {
      return "Formdakı bütün məlumatlar silinəcək. Davam etmək istəyirsiniz?";
    } else if (productToDelete) {
      return `"${productToDelete.name}" məhsulunu silmək istədiyinizdən əminsiniz? Bu əməliyyat geri qaytarıla bilməz.`;
    }
    return "Bu məlumatı silmək istədiyinizdən əminsiniz?";
  };

  return (
    <section id="adminProductPage">
      <div className="page-header">
        <h1>Yeni məhsul əlavə et</h1>
      </div>

      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Ad (Azərbaycan)</label>
            <input
              type="text"
              name="nameAz"
              placeholder="Məhsul adı"
              value={formData.nameAz}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Ad (English)</label>
            <input
              type="text"
              name="nameEn"
              placeholder="Product name"
              value={formData.nameEn}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Ad (Rus)</label>
            <input
              type="text"
              name="nameRu"
              placeholder="Название продукта"
              value={formData.nameRu}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Açıqlama (Azərbaycan)</label>
            <textarea
              name="descriptionAz"
              placeholder="Açıqlama"
              value={formData.descriptionAz}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Açıqlama (English)</label>
            <textarea
              name="descriptionEn"
              placeholder="Description"
              value={formData.descriptionEn}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Açıqlama (Rus)</label>
            <textarea
              name="descriptionRu"
              placeholder="Разъяснение мероприятия"
              value={formData.descriptionRu}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Kateqoriya</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            >
              <option value="">Seçin</option>
              <option value="hot-dishes">İsti yeməklər</option>
              <option value="cold-dishes">Soyuq yeməklər</option>
              <option value="desserts">Desertlər</option>
            </select>
          </div>

          <div className="form-group">
            <label>Qiymət</label>
            <input
              type="number"
              name="price"
              placeholder="Qiymət"
              value={formData.price}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Hazırlama müddəti</label>
            <input
              type="number"
              name="preparationTime"
              placeholder="Hazırlama müddəti"
              value={formData.preparationTime}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="form-row checkbox-row">
          <div className="form-group">
            <label>Endirim</label>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="halal"
                  checked={formData.halal}
                  onChange={handleInputChange}
                />
                <span>Halal</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="vegan"
                  checked={formData.vegan}
                  onChange={handleInputChange}
                />
                <span>Vegan</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="visible"
                  checked={formData.visible}
                  onChange={handleInputChange}
                />
                <span>Görünsün</span>
              </label>
            </div>
          </div>
        </div>

        <div className="form-row image-upload-row">
          <div className="image-upload-box">
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={handleImageUpload}
              hidden
            />
            <label htmlFor="imageUpload" className="upload-label">
              <MdImage className="upload-icon" />
              <p>Şəkil əlavə et</p>
              <span>PNG, JPEG, JPG</span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          {/* ✅ Bu düyməyə toxunduqda POPUP AÇILIR */}
          <button
            type="button"
            className="btn-cancel"
            onClick={handleFormDeleteClick}
          >
            Sil
          </button>
          <button type="submit" className="btn-submit">
            Yaddaş saxla
          </button>
        </div>
      </form>

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>Məhsulun şəkli</th>
              <th>Kateqoriya</th>
              <th>Məhsulun adı</th>
              <th>Ümumi qiymət</th>
              <th>Endirim qiymət</th>
              <th>Açıqlama</th>
              <th>Düzəliş et</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                </td>
                <td>{product.category}</td>
                <td>{product.name}</td>
                <td>{product.price} ₼</td>
                <td>{product.preparationTime} ₼</td>
                <td className="description-cell">{product.description}</td>
                <td>
                  <div className="action-buttons">
                    {/* ✅ Bu ZİBİL QABI ikonuna toxunduqda POPUP AÇILIR */}
                    <button
                      className="btn-delete"
                      onClick={() => handleProductDeleteClick(product)}
                    >
                      <FaTrash />
                    </button>
                    <button
                      className="btn-edit"
                      onClick={() => handleEditProduct(product)}
                    >
                      <FaEdit />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Popup */}
      <DeletePopUp
        isOpen={isDeletePopupOpen}
        onClose={handleCloseDeletePopup}
        onConfirm={handleConfirmDelete}
        title={deleteType === "form" ? "Form məlumatları silinsin?" : "Məhsul silinsin?"}
        message={getDeleteMessage()}
        confirmText="Sil"
        cancelText="Geri"
      />
    </section>
  );
}

export default AdminProductPage;
