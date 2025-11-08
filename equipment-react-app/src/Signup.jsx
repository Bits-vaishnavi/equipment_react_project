import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [prnNumber, setPrnNumber] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => { 
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await fetch("http://localhost:3001/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, full_name: fullName, prn_number: prnNumber }),
            });
        

            const data = await response.json();

            if (response.ok) {
                setSuccess("Signup successful! Redirecting to login...");
                setTimeout(() => {
                    navigate("/login");
                }, 1500);
            } else {
                setError(data.message || "Signup failed. Please try again.");
            }
        } catch (err) {
            console.error("Signup error:", err);
            setError("Server error. Please try again later.");
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h2>Equipment Portal - Signup</h2>
                <br />

                <form onSubmit={handleSignup} className="login-form">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />

                    <input
                        type="text"
                        placeholder="PRN Number"
                        value={prnNumber}
                        onChange={(e) => setPrnNumber(e.target.value)}
                        required
                    />

                    {error && <p className="error-msg">{error}</p>}
                    {success && <p className="success-msg">{success}</p>}

                    <button type="submit">Sign Up</button>
                </form>
                <br />
                <hr />
                <p className="note">
                    <span className="signup-link" onClick={() => navigate("/login")}>Already have an account? Login</span>
                </p>
            </div>
        </div>
    );
}

export default Signup;