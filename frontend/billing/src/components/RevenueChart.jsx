import { useState } from 'react';

const monthlyData = [
    { month: 'Jan', value: 3200, height: '30%' },
    { month: 'Feb', value: 4500, height: '45%' },
    { month: 'Mar', value: 4000, height: '40%' },
    { month: 'Apr', value: 5500, height: '55%' },
    { month: 'May', value: 6000, height: '60%' },
    { month: 'Jun', value: 5000, height: '50%' },
    { month: 'Jul', value: 7500, height: '75%' },
    { month: 'Aug', value: 8000, height: '80%' },
    { month: 'Sep', value: 7000, height: '70%' },
    { month: 'Oct', value: 8500, height: '85%' },
    { month: 'Nov', value: 9000, height: '90%' },
    { month: 'Dec', value: 12450, height: '95%' },
];

const weeklyData = [
    { month: 'Mon', value: 1200, height: '35%' },
    { month: 'Tue', value: 1800, height: '52%' },
    { month: 'Wed', value: 2100, height: '61%' },
    { month: 'Thu', value: 1500, height: '43%' },
    { month: 'Fri', value: 2400, height: '70%' },
    { month: 'Sat', value: 900, height: '26%' },
    { month: 'Sun', value: 700, height: '20%' },
];

const dailyData = [
    { month: '1', value: 420, height: '25%' },
    { month: '5', value: 680, height: '40%' },
    { month: '10', value: 950, height: '56%' },
    { month: '15', value: 1100, height: '65%' },
    { month: '20', value: 780, height: '46%' },
    { month: '25', value: 1350, height: '80%' },
    { month: '30', value: 1600, height: '95%' },
];

const rangeOptions = [
    { label: '12 Months', key: 'yearly' },
    { label: '30 Days', key: 'monthly' },
    { label: '7 Days', key: 'weekly' },
];

export default function RevenueChart() {
    const [activeRange, setActiveRange] = useState('yearly');
    const [hoveredBar, setHoveredBar] = useState(null);

    const dataMap = {
        yearly: monthlyData,
        monthly: dailyData,
        weekly: weeklyData,
    };

    const data = dataMap[activeRange];

    return (
        <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-[2rem] shadow-sm border-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Revenue Growth</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {activeRange === 'yearly'
                            ? 'Annual recurring revenue over the last 12 months'
                            : activeRange === 'monthly'
                                ? 'Daily revenue over the last 30 days'
                                : 'Daily revenue over the last 7 days'}
                    </p>
                </div>
                <div className="flex items-center gap-1 mt-4 sm:mt-0 bg-slate-100 dark:bg-slate-800 p-1 rounded-full">
                    {rangeOptions.map((option) => (
                        <button
                            key={option.key}
                            onClick={() => setActiveRange(option.key)}
                            className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors ${activeRange === option.key
                                ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm font-bold'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative h-80 w-full px-2">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between text-slate-200 dark:text-slate-700 pointer-events-none">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-full border-t border-dashed border-current opacity-60" />
                    ))}
                </div>

                {/* Bars */}
                <div className="absolute inset-0 flex items-end justify-between px-2 pt-4 pb-0">
                    {data.map((item, index) => {
                        const isLast = index === data.length - 1;
                        return (
                            <div
                                key={`${activeRange}-${index}`}
                                className={`flex-1 mx-1.5 rounded-2xl relative group cursor-pointer transition-all duration-300 hover:scale-y-105 origin-bottom ${isLast
                                    ? 'bg-gradient-to-t from-primary to-primary-dark shadow-xl shadow-primary/20'
                                    : 'bg-primary/10 hover:bg-primary/30'
                                    }`}
                                style={{ height: item.height }}
                                onMouseEnter={() => setHoveredBar(index)}
                                onMouseLeave={() => setHoveredBar(null)}
                            >
                                <div
                                    className={`absolute -top-10 left-1/2 -translate-x-1/2 text-white text-xs font-bold py-1.5 px-3 rounded-full shadow-lg whitespace-nowrap transition-opacity ${isLast
                                        ? 'bg-slate-900 opacity-100'
                                        : `bg-slate-800 ${hoveredBar === index ? 'opacity-100' : 'opacity-0'}`
                                        }`}
                                >
                                    ₹{item.value.toLocaleString()}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Trend line */}
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    preserveAspectRatio="none"
                    viewBox="0 0 100 100"
                >
                    <path
                        className="opacity-40"
                        d="M2,70 C10,60 20,65 30,50 S50,45 60,30 S80,20 98,5"
                        fill="none"
                        stroke="#135bec"
                        strokeLinecap="round"
                        strokeWidth="0.8"
                        vectorEffect="non-scaling-stroke"
                    />
                </svg>
            </div>

            {/* Month labels */}
            <div className="flex justify-between text-xs text-slate-400 mt-6 px-3 font-semibold uppercase tracking-wide">
                {data.map((item) => (
                    <span key={item.month}>{item.month}</span>
                ))}
            </div>
        </div>
    );
}
