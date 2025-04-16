"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import LineChart from "../components/LineChart";
import DashboardCard from '../components/DashboardCard';
import ProductCard from '../components/ProductCard';
import { toast } from 'react-toastify';
import Footer from '../components/Footer';

const Page = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [products, setProducts] = useState([]);
    const [openAddProduct, setOpenAddProduct] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [searchFor, setSearchFor] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [retailPrice, setRetailPrice] = useState(0);
    const [wholesalePrice, setWholesalePrice] = useState(0);
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalIncome, setTotalIncome] = useState(0);
    const [profit, setProfit] = useState(0);
    const [cart, setCart] = useState([]);
    const [itemAddEffect, setItemAddEffect] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [showAddress, setShowAddress] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [customerPhone, setCustomerPhone] = useState("");
    const [userData, setUserData] = useState([]);
    const router = useRouter();

    useEffect(() => {
        let price = 0;
        cart.forEach((item) => {
            price += item.price * item.quantity;
        });
        setTotalAmount(price);
    }, [cart]);


    const sendBill = async () => {
        const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        const formattedProducts = cart
            .map(item => `${item.quantity} x ${item.name}`)
            .join('\n');

        const billDetails = `
  Product: \n${formattedProducts}
  Total: ₹${totalPrice}
  Thank you for shopping with us!
        `;

        try {
            const res = await fetch('/api/sms/send', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phoneNumber: customerPhone, billDetails }),
            });

            let data = {};
            try {
                data = await res.json();
            } catch (e) {
                console.error("❌ Failed to parse JSON from sendBill response", e.message);
            }

            if (res.ok && data.success) {
                toast.success("E-bill sent successfully ✅");
            } else {
                toast.error("Failed to send e-bill ❌");
            }
        } catch (error) {
            console.error("❌ sendBill failed:", error.message);
            toast.error("Could not send bill");
        }
    };


    const handleCheckout = async () => {
        try {
            customerPhone && await sendBill();
            const res = await fetch("/api/checkout/checkout-product", {
                method: "POST",
                body: JSON.stringify({ cart, email }),
                headers: { "Content-Type": "application/json" }
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("Checkout Successful!");
                setCart([]);
                localStorage.removeItem('cart');
                setTotalIncome(totalIncome => totalIncome + totalAmount);
            } else {
                alert("Error: " + data.error);
            }
        } catch (error) {
            console.error("Checkout Failed:", error);
        }
    };



    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        setLoading(true);

        try {
            const res = await fetch("/api/upload/upload-file", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Upload error:", errorData.error);
                toast.error("Image upload failed ❌");
                setLoading(false);
                return;
            }

            const data = await res.json();
            setUrl(data.url);
            toast.success("Image uploaded ✅");
        } catch (err) {
            console.error("❌ Upload failed:", err.message);
            toast.error("Image upload error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsLoggedIn(false);
            router.push('/');
        } else {
            setIsLoggedIn(true);
        }
    }, [router]);

    useEffect(() => {
        const email = localStorage.getItem('email');
        if (email) setEmail(email);
        refreshProducts(email);
        const cartItem = localStorage.getItem('cart');
        let cartIfAvailable = [];
        if (cartItem) {
            try {
                cartIfAvailable = JSON.parse(cartItem);
            } catch (error) {
                console.error("Error parsing cart data:", error);
            }
        }
        if (cartIfAvailable.length > 0) {
            setCart(cartIfAvailable);
        }
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch("/api/user/get-user", {
                method: "POST",
                body: JSON.stringify({ email }),
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();
            if (!data) {
                toast.error("User data not available");
            }
            if (data && data.data){
                setUserData(data.data);
                setProfit(data.data.profit ? data.data.profit :0);
                setTotalIncome(data.data.totalIncome);
            }
        }
        fetchUser();
    }, [cart,email]);
    const refreshProducts = async (userEmail) => {
        try {
            const res = await fetch("/api/inventory/inventoryget", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail }),
            });

            if (!res.ok) {
                let errorMessage = "Failed to fetch products";
                if (res.headers.get('content-type')?.includes('application/json')) {
                    try {
                        const errorData = await res.json();
                        errorMessage = errorData.error || errorMessage;
                    } catch (jsonError) {
                        console.error("Error parsing JSON:", jsonError);
                        const text = await res.text();
                        console.error("Non-JSON Response:", text);
                    }
                } else {
                    const text = await res.text();
                    console.error("Non-JSON Response:", text);
                    errorMessage = `Server returned non-JSON response with status ${res.status}`;
                }
                throw new Error(errorMessage);
            }
    
            const data = await res.json();
            console.log(data)
            setProducts(data.products);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };
      
    const handleClick = async (e) => {
        e.preventDefault();
        if (loading) {
            toast.error("Image is still uploading, please wait...");
            return;
        }

        try {
            const userEmail = localStorage.getItem("email");
            setEmail(userEmail);
            const res = await fetch("/api/inventory/inventoryput", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail, name, category, quantity, retailPrice, wholesalePrice, url }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to add product");
            }

            const data = await res.json();
            toast.success("Product added Successfully ✅");
            setOpenAddProduct(false);
            refreshProducts(userEmail);
        } catch (err) {
            console.error("❌ Error adding product:", err.message);
            toast.error("Failed to add product");
        }
    }

    const handleAddToCart = (product) => {
        setItemAddEffect(true);
        setCart(prev => [...prev, product]);
        setTimeout(() => {
            setItemAddEffect(false);
        }, 1000);
    };
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);


    return (
        <div className='bg-blue-50 min-h-[100vh]'>
            {
                isCartOpen &&
                <div className='w-[100vw] h-[100vh] fixed top-0 text-black z-50 flex items-center justify-start bg-white/30 backdrop-blur-2xl'>
                    <div className='w-[3rem] absolute top-24 right-10 h-[3rem] cursor-pointer p-3 rounded-full flex items-center justify-center' onClick={() => { setIsCartOpen(false); }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill='#000' viewBox="0 0 384 512">
                            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                        </svg>
                    </div>
                    <div className="flex flex-col md:flex-row py-16 max-w-6xl w-full px-6 mx-auto">
                        <div className='flex-1 max-w-4xl'>
                            <h1 className="text-3xl font-medium mb-6">
                                Shopping Cart <span className="text-sm text-indigo-500">{cart.length} items</span>
                            </h1>

                            <div className="grid grid-cols-[2fr_1fr] text-gray-500 text-base font-medium pb-3">
                                <p className="text-left">Product Details</p>
                                <p className="text-center">Subtotal</p>
                            </div>

                            {
                                cart.length > 0 ?
                                    cart.map((product, index) => (
                                        <div key={index} className="grid grid-cols-[2fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                                            <div className="flex items-center md:gap-6 gap-3">
                                                <div className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded">
                                                    <img className="max-w-full h-full object-cover" src={product.url} alt={product.name} />
                                                </div>
                                                <div>
                                                    <p className="hidden md:block font-semibold">{product.name}</p>
                                                    <div className="font-normal text-gray-500/70">
                                                        <p>Size: <span>{product.size || "N/A"}</span></p>
                                                        <div className='flex items-center'>
                                                            <p>Qty: {product.quantity}</p>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-center">₹{product.price * product.quantity}</p>
                                        </div>)
                                    ) : <h1>No products in Cart</h1>}

                            <button onClick={() => { setIsCartOpen(false); }} className="group cursor-pointer flex items-center mt-8 gap-2 text-indigo-500 font-medium">
                                <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.09 5.5H1M6.143 10 1 5.5 6.143 1" stroke="#615fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Back to Dashboard
                            </button>

                        </div>

                        <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                            <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
                            <hr className="border-gray-300 my-5" />

                            <div className="mb-6">
                                <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

                                <select className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none">
                                    <option value="COD">Cash</option>
                                    <option value="Online">Online Payment</option>
                                </select>
                            </div>

                            <hr className="border-gray-300" />

                            <div className="text-gray-500 mt-4 space-y-2">
                                <p className="flex justify-between text-lg font-medium mt-3">
                                    <span>Total Amount:</span><span>₹{totalAmount}</span>
                                </p>
                            </div>

                            <input type="text" placeholder="Phone number" className="border border-black rounded-md px-3 mt-3 w-full outline-none py-2" onChange={(e) => {
                                setCustomerPhone(e.target.value);
                            }} />

                            <button className="w-full py-3 mt-6 cursor-pointer bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition rounded-md" onClick={handleCheckout}>
                                Checkout
                            </button>
                            <button className="w-full rounded-md text-white bg-red-500 py-3 mt-6 cursor-pointer font-medium  hover:bg-red-600 duration-200" onClick={() => {
                                localStorage.removeItem('cart');
                                setCart([]);
                            }}>
                                Empty Cart
                            </button>
                        </div>
                    </div>
                </div>
            }
            {
                openAddProduct &&
                <div className='w-full fixed z-150 h-full text-black bg-white/30 backdrop-blur-2xl flex items-center justify-center'>
                    <div className="bg-white relative rounded-lg border-2 border-gray-300 px-12 py-7 max-w-md w-full">
                        <div className='w-6 h-6 cursor-pointer absolute top-3 right-3' onClick={() => {
                            setOpenAddProduct(!openAddProduct);
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                            </svg>
                        </div>
                        <h3 className="text-xl md:text-3xl font-medium text-white bg-indigo-700 px-3 py-2 rounded-md mb-4">Add New Product <div className='text-sm mt-3'>or scan barcode</div></h3>
                        <form onSubmit={handleClick}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-md font-medium text-gray-700">Product Name</label>
                                    <input type="text" id="name" placeholder='Name' className="mt-1 block w-full rounded-sm border-2 text-black border-gray-300 focus:border-2 focus:border-indigo-500 focus:ring-indigo-500 outline-none px-3 py-1" onChange={(e) => {
                                        setName(e.target.value);
                                    }} />
                                </div>
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                                    <select id="category" className="mt-1 focus:border-2 block w-full rounded-sm border-2 border-gray-300  focus:border-indigo-500 focus:ring-indigo-500 outline-none px-3 py-1" onChange={(e) => {
                                        setCategory(e.target.value);
                                    }} >
                                        <option value="Furniture">Furniture</option>
                                        <option value="Snacks">Snacks</option>
                                        <option value="Home and Kitchen">Home and Kitchen</option>
                                        <option value="Groceries">Groceries</option>
                                        <option value="Food">Food</option>
                                        <option value="Dessert">Dessert</option>
                                        <option value="Clothes">Clothes</option>
                                        <option value="Dairy">Dairy</option>
                                        <option value="Electronics">Electronics</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                                    <input type="number" id="quantity" placeholder='Quantity' className="mt-1 focus:border-2 block w-full rounded-sm border-2 border-gray-300  focus:border-indigo-500 focus:ring-indigo-500 outline-none px-3 py-1" onChange={(e) => {
                                        setQuantity(Number(e.target.value.trim()));
                                    }} />
                                </div>
                                <div>
                                    <label htmlFor="retailPrice" className="block text-sm font-medium text-gray-700">Retail Price (₹)</label>
                                    <input type="number" id="retailPrice" placeholder='Retail price' className="mt-1 focus:border-2 block w-full rounded-sm border-2 border-gray-300  focus:border-indigo-500 focus:ring-indigo-500 outline-none px-3 py-1" onChange={(e) => {
                                        setRetailPrice(Number(e.target.value.trim()));
                                    }} />
                                </div>
                                <div>
                                    <label htmlFor="wholesalePrice" className="block text-sm font-medium text-gray-700">Wholesale Price (₹)</label>
                                    <input type="number" id="wholesalePrice" placeholder='Wholesale Price' className="mt-1 focus:border-2 block w-full rounded-sm border-2 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 outline-none px-3 py-1" onChange={(e) => {
                                        setWholesalePrice(Number(e.target.value.trim()));
                                    }} />
                                </div>
                                <div>
                                    <input type="file" placeholder='Upload Image' className='px-3 py-1 border-2 rounded-md w-full border-gray-200 cursor-pointer' onChange={handleUpload} />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button type="button" className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50" onClick={() => {
                                    setOpenAddProduct(false);
                                }}>Cancel</button>
                                <button type="submit" disabled={loading} className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">{loading ? 'Uploading...' : 'Add Product'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            }

            <Navbar isLoggedIn={isLoggedIn} setisCartOpen={setIsCartOpen} setCart={setCart} cartProducts={cart.length} itemAddEffect={itemAddEffect} />

            <div className='w-[100vw] mt-[69px] bg-blue-50 h-auto flex flex-col gap-5 md:flex-row items-start px-5 md:px-10 py-4'>
                <div className='w-full md:w-[60%] h-[30vh] md:h-[60vh]'>
                    <LineChart userData={userData} />
                </div>
                <div className='grid w-full md:w-[40%] gap-4 mt-10 md:mt-0 grid-cols-1 place-items-center'>
                    <DashboardCard
                        title="Total Products"
                        value={products.length || 0}
                        icon="https://icons.veryicon.com/png/o/miscellaneous/fu-jia-intranet/product-29.png"
                        style=""
                    />
                    <DashboardCard
                        title="Total Income"
                        value={totalIncome}
                        icon="https://cdn-icons-png.flaticon.com/512/25/25473.png"
                        style="text-yellow-500"
                    />
                    <DashboardCard
                        title="Profit"
                        value={profit}
                        icon="https://cdn-icons-png.flaticon.com/512/1421/1421335.png"
                        style="text-green-600"
                    />
                </div>
            </div>
            <div className='w-[100%] mx-auto bg-white rounded-xl py-10'>
                <h1 className='text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-5xl font-bold'>Apni Dukaan</h1>
                <div className='flex items-center justify-between gap-2 px-6 py-3 mt-5'>
                    <div className='w-[75%] md:w-[85%]'>
                        <div className="flex items-center border border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-sm gap-2 px-3 rounded-full">
                            <input className="py-3 px-2 w-full duration-200 bg-transparent outline-none placeholder-gray-500" type="text" placeholder="Search Products" onClick={() => setIsSearching(!isSearching)} onChange={(e) => { setSearchFor(e.target.value) }} />
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.836 10.615 15 14.695" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                <path clipRule="evenodd" d="M9.141 11.738c2.729-1.136 4.001-4.224 2.841-6.898S7.67.921 4.942 2.057C2.211 3.193.94 6.281 2.1 8.955s4.312 3.92 7.041 2.783" stroke="#7A7B7D" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <button onClick={() => setOpenAddProduct(!openAddProduct)} type="button" className="w-40 cursor-pointer hover:scale-105 duration-200 py-3 active:scale-95 transition text-sm px-2 text-white rounded-full bg-indigo-500 hover:bg-indigo-600">
                        <div className="mb-0.5 flex items-center justify-center gap-2">
                            <div className='h-full flex items-center justify-center'>
                                <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 448 512">
                                    <path fill="#ffffff" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
                                </svg>
                            </div>
                            Add Products
                        </div>
                    </button>
                </div>
                <div className='w-full grid gap-3 md:gap-5 grid-cols-1 place-items-center md:grid-cols-2 lg:grid-cols-4 px-2 md:px-7 py-3'>
                    {
                        products.length > 0 ?
                            products
                                .filter(ele => ele.name?.toLowerCase().startsWith(searchFor.toLowerCase()))
                                .map((item, idx) => (
                                    <ProductCard key={idx} name={item.name} price={item.retailPrice} url={item.url} quantity={item.quantity} id={item._id} onAddToCart={handleAddToCart} wholesalePrice={item.wholesalePrice} />
                                )) : <h1>Inventory is empty.</h1>
                    }
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Page;