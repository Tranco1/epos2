import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

function Shop() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Safely get user from localStorage
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  // ✅ Fetch products on load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://192.168.1.107:5000/api/products");
        const data = await res.json();

        setProducts(data);
        const cats = ["All", ...new Set(data.map((p) => p.category))];
        setCategories(cats);
      } catch (err) {
        console.error("❌ Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  // 🛒 Add to cart
  const addToCart = (product) => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = stored.find((p) => p.id === product.id);
    const newCart = existing
      ? stored.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p
        )
      : [...stored, { ...product, qty: 1 }];

    localStorage.setItem("cart", JSON.stringify(newCart));
    alert(`${product.name} added to cart!`);
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // 🧩 Filter products
  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  // ✅ Utility for menu link styles
  const isActive = (path) =>
    location.pathname === path
      ? "text-blue-700 font-semibold underline"
      : "text-gray-700 hover:text-blue-700";

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🌟 NAVIGATION BAR */}
      <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center relative">
        {/* LEFT: Brand */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          🛍️ The Golden Dragon
        </Link>

        {/* RIGHT: Cart + User Controls */}
        <div className="flex items-center space-x-4">
          <Link
            to="/cart"
            className="text-green-600 hover:text-green-800 font-medium"
          >
            🛒 Cart
          </Link>

          {user ? (
            <>
              <span className="text-gray-700 hidden sm:inline">
                👋 Welcome, {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 font-medium hidden sm:inline"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className={isActive("/login")}>
              🔐 Login
            </Link>
          )}

          {/* Hamburger icon */}
          <button
            className="text-gray-700 md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t z-50 flex flex-col p-4 space-y-3">
            <Link to="/" className={isActive("/")} onClick={handleLinkClick}>
              🏠 Shop
            </Link>
            <Link
              to="/about"
              className={isActive("/about")}
              onClick={handleLinkClick}
            >
              ℹ️ About
            </Link>

            {user && (
              <>
                <Link
                  to="/order-history"
                  className={isActive("/order-history")}
                  onClick={handleLinkClick}
                >
                  📦 Order History
                </Link>
                <Link
                  to="/profile"
                  className={isActive("/profile")}
                  onClick={handleLinkClick}
                >
                  👤 Manage Profile
                </Link>
              </>
            )}

            <hr className="border-gray-200" />

            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  handleLinkClick();
                }}
                className="text-red-600 hover:text-red-800 text-left"
              >
                🚪 Logout
              </button>
            ) : (
              <Link
                to="/login"
                className={isActive("/login")}
                onClick={handleLinkClick}
              >
                🔐 Login
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* 🗂️ CATEGORY FILTER */}
      <div className="p-4">
        {categories.length > 0 ? (
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full border transition-colors ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white hover:bg-blue-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mb-4">Loading categories...</p>
        )}

        {/* 🧾 PRODUCT GRID */}
        {filteredProducts.length === 0 ? (
          <p className="text-gray-500 text-center">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
       className="border rounded-xl p-4 shadow flex flex-col justify-between hover:shadow-lg transition-shadow bg-white"
              >
                <img
                  src={p.img || "https://via.placeholder.com/200?text=No+Image"}
                  alt={p.name}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold text-lg mb-1">{p.name}</h3>
                <p className="text-gray-600 mb-2">
                  ${Number(p.price).toFixed(2)}
                </p>
                <button
                  onClick={() => addToCart(p)}
                  className="bg-green-600 text-white py-1.5 rounded hover:bg-green-700 transition"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Shop;
