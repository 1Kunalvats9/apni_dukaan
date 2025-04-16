import React from 'react'

const InventoryCard = ({url, name, price}) => {
  return (
    <div className='flex flex-col items-center text-black justify-between px-3 py-4'>
        <div className='flex flex-col items-center gap-2'>
            <img src={url} alt={name} className='w-full' />
            <div className='flex items-center justify-between'>
                <h1>{name.toUpperCase()}</h1>
                <h1>{price}</h1>
            </div>
        </div>
        <div className='flex items-center justify-between'>
            <div className='p-2 w-6 h-6 border border-indigo-500 rounded-full'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/>
                </svg>
            </div>
            <input type="number" placeholder='Quantity' className='px-2 no-spinner py-3 bg-indigo-600 text-white rounded-md' />
            <div className='p-2 w-6 h-6 border border-indigo-500 rounded-full'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/>
                </svg>
            </div>
        </div>
    </div>
  )
}

export default InventoryCard
