import React, { useState } from "react";
import "./AdminCategoryPage.scss";
import { FaTrash, FaEdit } from "react-icons/fa";
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

function AdminCategoryPage() {
  const [formData, setFormData] = useState({
    nameAz: "",
    nameEn: "",
    nameRu: "",
    icon: "",
  });

  const [isIconMenuOpen, setIsIconMenuOpen] = useState(false);
  
  // Delete Popup state
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteType, setDeleteType] = useState(""); // "form" və ya "category"
  const [categoryToDelete, setCategoryToDelete] = useState(null);

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

  const [categories, setCategories] = useState([
    {
      id: 1,
      nameAz: "İsti yeməklər",
      nameEn: "Hot dishes",
      nameRu: "Горячие блюда",
      icon: <MdFastfood />,
    },
    {
      id: 2,
      nameAz: "Soyuq yeməklər",
      nameEn: "Cold dishes",
      nameRu: "Холодные блюда",
      icon: <MdRestaurant />,
    },
    {
      id: 3,
      nameAz: "İçkilər",
      nameEn: "Drinks",
      nameRu: "Напитки",
      icon: <MdLocalDrink />,
    },
    {
      id: 4,
      nameAz: "Desertlər",
      nameEn: "Desserts",
      nameRu: "Десерты",
      icon: <MdCake />,
    },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleIconSelect = (iconValue) => {
    setFormData({ ...formData, icon: iconValue });
    setIsIconMenuOpen(false);
  };

  const getSelectedIcon = () => {
    const selected = iconOptions.find((opt) => opt.value === formData.icon);
    return selected ? selected.icon : null;
  };

  // ✅ Form "Sil" düyməsinə basıldıqda POPUP AÇILIR
  const handleFormDeleteClick = () => {
    setDeleteType("form");
    setIsDeletePopupOpen(true);
  };

  // ✅ Cədvəldəki ZİBİL QABI ikonuna basıldıqda POPUP AÇILIR
  const handleCategoryDeleteClick = (category) => {
    setDeleteType("category");
    setCategoryToDelete(category);
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
        icon: "",
      });
      console.log("✅ Form məlumatları təmizləndi");
    } else if (deleteType === "category" && categoryToDelete) {
      // Kateqoriyanı sil
      setCategories(categories.filter((cat) => cat.id !== categoryToDelete.id));
      console.log("✅ Kateqoriya silindi:", categoryToDelete);
      
      // Buraya API çağırışı əlavə edə bilərsiniz
      // await deleteCategoryAPI(categoryToDelete.id);
    }
  };

  // Popup bağlananda
  const handleCloseDeletePopup = () => {
    setIsDeletePopupOpen(false);
    setDeleteType("");
    setCategoryToDelete(null);
  };

  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form göndərildi:", formData);
    // Buraya API çağırışı əlavə edin
    // await createCategoryAPI(formData);
  };

  // Düzəliş et düyməsi
  const handleEditCategory = (category) => {
    setFormData({
      nameAz: category.nameAz,
      nameEn: category.nameEn,
      nameRu: category.nameRu,
      icon: "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete mesajını dinamik olaraq yarat
  const getDeleteMessage = () => {
    if (deleteType === "form") {
      return "Formdakı bütün məlumatlar silinəcək. Davam etmək istəyirsiniz?";
    } else if (categoryToDelete) {
      return `"${categoryToDelete.nameAz}" kateqoriyasını silmək istədiyinizdən əminsiniz? Bu əməliyyat geri qaytarıla bilməz.`;
    }
    return "Bu məlumatı silmək istədiyinizdən əminsiniz?";
  };

  return (
    <section id="adminCategoryPage">
      <div className="page-header">
        <h1>Yeni kateqoriya əlavə et</h1>
      </div>

      <form className="category-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Ad (Azərbaycan)</label>
            <input
              type="text"
              name="nameAz"
              placeholder="Kateqoriya adı"
              value={formData.nameAz}
              onChange={handleInputChange}
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
            <label>İkon seçin</label>
            <select
              name="icon"
              value={formData.icon}
              onChange={handleInputChange}
            >
              <option value="">İkon seçin</option>
              <option value="fastfood">Fast Food</option>
              <option value="drink">İçkilər</option>
              <option value="cake">Tort</option>
              <option value="icecream">Dondurma</option>
              <option value="restaurant">Restoran</option>
              <option value="coffee">Kofe</option>
              <option value="dinner">Şam yeməyi</option>
              <option value="lunch">Nahar</option>
              <option value="breakfast">Səhər yeməyi</option>
              <option value="pizza">Pizza</option>
            </select>
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

      <div className="categories-table">
        <table>
          <thead>
            <tr>
              <th>İkon</th>
              <th>Ad (Azərbaycan)</th>
              <th>Ad (English)</th>
              <th>Ad (Rus)</th>
              <th>Düzəliş et</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>
                  <span className="category-icon">{category.icon}</span>
                </td>
                <td>{category.nameAz}</td>
                <td>{category.nameEn}</td>
                <td>{category.nameRu}</td>
                <td>
                  <div className="action-buttons">
                    {/* ✅ Bu ZİBİL QABI ikonuna toxunduqda POPUP AÇILIR */}
                    <button
                      className="btn-delete"
                      onClick={() => handleCategoryDeleteClick(category)}
                    >
                      <FaTrash />
                    </button>
                    <button
                      className="btn-edit"
                      onClick={() => handleEditCategory(category)}
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
        title={deleteType === "form" ? "Form məlumatları silinsin?" : "Kateqoriya silinsin?"}
        message={getDeleteMessage()}
        confirmText="Sil"
        cancelText="Geri"
      />
    </section>
  );
}

export default AdminCategoryPage;
