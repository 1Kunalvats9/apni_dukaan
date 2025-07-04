import React from 'react';

const Cart = ({ itemAddEffect, cartProducts, setisCartOpen }) => {
    return (
        <div onClick={() => setisCartOpen(prev => !prev)} className={`relative cursor-pointer ${itemAddEffect ? "bounce" : ""}`}>
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)">
                <path d="M.583.583h2.333l1.564 7.81a1.17 1.17 0 0 0 1.166.94h5.67a1.17 1.17 0 0 0 1.167-.94l.933-4.893H3.5m2.333 8.75a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0m6.417 0a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0" stroke="#615fff" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <button className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full">{cartProducts}</button>
        </div>
    );
};

export default Cart;