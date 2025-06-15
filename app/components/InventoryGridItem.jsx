// components/InventoryGridItem.js
"use client";
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { PlusCircle } from 'lucide-react'; 

const InventoryGridItem = ({ serialNumber, product, onAddToCart }) => {
    const [quantityToAdd, setQuantityToAdd] = useState(1); 

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value);
        if (value >= 1 || e.target.value === '') { 
            setQuantityToAdd(value);
        } else if (value < 1) {
            setQuantityToAdd(1); 
        }
    };

    const handleAddToCartClick = () => {
        if (quantityToAdd < 1) {
            toast.error("Quantity to add must be at least 1.");
            return;
        }
        if (quantityToAdd > product.quantity) {
            toast.error(`Cannot add more than available stock (${product.quantity}).`);
            return;
        }
        onAddToCart(product, quantityToAdd);
        setQuantityToAdd(1); 
    };

    return (
        <div className="grid grid-cols-[50px_2fr_1fr_1fr_1.5fr] gap-4 items-center py-4 px-3 border-b border-gray-200 text-black text-sm md:text-base last:border-b-0">
            <div className="flex items-center">{serialNumber}.</div>
            <div className="flex items-center font-medium">{product.name}</div>
            <div className="flex items-center justify-end">₹{product.retailPrice.toFixed(2)}</div>
            <div className="flex items-center justify-end">
                <span className={`font-semibold ${product.quantity <= 5 ? 'text-red-600' : 'text-green-600'}`}>
                    {product.quantity}
                </span>
            </div>
            <div className="flex items-center justify-center space-x-2">
                <input
                    type="number"
                    min="1"
                    value={quantityToAdd}
                    onChange={handleQuantityChange}
                    className="w-20 px-2 py-1 border border-gray-300 rounded-md text-center outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <button
                    onClick={handleAddToCartClick}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={product.quantity <= 0 || quantityToAdd > product.quantity}
                >
                    <PlusCircle size={18} />
                    Add
                </button>
            </div>
        </div>
    );
};

export default InventoryGridItem;