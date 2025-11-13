import React, { useState } from "react";
import { updatestatus } from "@/pages/api/products";
import toast from "react-hot-toast";
import { FaBox, FaClock, FaUser } from "react-icons/fa";

const statusOptions = [
  "accepted",
  "in-the-kitchen",
  "out-for-delivery",
  "delivered",
  "rejected",
];

const AssignedOrderCard = ({ order, onStatusUpdate }) => {
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState(order.status);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setUpdating(true);
    try {
      const body = {
        id: order._id,
        data: { status: newStatus },
      };
      const response = await updatestatus(body);

      toast.success(`Status updated to ${newStatus}`);
      onStatusUpdate?.(order._id, newStatus);
    } catch (err) {
      toast.error("Failed to update status");
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const total =
    order.items?.reduce((sum, i) => sum + i.price * i.qty, 0) || 0;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-2 mb-3">
        <p className="text-sm font-semibold text-gray-800">
          #{order._id.slice(-6).toUpperCase()}
        </p>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
            status === "delivered"
              ? "bg-green-100 text-green-700"
              : status === "out-for-delivery"
              ? "bg-blue-100 text-blue-700"
              : status === "in-the-kitchen"
              ? "bg-yellow-100 text-yellow-700"
              : status === "rejected"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {status.replace(/-/g, " ")}
        </span>
      </div>

      {/* Quick Info */}
      <div className="grid sm:grid-cols-3 gap-3 text-sm text-gray-700 mb-3">
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

      {/* Items Preview */}
      <div className="bg-gray-50 rounded-lg p-2 mb-3">
        {order.items?.slice(0, 2).map((item, i) => (
          <div key={i} className="flex justify-between text-xs text-gray-600">
            <p>{item.name}</p>
            <p>
              ₹{item.price} × {item.qty}
            </p>
          </div>
        ))}
        {order.items?.length > 2 && (
          <p className="text-xs text-gray-400 mt-1 text-right italic">
            +{order.items.length - 2} more
          </p>
        )}
      </div>

      {/* Total + Status Dropdown */}
      <div className="sm:flex justify-between items-center">
        <p className="font-semibold text-gray-900 text-sm">
          Total: ₹{total.toLocaleString()}
        </p>

        <select
          value={status}
          onChange={handleStatusChange}
          disabled={updating}
          className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
        >
          {statusOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt.replace(/-/g, " ")}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AssignedOrderCard;
