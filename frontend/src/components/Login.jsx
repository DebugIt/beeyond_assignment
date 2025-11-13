import Input from '@/components/Input'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { handleLogin, handleRegister } from '../pages/api/auth'
import { useRouter } from 'next/router'
import { ClipLoader } from 'react-spinners'

const Login = () => {

  const [authType, setAuthType] = useState('login')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const [info, setInfo] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  })

  const handleAuth = async () => {
    setLoading(true)
    if (info.email === "" || info.password === "") {
      setLoading(false)
      return toast.error("All fields required")
    }
    try {
      const data = {
        email: info?.email,
        password: info?.password
      }
      const response = await handleLogin(data)
      if (response.status) {
        localStorage.setItem("isLoggedIn", true)
        toast.success(response?.message || "")
        router.push("/dashboard")
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error Logging In")
      console.log("error......", error)
    } finally {
      setLoading(false)
    }
  }

  const handleregister = async () => {
    setLoading(true)
    if (info.name === "" || info.email === "" || info.password === "") {
      setLoading(false)
      return toast.error("All fields required")
    }
    try {
      const response = await handleRegister(info)
      if (response) {
        toast.success(response?.message || "")
        setAuthType("login")
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error Registering User")
      console.log("error......", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const isLogged = localStorage.getItem("isLoggedIn")
    if (isLogged) {
      router.push("/dashboard")
    }
  }, [])

  return (
    <div id='container' className='flex items-center justify-center min-h-screen p-4 bg-gray-50'>
      <div 
        id="box" 
        className='w-full sm:w-[90%] md:w-[70%] lg:w-[40%] xl:w-[30%] bg-white border border-black/20 rounded-lg shadow-md p-4 space-y-4'
      >

        {/* Auth Switch */}
        <div id="login-register" className='flex justify-center gap-3'>
          <button
            onClick={() => setAuthType("login")}
            className={`px-4 py-2 rounded-md text-sm transition-all 
              ${authType === "login" ? "bg-black text-white font-bold" : "hover:bg-black hover:text-white hover:font-semibold"}`}
          >
            Login
          </button>
          <button
            onClick={() => setAuthType("register")}
            className={`px-4 py-2 rounded-md text-sm transition-all 
              ${authType === "register" ? "bg-black text-white font-bold" : "hover:bg-black hover:text-white hover:font-semibold"}`}
          >
            Register
          </button>
        </div>

        {/* Input Fields */}
        <div id="inputs" className='space-y-3'>
          {
            authType === "register" && (
              <Input
                label={"Name"}
                type={"text"}
                placeholder={"Enter your Name"}
                value={info.name}
                textfunc={(e) => setInfo({ ...info, name: e.target.value })}
                required={true}
              />
            )
          }
          <Input
            label={"Email"}
            required={true}
            type={"email"}
            placeholder={"your@email.com"}
            value={info.email}
            textfunc={(e) => setInfo({ ...info, email: e.target.value })}
          />
          <Input
            label={"Password"}
            required={true}
            type={"password"}
            placeholder={"******"}
            value={info.password}
            textfunc={(e) => setInfo({ ...info, password: e.target.value })}
          />

          {
            authType === "register" && (
              <div className='flex flex-col sm:flex-row sm:items-center sm:gap-2 text-sm'>
                <p className='font-medium'>Register as:</p>
                <select
                  name="role"
                  id="role"
                  className='text-xs border border-black/40 px-3 py-1 rounded-md focus:border-black focus:border-2 transition-all mt-1 sm:mt-0'
                  value={info.role}
                  onChange={(e) => setInfo({ ...info, role: e.target.value })}
                >
                  <option value="select-role">Select your Role</option>
                  <option value="customer">Customer</option>
                  <option value="delivery">Delivery Partner</option>
                </select>
              </div>
            )
          }
        </div>

        {/* Submit Button */}
        <div id="submit" className='flex justify-end pt-2'>
          <button
            onClick={authType === "login" ? handleAuth : handleregister}
            className='bg-black text-white font-bold text-sm px-4 py-2 rounded-md hover:scale-105 transition-all cursor-pointer flex items-center justify-center min-w-[90px]'
          >
            {
              !loading ? (
                authType === "login" ? "Login" : "Register"
              ) : (
                <ClipLoader color='#ffffff' size={18} />
              )
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login