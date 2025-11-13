import React from "react";

const OrderCard = ({ order }) => {
  if (!order) return null;

  const visibleItems = order.items?.slice(0, 1) || [];
  const remainingCount = (order.items?.length || 0) - visibleItems.length;

  return (
    <div className="bg-white shadow-md rounded-xl p-4 sm:p-5 md:p-6 mb-4 border border-gray-100 w-full max-w-full transition-all duration-200 hover:shadow-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-2 mb-3 gap-2">
        <h2 className="font-semibold text-base sm:text-lg text-gray-800 break-all">
          Order ID:{" "}
          <span className="text-gray-600 text-sm sm:text-base">{order._id}</span>
        </h2>
        <span
          className={`w-fit px-3 py-1 text-xs sm:text-sm font-medium rounded-full ${
            order.status === "delivered"
              ? "bg-green-100 text-green-700"
              : order.status === "out-for-delivery"
              ? "bg-blue-100 text-blue-700"
              : order.status === "in-the-kitchen"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {order.status.replace(/-/g, " ").toUpperCase()}
        </span>
      </div>

      {/* Customer Info */}
      <div className="mb-3 text-xs sm:text-sm text-gray-700 space-y-1">
        <p>
          <strong>Customer:</strong> {order.customer?.name || "N/A"}
        </p>
        <p className="break-all">
          <strong>Email:</strong> {order.customer?.email || "N/A"}
        </p>
        <p>
          <strong>Placed On:</strong>{" "}
          {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Items */}
      <div className="mt-3">
        <h3 className="font-medium text-gray-800 mb-2 text-sm sm:text-base">
          Items:
        </h3>
        <div className="space-y-2">
          {visibleItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row justify-between sm:items-center bg-gray-50 rounded-lg px-3 py-2"
            >
              <div className="text-sm sm:text-base">
                <p className="font-medium text-gray-800">
                  Product ID:{" "}
                  <span className="text-gray-600 text-sm break-all">
                    {item.productid}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Qty: {item.qty} × ₹{item.price}
                </p>
              </div>
              <p className="font-semibold text-gray-800 mt-1 sm:mt-0 text-sm sm:text-base">
                ₹{item.qty * item.price}
              </p>
            </div>
          ))}

          {remainingCount > 0 && (
            <p className="text-gray-500 text-xs sm:text-sm italic text-center mt-2">
              +{remainingCount} more item{remainingCount > 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      {/* Total */}
      <div className="border-t mt-3 pt-2 text-right">
        <p className="font-semibold text-gray-900 text-sm sm:text-base">
          Total: ₹
          {order.items?.reduce((sum, i) => sum + i.price * i.qty, 0) || 0}
        </p>
      </div>
    </div>
  );
};

export default OrderCard;