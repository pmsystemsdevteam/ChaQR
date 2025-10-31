import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { RiDeleteBack2Line } from "react-icons/ri";
import axios from "axios";
import Logo from "../../Image/Logo.png";
import "./ChefLogin.scss";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ChefLogin() {
  const navigate = useNavigate();
  
  const [pin, setPin] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const MAX = 6;

  const cells = useMemo(() => {
    const arr = Array(MAX).fill("");
    for (let i = 0; i < pin.length && i < MAX; i++) arr[i] = pin[i];
    return arr;
  }, [pin]);

  // ✅ Token yoxlaması useEffect-də
  useEffect(() => {
    const token = localStorage.getItem("chefToken");
    if (token) {
      navigate("/chef", { replace: true });
    }
  }, [navigate]);

  const pushChar = (ch) => {
    if (pin.length >= MAX) return;
    setPin((p) => p + ch);
    setError("");
  };

  const backspace = () => {
    setPin((p) => p.slice(0, -1));
    setError("");
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    
    if (pin.length === MAX) {
      setLoading(true);
      setError("");

      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/chef/login/`,
          { pin_code: pin },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.data.success) {
          const { chef } = response.data;
          const token = `chef_token_${chef.id}_${Date.now()}`;
          localStorage.setItem("chefToken", token);
          localStorage.setItem("chefUser", JSON.stringify({
            id: chef.id,
            name: chef.name,
            role: "chef"
          }));
          navigate("/chef", { replace: true });
        }
      } catch (err) {
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else if (err.response?.status === 400) {
          setError("Yanlış PIN kod! Yenidən cəhd edin.");
        } else if (err.code === "ERR_NETWORK") {
          setError("Şəbəkə xətası. Server ilə əlaqə yaradıla bilmədi.");
        } else {
          setError("Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.");
        }
        setPin("");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div id="chefLoginPage">
      <div
        className="left"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1600&auto=format&fit=crop)`,
        }}
        aria-hidden="true"
      />

      <div className="right">
        <div className="panel">
          <div className="logoWrap">
            <img src={Logo} alt="Logo" className="logo" />
          </div>

          <h1 className="title">Chef Panel</h1>
          <p className="subtitle">Zəhmət olmasa PIN kodu daxil edin</p>

          {error && <div className="errorMessage">{error}</div>}
          {loading && <div className="loadingMessage">Yoxlanılır...</div>}

          <form className="pinForm" onSubmit={handleSubmit}>
            <div className="pinCells" role="group" aria-label="PIN">
              {cells.map((c, i) => (
                <div className="cell" key={i}>
                  {visible ? c || "" : c ? "•" : ""}
                </div>
              ))}
            </div>

            <div className="numpad" role="group" aria-label="Rəqəm klaviaturası">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
                <button
                  key={n}
                  type="button"
                  className="key"
                  onClick={() => pushChar(n)}
                  disabled={loading}
                >
                  {n}
                </button>
              ))}

              <button
                type="button"
                className="key"
                onClick={() => setVisible((v) => !v)}
                aria-label={visible ? "Gizlət" : "Göstər"}
                disabled={loading}
              >
                {visible ? <FiEyeOff /> : <FiEye />}
              </button>

              <button 
                type="button" 
                className="key" 
                onClick={() => pushChar("0")}
                disabled={loading}
              >
                0
              </button>

              <button 
                type="button" 
                className="key eye" 
                onClick={backspace}
                disabled={loading}
              >
                <RiDeleteBack2Line />
              </button>
            </div>

            <input
              className="hiddenInput"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              value={pin}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, MAX);
                setPin(v);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace") {
                  e.preventDefault();
                  backspace();
                } else if (/^\d$/.test(e.key) && pin.length < MAX) {
                  e.preventDefault();
                  pushChar(e.key);
                } else if (e.key === "Enter") {
                  handleSubmit(e);
                }
              }}
              disabled={loading}
            />

            <button
              type="button"
              className={`submitBtn ${pin.length !== MAX || loading ? "disabled" : ""}`}
              onClick={handleSubmit}
              disabled={pin.length !== MAX || loading}
            >
              {loading ? "Yoxlanılır..." : "Daxil ol"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChefLogin;
