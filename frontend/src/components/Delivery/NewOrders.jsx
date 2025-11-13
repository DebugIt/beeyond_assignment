import socket from '@/socket';
import React from 'react'
import { useContext, useEffect, useState } from "react";
import { getallDeliveryOrders, acceptOrder } from "../../pages/api/products";
import toast from "react-hot-toast";
import InfoContext from "@/context/InfoContext";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri"
import { ClipLoader } from "react-spinners";
import OrderCard from '../OrderCard';
import DeliveryOrderCard from '../DeliveryOrderCard';

const NewOrders = () => {

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
        page
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

  const acceptorder = async (id) => {
    setLoading(true);
    try {
      const response = await acceptOrder(id)
      if(response){
        console.log(response?.data)
        toast.success("Order Accepted")
        fetchMyOrders()
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error Accepting Order");
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
  }, [])
  

  return (
    <div id="container" className="">
      <div id="order-list-container" className={` grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 sm:gap-2 `}>
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
            <div key={index} className='mx-1 mt-2 mb-2'>
              <DeliveryOrderCard order={item} onAccept={acceptorder}/>
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

export default NewOrders