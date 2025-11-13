import React, { useContext, useEffect, useState } from "react";
import socket from "@/socket";
import { getallDeliveryPartners } from "../../pages/api/products";
import toast from "react-hot-toast";
import InfoContext from "@/context/InfoContext";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";
import { ClipLoader } from "react-spinners";

const AllPartners = () => {
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [partners, setPartners] = useState([]);
  const [pagination, setPagination] = useState(null);

  const { cart, setCart } = useContext(InfoContext);

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const body = { limit, page };
      const response = await getallDeliveryPartners(body);
      if (response) {
        console.log(response?.data);
        setPartners(response?.data?.data || []);
        setPagination(response?.data?.pagination);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching partners");
      console.log("error......", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, [limit, page]);

  return (
    <div id="container" className="p-3 w-full">
      {/* --- TABLE SECTION --- */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-8">
            <ClipLoader />
          </div>
        ) : partners.length === 0 ? (
          <p className="text-center text-gray-500 py-6">No Partners Found</p>
        ) : (
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  #
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Role
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  Joined On
                </th>
              </tr>
            </thead>
            <tbody>
              {partners.map((partner, index) => (
                <tr
                  key={partner._id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition-colors`}
                >
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {(page - 1) * limit + index + 1}
                  </td>
                  <td className="px-4 py-2 text-sm font-medium text-gray-800">
                    {partner.name}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {partner.email}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600 capitalize">
                    {partner.role}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500">
                    {new Date(partner.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* --- PAGINATION --- */}
      {partners.length > 0 && (
        <div
          id="pagination"
          className="flex justify-between items-center mt-4 px-2"
        >
          <div className="flex items-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => page > 1 && setPage((pg) => pg - 1)}
              className={`p-2 rounded-full ${
                page === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-black hover:bg-gray-200"
              }`}
            >
              <RiArrowLeftSLine size={20} />
            </button>
            <p className="text-sm text-gray-700">
              Page {pagination?.currentPage} of {pagination?.totalPages}
            </p>
            <button
              disabled={page === pagination?.totalPages}
              onClick={() =>
                page < pagination?.totalPages && setPage((pg) => pg + 1)
              }
              className={`p-2 rounded-full ${
                page === pagination?.totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-black hover:bg-gray-200"
              }`}
            >
              <RiArrowRightSLine size={20} />
            </button>
          </div>

          <select
            name="limit"
            id="limit"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="px-2 py-1 text-sm rounded-md border border-gray-400 focus:outline-none focus:ring-1 focus:ring-black"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default AllPartners