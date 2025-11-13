import socket from '@/socket'
import React, { useContext, useEffect, useState } from 'react'
import { getallAdminOrders } from '../../pages/api/products'
import toast from 'react-hot-toast'
import InfoContext from '@/context/InfoContext'
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri'
import { ClipLoader } from 'react-spinners'
import OrderCard from '../OrderCard'

const AllOrders = () => {

  const [loading, setLoading] = useState(false)
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [orders, setOrders] = useState([])
  const [pagination, setPagination] = useState(null)
  const { cart, setCart } = useContext(InfoContext)

  const fetchMyOrders = async () => {
    setLoading(true)
    try {
      const body = { limit, page }
      const response = await getallAdminOrders(body)
      if (response) {
        setOrders(response?.data?.data || [])
        setPagination(response?.data?.pagination)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error fetching Orders')
      console.log('error......', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyOrders()
  }, [limit, page])

  useEffect(() => {
    socket.on('order_status_updated', fetchMyOrders)
    socket.on('order_taken', fetchMyOrders)
  }, [])

  return (
    <div id="container" className="flex flex-col gap-4 w-full p-2 sm:p-3 md:p-4">
      
      {/* Orders List */}
      <div 
        id="order-list-container" 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {
          loading ? (
            <div className='flex items-center justify-center col-span-full py-10'>
              <ClipLoader color="#000" />
            </div>
          ) : orders?.length === 0 ? (
            <div className='text-center text-sm text-gray-600 col-span-full py-6'>
              No Orders Found
            </div>
          ) : (
            orders.map((item, index) => (
              <div key={index} className='w-full flex justify-center'>
                <OrderCard order={item} />
              </div>
            ))
          )
        }
      </div>

      {/* Pagination */}
      <div 
        id="pagination" 
        className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 border-t border-gray-200 pt-3"
      >
        <div 
          id="pagination-menus" 
          className="flex items-center gap-2"
        >
          <button 
            disabled={page === 1} 
            onClick={() => (page > 1) && setPage(pg => pg - 1)} 
            className={`p-1 rounded-md hover:bg-gray-100 transition-all ${page === 1 && 'opacity-50 cursor-not-allowed'}`}
          >
            <RiArrowLeftSLine size={22}/>
          </button>
          <p className='text-sm'>
            {pagination?.currentPage || page} of {pagination?.totalPages || 1}
          </p>
          <button 
            disabled={page === pagination?.totalPages} 
            onClick={() => (page < pagination?.totalPages) && setPage(pg => pg + 1)} 
            className={`p-1 rounded-md hover:bg-gray-100 transition-all ${page === pagination?.totalPages && 'opacity-50 cursor-not-allowed'}`}
          >
            <RiArrowRightSLine size={22}/>
          </button>
        </div>

        <div className='flex items-center gap-2'>
          <p className='text-xs sm:text-sm'>Per page:</p>
          <select 
            name="limit" 
            id="limit" 
            value={limit} 
            onChange={(e) => setLimit(Number(e.target.value))} 
            className="px-2 py-1 text-xs sm:text-sm rounded-md border border-black/40 focus:border-black focus:border-2 cursor-pointer transition-all"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default AllOrders