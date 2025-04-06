import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <img src={logo} alt="Logo" className="navbar-icon" />
                <h2>Zero Waste Grocery Planner</h2>
            </div>

            <ul className="nav-links">
                <li><Link to="/"><FontAwesomeIcon icon={faHome} /></Link></li>
                <li><Link to="/about-us">About Us</Link></li>
                <li><Link to="/smart-grocery">Smart Grocery</Link></li>
                <li><Link to="/meal-plan]">Meal Plan</Link></li>
                <li><Link to="/zero-waste]">Zero Waste</Link></li>
            </ul>

            {/* Login Icon on the right */}
            <div className="navbar-right">
                <Link to="/login">
                    <FontAwesomeIcon icon={faUser} className="login-icon" />
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;