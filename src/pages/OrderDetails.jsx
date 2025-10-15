import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://192.168.1.107:5000/api/orders/${orderId}/items`);
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Error fetching order items:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [orderId]);

  const reorder = () => {
    const cart = items.map((item) => ({
      id: item.product_id,
      name: item.name,
      price: item.price,
      qty: item.quantity,
      img: item.img,
    }));
    localStorage.setItem("cart", JSON.stringify(cart));
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <button
        className="text-blue-600 underline mb-4"
        onClick={() => navigate("/order-history")}
      >
        ← Back to Orders
      </button>

      <h1 className="text-2xl font-bold mb-4">Order #{orderId}</h1>

      {loading && <p>Loading...</p>}

      {!loading && items.length === 0 && <p>No items found for this order.</p>}

      {!loading && items.length > 0 && (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.product_id}
              className="flex items-center bg-white p-3 rounded-xl shadow"
            >
              <img
//                src={item.img || "https://via.placeholder.com/64"}
                  src={item.img.startsWith("http")
                  ? item.img
                  : `http://192.168.1.107:5173${item.img}`
                  }
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg mr-4"
              />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-gray-500">
                  Qty: {item.quantity} | ${Number(item.price).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <button
          onClick={reorder}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
        >
          Reorder These Items
        </button>
      )}
    </div>
  );
};

export default OrderDetails;
