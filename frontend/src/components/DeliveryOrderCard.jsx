import React from "react";
import { FaClock, FaBox, FaUser } from "react-icons/fa";

const DeliveryOrderCard = ({ order, onAccept }) => {
  if (!order) return null;

  const total = order.items?.reduce((sum, i) => sum + i.price * i.qty, 0) || 0;

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
      
      <div className="sm:flex justify-between items-center border-b pb-2 mb-3">
        <p className="text-sm font-semibold text-gray-800">
          #{order._id.slice(-6).toUpperCase()}
        </p>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            order.status === "delivered"
              ? "bg-green-100 text-green-700"
              : order.status === "out-for-delivery"
              ? "bg-blue-100 text-blue-700"
              : order.status === "accepted"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {order.status.replace(/-/g, " ")}
        </span>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-700 mb-3">
        <div className="flex items-center gap-1">
          <FaUser className="text-gray-500" size={12} />
          <p>{order.customer?.name || "N/A"}</p>
        </div>
        <div className="flex items-center gap-1">
          <FaClock className="text-gray-500" size={12} />
          <p>{new Date(order.createdAt).toLocaleTimeString()}</p>
        </div>
        <div className="flex items-center gap-1">
          <FaBox className="text-gray-500" size={12} />
          <p>{order.items?.length || 0} item(s)</p>
        </div>
      </div>

      {/* Order Preview */}
      <div className="bg-gray-50 rounded-lg p-2 mb-3">
        {order.items?.slice(0, 2).map((item, i) => (
          <div key={i} className="flex justify-between text-xs text-gray-600">
            <p>{item.name}</p>
            <p>₹{item.price} × {item.qty}</p>
          </div>
        ))}
        {order.items?.length > 2 && (
          <p className="text-xs text-gray-400 mt-1 text-right italic">
            +{order.items.length - 2} more
          </p>
        )}
      </div>

      {/* Total + Action */}
      <div className="sm:flex justify-between items-center">
        <p className="font-semibold text-gray-900 text-sm">
          Total: ₹{total.toLocaleString()}
        </p>
        {order.status === "created" ? (
          <button
            onClick={() => onAccept(order._id)}
            className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-md hover:bg-green-700 transition"
          >
            Accept Order
          </button>
        ) : (
          <p className="text-xs text-gray-500 italic">
            {order.status === "accepted"
              ? "You accepted this order"
              : "In progress"}
          </p>
        )}
      </div>
    </div>
  );
};

export default DeliveryOrderCard;