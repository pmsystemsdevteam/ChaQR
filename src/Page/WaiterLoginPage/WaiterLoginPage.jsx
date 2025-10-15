import React, { useMemo, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./WaiterLoginPage.scss";
import { RiDeleteBack2Line } from "react-icons/ri";
import Logo from "../../Image/Logo.png";
function WaiterLoginPage({
  onSubmit, // (pin)=>void  opsional
  photoUrl = "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1600&auto=format&fit=crop",
  logoUrl, // opsional: öz loqonu verə bilərsən
}) {
  const [pin, setPin] = useState("");
  const [visible, setVisible] = useState(false);

  const MAX = 6;

  const cells = useMemo(() => {
    const arr = Array(MAX).fill("");
    for (let i = 0; i < pin.length && i < MAX; i++) arr[i] = pin[i];
    return arr;
  }, [pin]);

  const pushChar = (ch) => {
    if (pin.length >= MAX) return;
    // Yalnız rəqəm istəsən, bu sətri aç: if (!/^\d$/.test(ch)) return;
    setPin((p) => p + ch);
  };

  const backspace = () => setPin((p) => p.slice(0, -1));

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    if (pin.length === MAX) {
      onSubmit ? onSubmit(pin) : console.log("PIN:", pin);
    }
  };

  return (
    <div id="waiterLoginPage">
      {/* Sol foto panel */}
      <div
        className="left"
        style={{ backgroundImage: `url(${photoUrl})` }}
        aria-hidden="true"
      />

      {/* Sağ forma paneli */}
      <div className="right">
        <div className="panel">
          {/* Logo */}
          <div className="logoWrap">
            {Logo ? (
              <img src={Logo} alt="Logo" className="logo" />
            ) : (
              <div className="logo fallback">CHAQR</div>
            )}
          </div>

          <p className="subtitle">Zəhmət olmasa pin kodu daxil edin</p>

          {/* PIN xanaları */}
          <form className="pinForm" onSubmit={handleSubmit}>
            <div className="pinCells" role="group" aria-label="PIN">
              {cells.map((c, i) => (
                <div className="cell" key={i}>
                  {visible ? c || "" : c ? "•" : ""}
                </div>
              ))}
            </div>

            {/* Rəqəm klaviaturası */}
            <div
              className="numpad"
              role="group"
              aria-label="Rəqəm klaviaturası"
            >
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
                <button
                  key={n}
                  type="button"
                  className="key"
                  onClick={() => pushChar(n)}
                >
                  {n}
                </button>
              ))}

              {/* “.” — indi 1-1 silir */}
              <button type="button" className="key" onClick={backspace}>
                <RiDeleteBack2Line />
              </button>

              <button
                type="button"
                className="key"
                onClick={() => pushChar("0")}
              >
                0
              </button>

              {/* Qırmızı göz: görünən/gizli */}
              <button
                type="button"
                className="key eye"
                onClick={() => setVisible((v) => !v)}
                aria-label={visible ? "Gizlət" : "Göstər"}
              >
                {visible ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Gizli input – klaviaturadan dəstək (Backspace/Enter) */}
            <input
              className="hiddenInput"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              value={pin}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "").slice(0, MAX);
                setPin(v);
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
            />

            {/* Daxil ol */}
            <button
              type="submit"
              className="submitBtn"
              disabled={pin.length !== MAX}
            >
              Daxil ol
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default WaiterLoginPage;
