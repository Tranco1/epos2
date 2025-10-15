import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://192.168.1.107:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Save token + user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert(`✅ Welcome, ${data.user.username}!`);
      navigate("/"); // Redirect to shop
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error, please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">🔐 Login</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">
            {error}
          </div>
        )}

        {/* Username or Email */}
        <label className="block mb-2 font-medium">Email</label>
        <input
          type="text"
          className="border w-full p-2 rounded mb-3"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your email"
          required
        />

        {/* Password */}
        <label className="block mb-2 font-medium">Password</label>
        <input
          type="password"
          className="border w-full p-2 rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Login
        </button>

        {/* Register link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Register
          </Link>
        </p>

        {/* Back to shop link */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="w-full mt-3 text-gray-600 hover:text-black text-sm"
        >
          ← Back to Shop
        </button>
      </form>
    </div>
  );
}

export default Login;
