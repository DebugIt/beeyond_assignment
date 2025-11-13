import Navbar from "@/components/Navbar";
import InfoContext from "@/context/InfoContext";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";

import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }) {

  const [cart, setCart] = useState([])
  const [details, setDetails] = useState(null)
  const router = useRouter()
  const hideNavbar = ['/']

  useEffect(() => {
    if(cart.length > 0){
      localStorage.setItem("cart", JSON.stringify(cart))
    }
  }, [cart])

  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if(savedCart){
      setCart(JSON.parse(savedCart))
    }
  }, [])
  
  

  return (
    <InfoContext.Provider value={{cart, setCart, details, setDetails}}>
      <div id="main-container" className={` ${geistSans.className} h-screen`}>
        {
          !hideNavbar.includes(router.pathname) && <Navbar />
        }

        <Component {...pageProps} />
      </div>
      <Toaster 
        position="top-right"
        toastOptions={{
          success: {
            duration: 3000
          }
        }}
      />
    </InfoContext.Provider>
  )
}
