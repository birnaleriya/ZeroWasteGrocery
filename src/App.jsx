// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Frontend/Home';
import Navbar from './Frontend/Navbar';
import AboutUs from './Frontend/AboutUs';
import SmartGrocery from './Frontend/SmartGrocery';
import MealPlan from './Frontend/MealPlan';
import ZeroWaste from './Frontend/ZeroWaste';
import Login from './Frontend/Login';
import Register from './Frontend/Register';
const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="smart-grocery" element={<SmartGrocery />} />
        <Route path="meal-plan" element={<MealPlan />} />
        <Route path="zero-waste" element={<ZeroWaste />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default App;
