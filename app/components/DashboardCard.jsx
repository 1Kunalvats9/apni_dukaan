import React from 'react'

const DashboardCard = ({ title, value, icon,style }) => {
    return (
        <div className="w-full h-full p-[4px] rounded-2xl border-2 border-black bg-white">
            <div className="w-full h-full bg-white/40 backdrop-blur-md rounded-2xl p-6 flex items-center justify-between gap-6">
                {/* Text Content */}
                <div className="flex-1">
                    <h2 className="text-lg sm:text-xl font-medium text-black drop-shadow-sm">
                        {title}
                    </h2>
                    <p className={`text-3xl sm:text-4xl font-bold mt-2 text-black drop-shadow-md ${style}`}>
                        {value}
                    </p>
                </div>

                {/* Image */}
                <div className="w-20 h-20 sm:w-20 sm:h-20">
                    <img
                        src={icon}
                        alt={title}
                        className="w-full h-full object-contain drop-shadow-lg"
                    />
                </div>
            </div>
        </div>
    )
}

export default DashboardCard