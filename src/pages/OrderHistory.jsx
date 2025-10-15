import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get user once from localStorage
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    // Don't fetch if no user is logged in
    if (!user || !user.id) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        console.log("Fetching orders for user:", user.id);
        const response = await fetch(`http://192.168.1.107:5000/api/orders/${user.id}`);
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("❌ Error fetching order history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    // 🔹 DO NOT put 'user' in dependency array because it's not stable
  }, []); // <-- empty dependency array ensures it only runs once

  // Render
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Please log in to view your order history.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading your orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Order History</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-4 rounded-xl shadow hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate(`/order-details/${order.order_id}`)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Order #{order.order_id}</p>
                  <p className="text-gray-500">
                    {new Date(order.order_date).toLocaleString()}
                  </p>
                </div>
                <p className="text-blue-600 font-medium">View Details →</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
