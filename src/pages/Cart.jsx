import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(stored);
  }, []);

  const updateQuantity = (id, qty) => {
    const newCart = cart.map((item) =>
      item.id === id ? { ...item, qty: Number(qty) } : item
    );
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const handleSubmitOrder = async () => {
    if (!customerName.trim()) {
      alert("Please enter your name");
      return;
    }

    const order = {
      customer_name: customerName,
      items: cart,
      user_id: user?.id || null
    };
console.log("🧺 Submitting cart:", cart);
    try {
      const res = await fetch("http://192.168.1.107:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      if (!res.ok) throw new Error("Order failed");
      alert("✅ Order placed successfully!");
      localStorage.removeItem("cart");
      navigate("/");
    } catch (err) {
      console.error("Order error:", err);
      alert("❌ Failed to place order");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">🛒 Your Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center">
            <p className="mb-4">Your cart is empty.</p>
            <button
              onClick={() => navigate("/")}
              className="text-blue-600 hover:underline"
            >
              ← Back to Shop
            </button>
          </div>
        ) : (
          <>
            <table className="w-full mb-4">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-2">{item.name}</td>
                    <td>${Number(item.price).toFixed(2)}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={item.qty}
                        onChange={(e) =>
                          updateQuantity(item.id, e.target.value)
                        }
                        className="w-16 border rounded text-center"
                      />
                    </td>
                    <td>
                      ${(item.price * item.qty).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center mb-4">
              <p className="font-semibold">
                Total: $
                {cart
                  .reduce((sum, i) => sum + i.price * i.qty, 0)
                  .toFixed(2)}
              </p>
              <button
                onClick={() => navigate("/")}
                className="text-blue-600 hover:underline"
              >
                ← Continue Shopping
              </button>
            </div>

            <div className="border-t pt-4">
              <label className="block font-medium mb-1">
                Customer Name
              </label>
              <input
                type="text"
                className="border w-full p-2 rounded mb-4"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name"
              />

              <button
                onClick={handleSubmitOrder}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
              >
                Submit Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;
