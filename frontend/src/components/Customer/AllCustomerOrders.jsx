import socket from '@/socket'
import React, { useContext, useEffect, useState } from 'react'
import { getallOrders } from "../../pages/api/products"
import toast from "react-hot-toast"
import InfoContext from "@/context/InfoContext"
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri"
import { ClipLoader } from "react-spinners"
import OrderCard from '../OrderCard'

const AllCustomerOrders = () => {

  const [loading, setLoading] = useState(false)
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)

  const [orders, setOrders] = useState(null)
  const [pagination, setPagination] = useState(null)

  const { cart, setCart } = useContext(InfoContext)

  const fetchMyOrders = async () => {
    setLoading(true)
    try {
      const body = { limit, page }
      const response = await getallOrders(body)
      if (response) {
        setOrders(response?.data?.data)
        setPagination(response?.data?.pagination)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching Orders")
      console.log("error......", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyOrders()
  }, [limit, page])

  useEffect(() => {
    socket.on("order_status_updated", fetchMyOrders)
    socket.on("order_taken", fetchMyOrders)
  }, [])

  return (
    <div id="container" className='w-full min-h-[70vh] flex flex-col'>

      
      <div
        id="order-list-container"
        className='grid grid-cols-2 md:grid-cols-3 gap-4 w-full'
      >
        {loading && (
          <div className='col-span-full flex justify-center items-center py-10'>
            <ClipLoader color='#000' size={35} />
          </div>
        )}

        {!loading && orders?.length === 0 && (
          <div className='col-span-full text-center text-gray-500 text-sm py-10'>
            No Orders Found
          </div>
        )}

        {orders?.map((item, index) => (
          <div key={index} className='w-full'>
            <OrderCard order={item} />
          </div>
        ))}
      </div>

      {pagination && (
        <div
          id="pagination"
          className='flex flex-col sm:flex-row justify-between items-center mt-6 gap-3'
        >
          <div
            id="pagination-menus"
            className='flex items-center gap-2 text-sm text-gray-800'
          >
            <button
              disabled={page === 1}
              onClick={() => (page > 1) && setPage(pg => pg - 1)}
              className='p-1 hover:scale-105 transition-all disabled:opacity-50'
            >
              <RiArrowLeftSLine size={22} />
            </button>
            <p className='font-medium'>
              {pagination?.currentPage} of {pagination?.totalPages}
            </p>
            <button
              disabled={page === pagination?.totalPages}
              onClick={() => (page < pagination?.totalPages) && setPage(pg => pg + 1)}
              className='p-1 hover:scale-105 transition-all disabled:opacity-50'
            >
              <RiArrowRightSLine size={22} />
            </button>
          </div>

          <select
            name="limit"
            id="limit"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className='px-2 py-1 text-xs rounded-md border border-gray-300 cursor-pointer focus:border-black focus:scale-105 transition-all'
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>
      )}
    </div>
  )
}

export default AllCustomerOrders