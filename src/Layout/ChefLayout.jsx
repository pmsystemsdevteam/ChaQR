import React from "react";
import { Routes, Route } from "react-router-dom";

import ChefNav from "./ChefNav/ChefNav";
import ChefHomePage from "../Page/ChefHomePage/ChefHomePage";

function ChefLayout() {
  return (
    <div id="chefLayout">
      <ChefNav />

      <main className="chefLayout__content">
        <Routes>
          <Route path="/" element={<ChefHomePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default ChefLayout;
