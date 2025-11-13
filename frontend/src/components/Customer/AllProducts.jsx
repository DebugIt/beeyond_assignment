import { useContext, useEffect, useState } from "react";
import { getProducts } from "../../pages/api/products";
import toast from "react-hot-toast";
import ProductCard from "@/components/ProductCard";
import InfoContext from "@/context/InfoContext";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri"
import { ClipLoader } from "react-spinners";


export default function AllProducts () {

  const [loading, setLoading] = useState(false)
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [selectedId, setSelectedId] = useState(null)

  const [products, setProducts] = useState(null)
  const [pagination, setPagination] = useState(null)

  const { cart, setCart } = useContext(InfoContext)


  const fetchProducts = async () => {
    setLoading(true);
    try {
      const body = {
        limit,
        page,
        search
      }
      const response = await getProducts(body)
      if(response){
        console.log(response?.data)
        setProducts(response?.data?.data)
        setPagination(response?.data?.pagination)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error Logging In");
      console.log("error......", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [limit, page, search])
  

  return (
    <div id="container" className="">
      <div id="product-list-container" className={` grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 `}>
        {
          (products?.length === 0 && !loading) && (
            "No Products"
          )
        }

        {
          loading && (
            <ClipLoader />
          )
        }

        {
          products?.map((item, index) => (
            <div key={index}>
              <ProductCard item={item}/>
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
  );
}
