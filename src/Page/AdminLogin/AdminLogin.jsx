import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.scss";
import chaQRLogo from "../../Image/Logo.png";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/adminpanel/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("adminAccessToken", data.tokens.access);
        localStorage.setItem("adminRefreshToken", data.tokens.refresh);
        localStorage.setItem("adminUser", JSON.stringify(data.user));
        navigate("/admin");
      } else {
        setError(data.message || "İstifadəçi adı və ya şifrə yanlışdır");
      }
    } catch (err) {
      setError("Serverlə əlaqə qurula bilmədi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adminLoginPage">
      <div className="loginContainer">
        <div className="loginBox">
          <div className="logoSection">
            <img src={chaQRLogo} alt="Logo" className="logo" />
          </div>

          <div className="loginHeader">
            <h1>Admin Panel</h1>
            <p>Sistemə daxil olun</p>
          </div>

          <form onSubmit={handleSubmit} className="loginForm">
            {error && (
              <div className="errorMessage">
                <p>{error}</p>
              </div>
            )}

            <div className="formGroup">
              <label htmlFor="username">İstifadəçi adı</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="İstifadəçi adınızı daxil edin"
                required
              />
            </div>

            <div className="formGroup">
              <label htmlFor="password">Şifrə</label>
              <div className="passwordInputWrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifrənizi daxil edin"
                  required
                />
                <button
                  type="button"
                  className="togglePassword"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="loginButton" disabled={loading}>
              <div className="buttonInner">
                {loading ? "Yüklənir..." : "Daxil ol"}
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
