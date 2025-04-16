import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { toast } from 'react-toastify';

const Navbar = ({ isLoggedIn,setcart, cartProducts, itemAddEffect , setisCartOpen }) => {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [isCartOpen, setisCartOptn] = useState(false)
    const handleClick = ()=>{
        if(isLoggedIn){
            localStorage.removeItem('token')
            localStorage.removeItem('email')
            localStorage.removeItem("cart")
            toast.success('User logged Out Successfully')
            router.push('/')
        }else{
            router.push('/login')
        }
    }
    return (
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-200 bg-white fixed top-0 left-0 w-full z-50 transition-all">

            <a href="#">
                <img className="h-9" src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/dummyLogo/dummyLogoColored.svg" alt="dummyLogoColored" />
            </a>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center text-black gap-8">
                <a href="#">Home</a>
                <a href="#">About</a>
                <a href="#">Contact</a>

                {
                    isLoggedIn && 
                    
                    <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                        <input className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" type="text" placeholder="Search products" />
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.836 10.615 15 14.695" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            <path clipRule="evenodd" d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                }
                {
                    isLoggedIn && 
                    <div onClick={()=>{
                        setisCartOpen(true)
                    }} className={`relative cursor-pointer ${itemAddEffect ? "bounce":""}`}>
                        <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0" stroke="#615fff" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <button className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full">{cartProducts}</button>
                        {isCartOpen && 
                            <div className={`w-[90vw] border-black border-2 md:w-[20vw] h-[70vh] -translate-x-[45%] absolute top-8 flex flex-col items-center gap-3 px-4 rounded-lg bg-gray-500/30 backdrop-blur-2xl py-2`}>
                                <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-start w-full'>Cart Summary</h1>
                                <button className='bg-red-500 fixed bottom-2 cursor-pointer hover:scale-105 duration-150 rounded-md px-4 py-1 text-white' onClick={()=>{localStorage.removeItem("cart"); setcart([])}}>Remove All Items</button>
                        </div>}
                    </div>
                }
                <button onClick={handleClick} className="cursor-pointer px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full">
                    {isLoggedIn ? 'Logout' : 'Login'}
                </button>
            </div>

            <div className={`flex items-center gap-6 sm:hidden`}>
            <div onClick={()=>{
                        setisCartOptn(!isCartOpen)
                    }} className={`relative cursor-pointer ${itemAddEffect ? "bounce":""}`}>
                        <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0" stroke="#615fff" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <button className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full">{cartProducts}</button>
                        {isCartOpen && 
                            <div className={`w-[80vw] border-black border-2 md:w-[30vw] lg:w-[40vw] h-[70vh] -translate-x-[75%] md:-translate-x-[100%] lg:-translate-x-[45%] absolute top-11 flex flex-col items-center gap-3 px-4 rounded-lg bg-gray-500/30 backdrop-blur-2xl py-2`}>
                                <h1 className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-start w-full'>Cart Summary</h1>
                                <button className='bg-red-500 fixed bottom-2 cursor-pointer hover:scale-105 duration-150 rounded-md px-4 py-1 text-white' onClick={()=>{localStorage.removeItem("cart"); setcart([])}}>Remove All Items</button>
                        </div>}
                    </div>
                <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="sm:hidden">
                    {/* Menu Icon SVG */}
                    <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="21" height="1.5" rx=".75" fill="#426287" />
                        <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
                        <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
                    </svg>
                </button>

            </div>
            {/* Mobile Menu */}
            
            <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full z-100 bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden text-black duration-700`}>
                <a href="#" className="block">Home</a>
                <a href="#" className="block">About</a>
                <a href="#" className="block">Contact</a>
                <button onClick={handleClick} className="cursor-pointer px-6 py-2 mt-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm">
                    {isLoggedIn ? 'Logout' : 'Login'}
                </button>
            </div>

        </nav>
    )
}
export default Navbar