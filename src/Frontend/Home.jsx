import React from "react";
import "./Home.css";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import bgImage from "../assets/home.jpg"; // Import the image

const Home = () => {
    return (
        <div
            className="home-container"
            style={{ backgroundImage: `url(${bgImage})` }} // Set background dynamically
        >
            <div className="content">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <Typewriter
                        words={["Welcome to Zero Waste Grocery Planner!"]}
                        loop={true}
                        cursor
                        cursorStyle="|"
                        typeSpeed={200}
                        deleteSpeed={100}
                        delaySpeed={2000}
                    />
                </motion.h2>

                <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                >
                    <Typewriter
                        words={["A mind-blowing website that will give you meal plans according to your grocery list so that there is no wastage."]}
                        loop={true}
                        cursor
                        cursorStyle="|"
                        typeSpeed={100}
                        deleteSpeed={50}
                        delaySpeed={2000}
                    />
                </motion.h3>
            </div>
        </div>
    );
};

export default Home;
