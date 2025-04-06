import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Registration Successful!");
            navigate("/login");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="register-container">
            <div className="bg-gray-900 p-14 rounded-2xl shadow-2xl w-[600px]">
                <h2 className="text-white text-6xl font-extrabold mb-10 text-center">Register</h2>

                <div className="bg-gray-800 p-12 rounded-2xl shadow-lg border-4 border-gray-700">
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <form className="space-y-8" onSubmit={handleRegister}>
                        <div>
                            <label className="block text-white text-2xl mb-3">Email</label>
                            <input
                                type="email"
                                className="w-full p-5 text-2xl rounded-lg bg-gray-700 text-white border border-gray-600"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-white text-2xl mb-3">Password</label>
                            <input
                                type="password"
                                className="w-full p-5 text-2xl rounded-lg bg-gray-700 text-white border border-gray-600"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button className="w-full bg-blue-600 text-white py-5 text-2xl rounded-xl hover:bg-blue-700 transition font-bold">
                            Register
                        </button>
                    </form>
                </div>

                <p className="text-gray-400 text-center mt-8 text-2xl">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-400 hover:underline font-semibold">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
