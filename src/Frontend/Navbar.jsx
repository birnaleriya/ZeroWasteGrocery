// src/Frontend/Navbar.jsx
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleIconClick = () => {
        if (user) {
            setShowDropdown(!showDropdown);
        } else {
            navigate("/login");
        }
    };

    const handleLogout = () => {
        signOut(auth);
        setShowDropdown(false);
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <img src={logo} alt="Logo" className="navbar-icon" />
                <h2 className="pr-7 pl-2 font-pacifico text-3xl "> Grocery Planner</h2>
            </div>

            <ul className="nav-links">
                <li><Link to="/"><FontAwesomeIcon icon={faHome} /></Link></li>
                <li><Link to="/about-us">About Us</Link></li>
                <li><Link to="/smart-grocery">Smart Grocery</Link></li>
                <li><Link to="/meal-plan">Meal Plan</Link></li>
                <li><Link to="/zero-waste">Zero Waste</Link></li>
            
            </ul>

            <div className="navbar-right" style={{ position: "relative" }}>
                <button onClick={handleIconClick} className="icon-button">
                    <FontAwesomeIcon icon={faUser} className="login-icon" />
                </button>

                {showDropdown && user && (
                    <div className="dropdown-menu">
                        <p><strong>Name:</strong> {user.name}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Age:</strong> {user.age}</p>
                        <p><strong>Weight:</strong> {user.weight} kg</p>
                        <button onClick={handleLogout} className="logout-button">
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
