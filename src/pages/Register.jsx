import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dealerId, setDealerId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://192.168.1.107:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          dealer_id: dealerId || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      alert("✅ Registration successful! You can now log in.");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      setError("Network error, please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">📝 Register</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">
            {error}
          </div>
        )}

        <label className="block mb-2 font-medium">Name</label>
        <input
          type="text"
          className="border w-full p-2 rounded mb-3"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        /><br></br> 

        <label className="block mb-2 font-medium">Email</label>
        <input
          type="email"
          className="border w-full p-2 rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br></br>

        <label className="block mb-2 font-medium">Password</label>
        <input
          type="password"
          className="border w-full p-2 rounded mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br></br>

        <button
          type="submit"
          className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700"
        >
          Register
        </button>

        <p className="mt-3 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
