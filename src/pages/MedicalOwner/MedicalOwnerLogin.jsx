import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MedicalOwnerLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [totp, setTotp] = useState("");

    const handleLogin = async (e) => {
        // Inside handleLogin function in MedicalOwnerLogin.jsx
        // const handleLogin = async (e) => {
            e.preventDefault();
              console.log("Submitting", { email, password, totp });


            try {
                const response = await axios.post("http://localhost:9191/api/medical-owner/login", {
                    email,
                    password,
                    totp,
                });

                // Debug log
                console.log("Login Response:", response.data);

                // Store token and profile
                localStorage.setItem("medicalOwnerToken", response.data.token);
                localStorage.setItem("medicalOwnerProfile", JSON.stringify(response.data.profile));
                localStorage.setItem("medicalOwnerToken", response.data.token);

                alert("Login successful ✅");

                // Redirect to dashboard (update this route as needed)
                navigate("/medical-owner/dashboard");
            } catch (error) {
                console.error("Login error:", error.response?.data || error.message);
                alert(error.response?.data?.message || "Login failed ❌");
            }
        
    };

    return (
        <div className="h-screen w-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url('https://plus.unsplash.com/premium_photo-1672759455907-bdaef741cd88?q=80&w=1416&auto=format&fit=crop')` }}>
            <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-10 w-full max-w-md">
                <h2 className="text-3xl font-bold text-black mb-2">Login</h2>
                <p className="text-sm text-black/70 mb-6">Welcome Back! Please enter your details.</p>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-black font-semibold mb-1">Email</label>
                        <input type="email" className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-black font-semibold mb-1">Password</label>
                        <input type="password" className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-black font-semibold mb-1">TOTP</label>
                        <input type="text" className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none" placeholder="Enter your TOTP" value={totp} onChange={(e) => setTotp(e.target.value)} />
                    </div>
                    <div className="flex justify-between items-center text-sm text-black/70">
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" className="accent-black" />
                            <span>Remember me for 30 days</span>
                        </label>
                        <a href="#" className="text-blue-600 hover:underline">Forgot Password?</a>
                    </div>
                    <button type="submit" className="w-full py-2 bg-black text-white rounded-md font-semibold">Log in</button>
                    <button type="button" onClick={() => navigate('/medical-owner/register')} className="w-full py-2 border border-black text-black rounded-md font-semibold">Register</button>
                </form>
                <p className="mt-4 text-center text-sm text-black/70">Don’t have an account? <a href="#" className="text-blue-600 hover:underline">Sign up for free</a></p>
            </div>
        </div>
    );
};

export default MedicalOwnerLogin;
