import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminCategoryPage.scss";
import { FaTrash, FaEdit, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  MdFastfood,
  MdLocalDrink,
  MdCake,
  MdIcecream,
  MdRestaurant,
  MdEmojiFoodBeverage,
  MdDinnerDining,
  MdLunchDining,
  MdBreakfastDining,
  MdLocalPizza,
} from "react-icons/md";
import DeletePopUp from "../../Components/DeletePopUp/DeletePopUp";
import ChaqrLoading from "../../Components/Loading/Loading";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ITEMS_PER_PAGE = 5;

function AdminCategoryPage() {
  const [formData, setFormData] = useState({
    nameAz: "",
    nameEn: "",
    nameRu: "",
    icon: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteType, setDeleteType] = useState("");
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  
  // Filter & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const iconOptions = [
    { value: "fastfood", icon: <MdFastfood />, label: "Fast Food" },
    { value: "drink", icon: <MdLocalDrink />, label: "İçkilər" },
    { value: "cake", icon: <MdCake />, label: "Tort" },
    { value: "icecream", icon: <MdIcecream />, label: "Dondurma" },
    { value: "restaurant", icon: <MdRestaurant />, label: "Restoran" },
    { value: "coffee", icon: <MdEmojiFoodBeverage />, label: "Kofe" },
    { value: "dinner", icon: <MdDinnerDining />, label: "Şam yeməyi" },
    { value: "lunch", icon: <MdLunchDining />, label: "Nahar" },
    { value: "breakfast", icon: <MdBreakfastDining />, label: "Səhər yeməyi" },
    { value: "pizza", icon: <MdLocalPizza />, label: "Pizza" },
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/categories/`);
      setCategories(response.data);
    } catch (error) {
      console.error("Kateqoriyalar yüklənmədi:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getIconComponent = (iconValue) => {
    const option = iconOptions.find(opt => opt.value === iconValue);
    return option ? option.icon : <MdRestaurant />;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nameAz || !formData.icon) {
      alert("Zəhmət olmasa bütün sahələri doldurun!");
      return;
    }

    setLoading(true);

    try {
      const categoryData = {
        name_az: formData.nameAz,
        name_en: formData.nameEn,
        name_ru: formData.nameRu,
        icon: formData.icon,
      };

      if (editingCategory) {
        await axios.put(`${API_BASE_URL}/api/categories/${editingCategory.id}/`, categoryData);
        alert("Kateqoriya yeniləndi!");
      } else {
        await axios.post(`${API_BASE_URL}/api/categories/`, categoryData);
        alert("Kateqoriya əlavə edildi!");
      }

      resetForm();
      fetchCategories();
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
      icon: "",
    });
    setEditingCategory(null);
  };

  const handleFormDeleteClick = () => {
    setDeleteType("form");
    setIsDeletePopupOpen(true);
  };

  const handleCategoryDeleteClick = (category) => {
    setDeleteType("category");
    setCategoryToDelete(category);
    setIsDeletePopupOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteType === "form") {
      resetForm();
    } else if (deleteType === "category" && categoryToDelete) {
      try {
        await axios.delete(`${API_BASE_URL}/api/categories/${categoryToDelete.id}/`);
        fetchCategories();
      } catch (error) {
        console.error("Silinmədi:", error);
        alert("Xəta baş verdi!");
      }
    }
    handleCloseDeletePopup();
  };

  const handleCloseDeletePopup = () => {
    setIsDeletePopupOpen(false);
    setDeleteType("");
    setCategoryToDelete(null);
  };

  const handleEditCategory = (category) => {
    setFormData({
      nameAz: category.name_az || "",
      nameEn: category.name_en || "",
      nameRu: category.name_ru || "",
      icon: category.icon || "",
    });
    setEditingCategory(category);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getDeleteMessage = () => {
    if (deleteType === "form") {
      return "Formdakı bütün məlumatlar silinəcək. Davam etmək istəyirsiniz?";
    } else if (categoryToDelete) {
      return `"${categoryToDelete.name_az}" kateqoriyasını silmək istədiyinizdən əminsiniz? Bu əməliyyat geri qaytarıla bilməz.`;
    }
    return "Bu məlumatı silmək istədiyinizdən əminsiniz?";
  };

  // Filter & Pagination Logic
  const filteredCategories = categories.filter(category => {
    return category.name_az.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading && categories.length === 0) {
    return (
      <section id="adminCategoryPage">
        <ChaqrLoading />
      </section>
    );
  }

  return (
    <section id="adminCategoryPage">
      <div className="page-header">
        <h1>Yeni kateqoriya əlavə et</h1>
        <p>Kateqoriya əlavə edin və ya mövcud kateqoriyaları redaktə edin</p>
      </div>

      <form className="category-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Ad (Azərbaycan) *</label>
            <input
              type="text"
              name="nameAz"
              placeholder="Kateqoriya adı"
              value={formData.nameAz}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Ad (English)</label>
            <input
              type="text"
              name="nameEn"
              placeholder="Category name"
              value={formData.nameEn}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Ad (Rus)</label>
            <input
              type="text"
              name="nameRu"
              placeholder="Название категории"
              value={formData.nameRu}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>İkon seçin *</label>
            <select
              name="icon"
              value={formData.icon}
              onChange={handleInputChange}
              required
            >
              <option value="">İkon seçin</option>
              {iconOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={handleFormDeleteClick}
          >
            <FaTrash /> Formu təmizlə
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Yüklənir..." : editingCategory ? "Yenilə" : "Əlavə et"}
          </button>
        </div>
      </form>

      <div className="categories-section">
        <div className="categories-header">
          <h2>Mövcud kateqoriyalar ({filteredCategories.length})</h2>
          
          <input
            type="text"
            placeholder="Kateqoriya axtar..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="search-input"
          />
        </div>

        {filteredCategories.length === 0 ? (
          <p className="no-categories">Kateqoriya tapılmadı</p>
        ) : (
          <>
            <div className="categories-table">
              <table>
                <thead>
                  <tr>
                    <th>İkon</th>
                    <th>Ad (Azərbaycan)</th>
                    <th>Ad (English)</th>
                    <th>Ad (Rus)</th>
                    <th>Əməliyyatlar</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCategories.map((category) => (
                    <tr key={category.id}>
                      <td>
                        <span className="category-icon">
                          {getIconComponent(category.icon)}
                        </span>
                      </td>
                      <td>{category.name_az}</td>
                      <td>{category.name_en || "-"}</td>
                      <td>{category.name_ru || "-"}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-edit"
                            onClick={() => handleEditCategory(category)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleCategoryDeleteClick(category)}
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

      <DeletePopUp
        isOpen={isDeletePopupOpen}
        onClose={handleCloseDeletePopup}
        onConfirm={handleConfirmDelete}
        title={deleteType === "form" ? "Form məlumatları silinsin?" : "Kateqoriya silinsin?"}
        message={getDeleteMessage()}
        confirmText="Sil"
        cancelText="Geri"
      />
    </section>
  );
}

export default AdminCategoryPage;
