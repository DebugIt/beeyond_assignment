import socket from '@/socket';
import React from 'react'
import { useContext, useEffect, useState } from "react";
import { getallDeliveryOrders, acceptOrder, updatestatus } from "../../pages/api/products";
import toast from "react-hot-toast";
import InfoContext from "@/context/InfoContext";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri"
import { ClipLoader } from "react-spinners";
import OrderCard from '../OrderCard';
import DeliveryOrderCard from '../DeliveryOrderCard';
import AssignedOrderCard from '../AssignedOrderCard';

const OrdersToDeliver = () => {

  const [loading, setLoading] = useState(false)
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState(null)

  const [orders, setOrders] = useState(null)
  const [pagination, setPagination] = useState(null)

  const { cart, setCart } = useContext(InfoContext)

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const body = {
        limit,
        page,
        assigny : "true"
      }
      const response = await getallDeliveryOrders(body)
      if(response){
        console.log(response?.data)
        setOrders(response?.data?.data)
        setPagination(response?.data?.pagination)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching Orders");
      console.log("error......", error);
    } finally {
      setLoading(false);
    }
  }

  const updateStatus = async (id, newStatus) => {
    setLoading(true);
    try {
      const body = {
        id: id,
        data: {
            status: newStatus
        }
      }
      const response = await updatestatus(body)
      if(response){
        console.log(response?.data)
        toast.success(response?.message || "Order status updated")
        fetchMyOrders()
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching Orders");
      console.log("error......", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMyOrders()
  }, [limit, page])  

  useEffect(() => {
    socket.on("order_available", fetchMyOrders);
    socket.on("order_taken", fetchMyOrders)
    socket.on("order_accepted", fetchMyOrders)
  }, [])
  

  return (
    <div id="container" className="">
      <div id="order-list-container" className={` grid grid-cols-2 md:grid-cols-3 gap-3 `}>
        {
          (!orders && !loading) && (
            "No New Orders"
          )
        }

        {
          loading && (
            <ClipLoader />
          )
        }

        {
          orders?.map((item, index) => (
            <div key={index} className=''>
              <AssignedOrderCard order={item} onStatusUpdate={updateStatus}/>
            </div>
          ))
        }
      </div>

      <div id="pagination" className="flex justify-end">
        <div id="pagination-menus" className="flex items-center">
          <button disabled={page === 1} onClick={() => {(page > 1) && setPage((pg) => pg - 1)}}>
            <RiArrowLeftSLine size={25}/>
          </button>
          <p>
            {pagination?.currentPage} of {pagination?.totalPages}
          </p>
          <button disabled={page === pagination?.totalPages} onClick={() => { (page < pagination?.totalPages) && setPage((pg) => pg + 1) }}>
            <RiArrowRightSLine size={25}/>
          </button>
        </div>
        <select name="limit" id="limit" value={limit} onChange={(e) => setLimit(e.target.value)} className="px-2 py-1 text-xs rounded-md border-2 border-black/50 cursor-pointer focus:border-black/100 focus:scale-105 transition-all">
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
      </div>
    </div>
  )
}

export default OrdersToDeliver