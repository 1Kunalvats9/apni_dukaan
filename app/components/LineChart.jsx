import { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
  } from 'recharts';

  const dataDummy = [
    { name: '1', value: 0 },
    { name: '2', value: 0 },
    { name: '3', value: 0 },
    { name: '4', value: 0 },
    { name: '5', value: 0 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white border rounded shadow px-3 py-2">
          <p className="font-semibold">{label}</p>
          <p className="text-indigo-500">Income: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const IncomeChart = ({ userData }) => {
    const [dailyIncomeData, setDailyIncomeData] = useState([]);

    useEffect(() => {
      if (userData && userData.checkoutHistory && userData.checkoutHistory.length > 0) {
        const dailyIncome = {};

        userData.checkoutHistory.forEach((checkout) => {
          const date = new Date(checkout.dateOfCheckout);
          const day = date.toLocaleDateString(); // Format date as "MM/DD/YYYY" or similar based on locale

          dailyIncome[day] = (dailyIncome[day] || 0) + checkout.totalPrice;
        });

        const chartData = Object.entries(dailyIncome)
          .sort(([, valueA], [, valueB]) => new Date(valueA[0]) - new Date(valueB[0])) // Sort by date
          .map(([day, total]) => ({ name: day, value: total }));

        setDailyIncomeData(chartData);
      } else {
        setDailyIncomeData(dataDummy);
      }
    }, [userData]);

    return (
      <div className='w-full h-full'>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={dailyIncomeData}
            margin={{ top: 20, right: 30, bottom: 20, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#4a5568" />
            <YAxis stroke="#4a5568" />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 6, stroke: '#000', strokeWidth: 2 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  export default IncomeChart;