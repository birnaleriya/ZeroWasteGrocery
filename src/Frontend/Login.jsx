import React, { useState } from "react";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                localStorage.setItem("user", JSON.stringify(userData));
            }

            alert("Login Successful!");
            navigate("/smart-grocery", { replace: true });

        } catch (err) {
            setError("Invalid email or password.");
        }
    };

    return (
        <div className="login-container">
            <div className="bg-gray-900 p-14 rounded-2xl shadow-2xl w-[600px] mx-auto mt-10">
                <h2 className="text-white text-6xl font-extrabold mb-10 text-center">Login</h2>

                <div className="bg-gray-800 p-12 rounded-2xl shadow-lg border-4 border-gray-700">
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <form className="space-y-8" onSubmit={handleLogin}>
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
                            Login
                        </button>
                    </form>
                </div>

                <p className="text-gray-400 text-center mt-8 text-2xl">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-400 hover:underline font-semibold">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
