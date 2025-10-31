import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminProductPage.scss";
import { FaTrash, FaEdit, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdImage } from "react-icons/md";
import DeletePopUp from "../../Components/DeletePopUp/DeletePopUp";
import ChaqrLoading from "../../Components/Loading/Loading";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ITEMS_PER_PAGE = 5;

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
    visible: true,
    image: null,
  });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteType, setDeleteType] = useState("");
  const [productToDelete, setProductToDelete] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Filter & Pagination
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products/`);
      setProducts(response.data);
    } catch (error) {
      console.error("Məhsullar yüklənmədi:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/categories/`);
      setCategories(response.data);
    } catch (error) {
      console.error("Kateqoriyalar yüklənmədi:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === "file") {
      const file = files[0];
      setFormData({ ...formData, image: file });
      
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nameAz || !formData.category || !formData.price) {
      alert("Zəhmət olmasa bütün vacib sahələri doldurun!");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name_az", formData.nameAz);
      formDataToSend.append("name_en", formData.nameEn);
      formDataToSend.append("name_ru", formData.nameRu);
      formDataToSend.append("description_az", formData.descriptionAz);
      formDataToSend.append("description_en", formData.descriptionEn);
      formDataToSend.append("description_ru", formData.descriptionRu);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("cost", formData.price);
      formDataToSend.append("time", formData.preparationTime || 0);
      formDataToSend.append("halal", formData.halal);
      formDataToSend.append("vegan", formData.vegan);
      formDataToSend.append("is_visible", formData.visible);
      
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      if (editingProduct) {
        await axios.put(`${API_BASE_URL}/api/products/${editingProduct.id}/`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("Məhsul yeniləndi!");
      } else {
        await axios.post(`${API_BASE_URL}/api/products/`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("Məhsul əlavə edildi!");
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Xəta:", error);
      alert("Xəta baş verdi!");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
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
      visible: true,
      image: null,
    });
    setEditingProduct(null);
    setImagePreview(null);
  };

  const handleFormDeleteClick = () => {
    setDeleteType("form");
    setIsDeletePopupOpen(true);
  };

  const handleProductDeleteClick = (product) => {
    setDeleteType("product");
    setProductToDelete(product);
    setIsDeletePopupOpen(true);
  };

  const handleCloseDeletePopup = () => {
    setIsDeletePopupOpen(false);
    setDeleteType("");
    setProductToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (deleteType === "form") {
      resetForm();
    } else if (deleteType === "product" && productToDelete) {
      try {
        await axios.delete(`${API_BASE_URL}/api/products/${productToDelete.id}/`);
        fetchProducts();
      } catch (error) {
        console.error("Silinmədi:", error);
        alert("Xəta baş verdi!");
      }
    }
    handleCloseDeletePopup();
  };

  const handleEditProduct = (product) => {
    setFormData({
      nameAz: product.name_az || "",
      nameEn: product.name_en || "",
      nameRu: product.name_ru || "",
      descriptionAz: product.description_az || "",
      descriptionEn: product.description_en || "",
      descriptionRu: product.description_ru || "",
      category: product.category || "",
      price: product.cost || "",
      preparationTime: product.time || "",
      halal: product.halal || false,
      vegan: product.vegan || false,
      visible: product.is_visible !== false,
      image: null,
    });
    setEditingProduct(product);
    setImagePreview(product.image || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name_az : "N/A";
  };

  // Filter & Pagination Logic
  const filteredProducts = products.filter(product => {
    const matchesCategory = filterCategory === "" || product.category === parseInt(filterCategory);
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "active" && product.is_visible) ||
      (filterStatus === "inactive" && !product.is_visible);
    const matchesSearch = product.name_az.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading && products.length === 0) {
    return (
      <section id="adminProductPage">
        <ChaqrLoading />
      </section>
    );
  }

  return (
    <section id="adminProductPage">
      <div className="container">
        <header className="page-header">
          <h1>Məhsul əlavə et</h1>
          <p>Yeni məhsul əlavə edin və ya mövcud məhsulları redaktə edin</p>
        </header>

        <form className="product-form" onSubmit={handleSubmit}>
          {/* Form fields - eyni */}
          <div className="form-row">
            <div className="form-group">
              <label>Məhsul adı (Azərbaycan) *</label>
              <input
                type="text"
                name="nameAz"
                value={formData.nameAz}
                onChange={handleChange}
                placeholder="Məsələn: Yarpaq dolması"
                required
              />
            </div>

            <div className="form-group">
              <label>Məhsul adı (İngilis)</label>
              <input
                type="text"
                name="nameEn"
                value={formData.nameEn}
                onChange={handleChange}
                placeholder="Məsələn: Grape Leaves Dolma"
              />
            </div>

            <div className="form-group">
              <label>Məhsul adı (Rus)</label>
              <input
                type="text"
                name="nameRu"
                value={formData.nameRu}
                onChange={handleChange}
                placeholder="Məsələn: Долма"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Təsvir (Azərbaycan)</label>
              <textarea
                name="descriptionAz"
                value={formData.descriptionAz}
                onChange={handleChange}
                placeholder="Məhsul haqqında qısa məlumat"
                rows="3"
              ></textarea>
            </div>

            <div className="form-group">
              <label>Təsvir (İngilis)</label>
              <textarea
                name="descriptionEn"
                value={formData.descriptionEn}
                onChange={handleChange}
                placeholder="Product description"
                rows="3"
              ></textarea>
            </div>

            <div className="form-group">
              <label>Təsvir (Rus)</label>
              <textarea
                name="descriptionRu"
                value={formData.descriptionRu}
                onChange={handleChange}
                placeholder="Описание продукта"
                rows="3"
              ></textarea>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Kateqoriya *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Kateqoriya seçin</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name_az}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Qiymət (₼) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="12.50"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Hazırlanma vaxtı (dəqiqə)</label>
              <input
                type="number"
                name="preparationTime"
                value={formData.preparationTime}
                onChange={handleChange}
                placeholder="15"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Məhsul şəkli</label>
              <div className="image-upload">
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  accept="image/*"
                  id="imageUpload"
                />
                <label htmlFor="imageUpload" className="upload-label">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="image-preview" />
                  ) : (
                    <>
                      <MdImage />
                      <span>Şəkil seçin</span>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="halal"
                checked={formData.halal}
                onChange={handleChange}
              />
              <span>Halal</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="vegan"
                checked={formData.vegan}
                onChange={handleChange}
              />
              <span>Vegan</span>
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="visible"
                checked={formData.visible}
                onChange={handleChange}
              />
              <span>Görünən</span>
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-delete" onClick={handleFormDeleteClick}>
              <FaTrash /> Formu təmizlə
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Yüklənir..." : editingProduct ? "Yenilə" : "Əlavə et"}
            </button>
          </div>
        </form>

        <div className="products-section">
          <div className="products-header">
            <h2>Mövcud məhsullar ({filteredProducts.length})</h2>
            
            <div className="filters">
              <input
                type="text"
                placeholder="Məhsul axtar..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="search-input"
              />

              <select
                value={filterCategory}
                onChange={(e) => {
                  setFilterCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="filter-select"
              >
                <option value="">Bütün kateqoriyalar</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name_az}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="filter-select"
              >
                <option value="all">Bütün statuslar</option>
                <option value="active">Aktiv</option>
                <option value="inactive">Deaktiv</option>
              </select>
            </div>
          </div>
          
          {filteredProducts.length === 0 ? (
            <p className="no-products">Məhsul tapılmadı</p>
          ) : (
            <>
              <div className="products-table-wrapper">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Şəkil</th>
                      <th>Kateqoriya</th>
                      <th>Ad</th>
                      <th>Qiymət</th>
                      <th>Vaxt</th>
                      <th>Status</th>
                      <th>Əməliyyatlar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div className="product-image">
                            {product.image ? (
                              <img src={product.image} alt={product.name_az} />
                            ) : (
                              <MdImage />
                            )}
                          </div>
                        </td>
                        <td>{getCategoryName(product.category)}</td>
                        <td>{product.name_az}</td>
                        <td>{product.cost} ₼</td>
                        <td>{product.time} dəq</td>
                        <td>
                          <span className={`status-badge ${product.is_visible ? 'active' : 'inactive'}`}>
                            {product.is_visible ? 'Aktiv' : 'Deaktiv'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-edit"
                              onClick={() => handleEditProduct(product)}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="btn-delete-item"
                              onClick={() => handleProductDeleteClick(product)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <FaChevronLeft />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    className="pagination-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <DeletePopUp
        isOpen={isDeletePopupOpen}
        onClose={handleCloseDeletePopup}
        onConfirm={handleConfirmDelete}
        title={deleteType === "form" ? "Formu təmizləmək istəyirsiniz?" : "Məhsulu silmək istəyirsiniz?"}
        message={deleteType === "form" 
          ? "Bütün daxil edilmiş məlumatlar silinəcək." 
          : `"${productToDelete?.name_az}" məhsulu silinəcək.`}
      />
    </section>
  );
}

export default AdminProductPage;
