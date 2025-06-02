// src/App.jsx
import React from "react";
import './index.css';
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import RolePicker from "./pages/RolePicker";
import CreatorPage from "./pages/CreatorPage";
import ContributorBoard from "./components/ContributorBoard";
import ContributorPage from "./pages/ContributorPage"; // <- make sure it's here

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigation />}>
        <Route index element={<Home />} />
        <Route path="rolepicker" element={<RolePicker />} />
        <Route path="creator" element={<CreatorPage />} />
        <Route path="contributor" element={<ContributorPage />} />{" "}
      </Route>
    </Routes>
  );
}

export default App;
