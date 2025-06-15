import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from 'react-toastify';
import Cart from './Cart'; // Import the Cart component directly

const Navbar = ({ isLoggedIn, cartProducts, itemAddEffect, setisCartOpen }) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        if (isLoggedIn) {
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            localStorage.removeItem("cart");
            toast.success('User logged Out Successfully');
            router.push('/');
        } else {
            router.push('/login');
        }
    };

    return (
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-200 bg-white fixed top-0 left-0 w-full z-50 transition-all">
            <a href="#">
                <img className="h-11" src="https://res.cloudinary.com/dzjlp82fv/image/upload/v1744896060/apnidukaanlogo_gp5akm.png" alt="dummyLogoColored" />
            </a>

            <div className="hidden sm:flex items-center text-black gap-8">
                {isLoggedIn && (
                    <Cart
                        itemAddEffect={itemAddEffect}
                        cartProducts={cartProducts}
                        setisCartOpen={setisCartOpen}
                    />
                )}
                <button onClick={handleClick} className="cursor-pointer px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full">
                    {isLoggedIn ? 'Logout' : 'Login'}
                </button>
            </div>

            <div className={`flex items-center gap-6 sm:hidden`}>
                {isLoggedIn && ( // Only show cart icon if logged in on mobile
                    <Cart
                        itemAddEffect={itemAddEffect}
                        cartProducts={cartProducts}
                        setisCartOpen={setisCartOpen}
                    />
                )}
                <button onClick={() => setOpen(!open)} aria-label="Menu" className="sm:hidden">
                    <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="21" height="1.5" rx=".75" fill="#426287" />
                        <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
                        <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
                    </svg>
                </button>
            </div>

            <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full z-100 bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden text-black duration-700`}>
                <button onClick={handleClick} className="cursor-pointer px-6 py-2 mt-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm">
                    {isLoggedIn ? 'Logout' : 'Login'}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;