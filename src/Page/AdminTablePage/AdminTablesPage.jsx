import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminTablesPage.scss";
import { MdChair, MdTableRestaurant, MdAdd } from "react-icons/md";
import { FiPlus, FiMinus } from "react-icons/fi";
import ChaqrLoading from "../../Components/Loading/Loading";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const MAX_CHAIRS = 16;

function AdminTablesPage() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTable, setEditingTable] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [tableError, setTableError] = useState("");
  const [newTable, setNewTable] = useState({
    table_num: "",
    chair_number: 4,
    status: "empty"
  });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/tables/`);
      setTables(response.data);
    } catch (error) {
      console.error("Masalar yüklənmədi:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkTableExists = (tableNum) => {
    return tables.some(table => table.table_num === parseInt(tableNum));
  };

  const handleTableNumChange = (value) => {
    setNewTable({...newTable, table_num: value});
    
    if (value && checkTableExists(value)) {
      setTableError(`Masa №${value} artıq mövcuddur`);
    } else {
      setTableError("");
    }
  };

  const handleAddTable = async () => {
    if (!newTable.table_num) {
      setTableError("Masa nömrəsini daxil edin");
      return;
    }

    if (checkTableExists(newTable.table_num)) {
      setTableError(`Masa №${newTable.table_num} artıq mövcuddur`);
      return;
    }

    if (newTable.chair_number < 1 || newTable.chair_number > MAX_CHAIRS) {
      alert("Stul sayı 1 ilə 16 arasında olmalıdır!");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/tables/`, {
        table_num: parseInt(newTable.table_num),
        chair_number: newTable.chair_number,
        status: newTable.status
      });

      setShowAddModal(false);
      setNewTable({ table_num: "", chair_number: 4, status: "empty" });
      setTableError("");
      fetchTables();
    } catch (error) {
      console.error("Masa əlavə edilmədi:", error);
      if (error.response?.data?.table_num) {
        setTableError(error.response.data.table_num[0]);
      } else {
        alert("Xəta baş verdi!");
      }
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "empty": return "Boş";
      case "reserved": return "Rezerv olunub";
      case "occupied": return "Məşğul";
      case "sendOrder": return "Sifariş göndərilib";
      case "sendKitchen": return "Mətbəxə göndərilib";
      case "makeFood": return "Yemək hazırlanır";
      case "deliveredFood": return "Təhvil verilib";
      case "waitingWaiter": return "Ofisiant gözlənilir";
      default: return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "empty": return "status-empty";
      case "reserved": return "status-reserved";
      case "occupied": return "status-occupied";
      case "sendOrder":
      case "sendKitchen":
      case "makeFood": return "status-preparing";
      case "deliveredFood": return "status-delivered";
      case "waitingWaiter": return "status-waiting";
      default: return "";
    }
  };

  const handleStatusChange = async (tableId, newStatus) => {
    try {
      setTables(prev => prev.map(t => 
        t.id === tableId ? { ...t, status: newStatus } : t
      ));
      
      await axios.patch(`${API_BASE_URL}/api/tables/${tableId}/`, {
        status: newStatus,
      });
      
      setEditingTable(null);
    } catch (error) {
      console.error("Status dəyişmədi:", error);
      alert("Xəta baş verdi!");
      fetchTables();
    }
  };

  const handleChairChange = async (tableId, currentChairs, delta) => {
    const newChairs = currentChairs + delta;
    if (newChairs < 1 || newChairs > MAX_CHAIRS) return;

    try {
      setTables(prev => prev.map(t => 
        t.id === tableId ? { ...t, chair_number: newChairs } : t
      ));

      await axios.patch(`${API_BASE_URL}/api/tables/${tableId}/`, {
        chair_number: newChairs,
      });
    } catch (error) {
      console.error("Stul sayı dəyişmədi:", error);
      alert("Xəta baş verdi!");
      fetchTables();
    }
  };

  if (loading) {
    return (
      <section id="adminTablesPage">
        <ChaqrLoading/>
      </section>
    );
  }

  return (
    <section id="adminTablesPage">
      <div className="header">
        <div className="header-left">
          <h2>Masalar</h2>
          <p className="table-count">Ümumi masalar: {tables.length}</p>
        </div>
        <button className="add-table-btn" onClick={() => setShowAddModal(true)}>
          <MdAdd /> Masa əlavə et
        </button>
      </div>

      <div className="tables-container">
        {tables.map((table) => (
          <div key={table.id} className="table-wrapper">
            <div className={`table-card ${getStatusClass(table.status)}`}>
              <div className="table-header">
                <div className="table-number">
                  <MdTableRestaurant className="table-icon" />
                  <span>Masa №{table.table_num}</span>
                </div>
                <div className={`status-indicator ${getStatusClass(table.status)}`}>
                  {getStatusText(table.status)}
                </div>
              </div>

              <div className="table-visual">
                <div className="chairs-wrapper">
                  {Array.from({ length: table.chair_number }).map((_, i) => {
                    const angle = (360 / table.chair_number) * i;
                    const distance = table.chair_number <= 4 ? 70 : table.chair_number <= 8 ? 75 : table.chair_number <= 12 ? 85 : 95;
                    
                    return (
                      <div
                        key={i}
                        className="chair-item"
                        style={{
                          transform: `rotate(${angle}deg) translateY(-${distance}px)`,
                        }}
                      >
                        <MdChair
                          style={{
                            transform: `rotate(-${angle}deg)`,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="table-center">
                  <MdTableRestaurant />
                </div>
              </div>

              <div className="chair-controls">
                <button
                  onClick={() => handleChairChange(table.id, table.chair_number, -1)}
                  disabled={table.chair_number <= 1}
                  className="chair-btn"
                >
                  <FiMinus />
                </button>
                <span className="chair-count">{table.chair_number} stul</span>
                <button
                  onClick={() => handleChairChange(table.id, table.chair_number, 1)}
                  disabled={table.chair_number >= MAX_CHAIRS}
                  className="chair-btn"
                >
                  <FiPlus />
                </button>
              </div>

              {editingTable === table.id ? (
                <div className="edit-mode">
                  <select
                    value={table.status}
                    onChange={(e) => handleStatusChange(table.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="empty">Boş</option>
                    <option value="reserved">Rezerv olunub</option>
                    <option value="occupied">Məşğul</option>
                    <option value="sendOrder">Sifariş göndərilib</option>
                    <option value="sendKitchen">Mətbəxə göndərilib</option>
                    <option value="makeFood">Yemək hazırlanır</option>
                    <option value="deliveredFood">Təhvil verilib</option>
                    <option value="waitingWaiter">Ofisiant gözlənilir</option>
                  </select>
                  <button onClick={() => setEditingTable(null)} className="cancel-btn">
                    Ləğv et
                  </button>
                </div>
              ) : (
                <button onClick={() => setEditingTable(table.id)} className="edit-btn">
                  Status dəyiş
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Table Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => {
          setShowAddModal(false);
          setTableError("");
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Yeni masa əlavə et</h3>
            
            <div className="form-group">
              <label>Masa nömrəsi</label>
              <input
                type="number"
                placeholder="Məsələn: 5"
                value={newTable.table_num}
                onChange={(e) => handleTableNumChange(e.target.value)}
                className={tableError ? "error" : ""}
              />
              {tableError && <span className="error-message">{tableError}</span>}
            </div>

            <div className="form-group">
              <label>Stul sayı (1-{MAX_CHAIRS})</label>
              <div className="chair-input">
                <button
                  onClick={() => setNewTable({...newTable, chair_number: Math.max(1, newTable.chair_number - 1)})}
                  className="chair-btn"
                >
                  <FiMinus />
                </button>
                <input
                  type="number"
                  min="1"
                  max={MAX_CHAIRS}
                  value={newTable.chair_number}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setNewTable({...newTable, chair_number: Math.min(MAX_CHAIRS, Math.max(1, val))});
                  }}
                />
                <button
                  onClick={() => setNewTable({...newTable, chair_number: Math.min(MAX_CHAIRS, newTable.chair_number + 1)})}
                  className="chair-btn"
                >
                  <FiPlus />
                </button>
              </div>
            </div>

            <div className="modal-actions">
              <button className="cancel-modal-btn" onClick={() => {
                setShowAddModal(false);
                setTableError("");
              }}>
                Ləğv et
              </button>
              <button 
                className="submit-modal-btn" 
                onClick={handleAddTable}
                disabled={!!tableError}
              >
                Əlavə et
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminTablesPage;
