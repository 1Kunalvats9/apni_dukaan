import React, { useState } from 'react';
import { toast } from 'react-toastify';

const ProductCard = ({ url, name, price, quantity, id, onAddToCart, wholesalePrice }) => {
    const [count, setCount] = useState(0);
    const [showFullPrice, setShowFullPrice] = useState(false);

    const handleClick = () => {
        if (count > 0) {
            onAddToCart({
                name,
                price: Number(price),
                wholesalePrice: Number(wholesalePrice),
                url,
                quantity: count,
                id: id
            });
            toast.success("Product added successfully!");
            setCount(0);
        }
    };

    return (
        <div className="border border-gray-500/20 rounded-md px-3 py-2 bg-white min-w-[280px] max-w-[320px] w-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
            <div className="group cursor-pointer flex items-center justify-center">
                <img
                    className="group-hover:scale-105 transition-transform duration-200 h-48 object-contain"
                    src={url || "https://www.pngitem.com/pimgs/m/325-3256246_fa-fa-product-icon-transparent-cartoons-fa-fa.png"}
                    alt={name}
                />
            </div>
            <div className="text-gray-500/60 mt-4">
                <p className="text-gray-700 font-semibold text-lg truncate w-full">{name}</p>
                <p className="text-gray-500 font-medium text-sm">Available: {quantity}</p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-3">
                    <p className="text-indigo-500 font-bold text-xl">
                        ₹{price}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between mt-4">
                    <div className="flex items-center justify-center">
                        {count === 0 ? (
                            <button
                                className="flex items-center justify-center gap-1 bg-indigo-100 border border-indigo-300 w-full sm:w-auto h-10 rounded text-indigo-600 font-medium px-4"
                                onClick={() => setCount(1)}
                            >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0" stroke="#615fff" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Add
                            </button>
                        ) : (
                            <div className="flex items-center justify-center gap-2  w-full sm:w-auto h-10 bg-indigo-500/25 rounded select-none">
                                <button
                                    onClick={() => setCount((prev) => Math.max(prev - 1, 0))}
                                    className="cursor-pointer text-md px-2 h-full"
                                >
                                    -
                                </button>
                                <span className="w-5 text-center">{count}</span>
                                <button
                                    onClick={() => setCount((prev) => prev + 1)}
                                    className="cursor-pointer text-md px-2 h-full"
                                >
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                    {count > 0 && (
                        <button
                            className="w-full sm:w-auto mt-4 sm:mt-0 flex items-center justify-center gap-1 bg-indigo-100 border border-indigo-300 h-10 rounded text-indigo-600 font-medium px-4"
                            onClick={handleClick} 
                        >
                            Add to Cart
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
