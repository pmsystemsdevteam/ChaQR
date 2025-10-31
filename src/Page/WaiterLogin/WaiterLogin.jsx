import React, { useMemo, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { RiDeleteBack2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./WaiterLogin.scss";
import Logo from "../../Image/Logo.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function WaiterLogin() {
  const [pin, setPin] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const MAX = 6;

  const cells = useMemo(() => {
    const arr = Array(MAX).fill("");
    for (let i = 0; i < pin.length && i < MAX; i++) arr[i] = pin[i];
    return arr;
  }, [pin]);

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
    
    if (pin.length !== MAX) {
      setError("PIN 6 rəqəm olmalıdır");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_BASE_URL}/api/waiter/login/`, {
        pin_code: pin
      });

      if (response.data.success) {
        localStorage.setItem("waiterToken", "waiter-logged-in");
        localStorage.setItem("waiterUser", JSON.stringify(response.data.waiter));
        
        navigate("/waiter/allTable", { replace: true });
      } else {
        setError(response.data.message || "Yanlış PIN kod");
      }
    } catch (err) {
      console.error("Login error:", err);
      setPin("");
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 400) {
        setError("Yanlış PIN kod");
      } else {
        setError("Server xətası. Zəhmət olmasa yenidən cəhd edin");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="waiterLoginPage">
      <div
        className="left"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1600&auto=format&fit=crop)`
        }}
        aria-hidden="true"
      />

      <div className="right">
        <div className="panel">
          <div className="logoWrap">
            <img src={Logo} alt="Logo" className="logo" />
          </div>

          <p className="subtitle">Zəhmət olmasa pin kodu daxil edin</p>

          {error && <div className="errorMessage">{error}</div>}

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
              disabled={loading}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, MAX);
                setPin(v);
                setError("");
              }}
              onKeyDown={(e) => {
                if (loading) return;
                
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
            />

            <button
              type="submit"
              className={`submitBtn ${pin.length !== MAX || loading ? "disabled" : ""}`}
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

export default WaiterLogin;
