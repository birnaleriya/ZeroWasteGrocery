// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Frontend/Navbar";
import Home from "./Frontend/Home";
import AboutUs from "./Frontend/AboutUs";
import SmartGrocery from "./Frontend/SmartGrocery";
import MealPlanForm from "./Frontend/mealPlanForm";
import ZeroWaste from "./Frontend/ZeroWaste";
import Login from "./Frontend/Login";
import Register from "./Frontend/Register";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/smart-grocery" element={<SmartGrocery />} />
        <Route path="/meal-plan" element={<MealPlanForm />} />
        <Route path="/zero-waste" element={<ZeroWaste />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
};

export default App;
