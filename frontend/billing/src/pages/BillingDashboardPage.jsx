import { useState } from 'react';

const monthlyRevenueData = [
    { month: 'Jan', value: 3200, pct: 26 },
    { month: 'Feb', value: 4500, pct: 36 },
    { month: 'Mar', value: 4000, pct: 32 },
    { month: 'Apr', value: 5500, pct: 44 },
    { month: 'May', value: 6000, pct: 48 },
    { month: 'Jun', value: 5000, pct: 40 },
    { month: 'Jul', value: 7500, pct: 60 },
    { month: 'Aug', value: 8000, pct: 64 },
    { month: 'Sep', value: 7000, pct: 56 },
    { month: 'Oct', value: 8500, pct: 68 },
    { month: 'Nov', value: 9000, pct: 72 },
    { month: 'Dec', value: 12450, pct: 95 },
];

const weeklyRevenueData = [
    { month: 'Mon', value: 1200, pct: 35 },
    { month: 'Tue', value: 1800, pct: 52 },
    { month: 'Wed', value: 2100, pct: 61 },
    { month: 'Thu', value: 1500, pct: 43 },
    { month: 'Fri', value: 2400, pct: 70 },
    { month: 'Sat', value: 900, pct: 26 },
    { month: 'Sun', value: 700, pct: 20 },
];

const dailyRevenueData = [
    { month: '1', value: 420, pct: 25 },
    { month: '5', value: 680, pct: 40 },
    { month: '10', value: 950, pct: 56 },
    { month: '15', value: 1100, pct: 65 },
    { month: '20', value: 780, pct: 46 },
    { month: '25', value: 1350, pct: 80 },
    { month: '30', value: 1600, pct: 95 },
];

const rangeOptions = [
    { label: '12 Months', key: 'yearly' },
    { label: '30 Days', key: 'monthly' },
    { label: '7 Days', key: 'weekly' },
];

const stats = [
    { title: 'MRR', value: '₹12,450', change: '+12%', positive: true, icon: 'monetization_on', iconBg: 'bg-primary/10', iconColor: 'text-primary', gradientFrom: 'from-primary/15' },
    { title: 'Active Subscribers', value: '1,240', change: '-3%', positive: false, icon: 'group', iconBg: 'bg-orange-100 dark:bg-orange-900/30', iconColor: 'text-orange-600 dark:text-orange-400', gradientFrom: 'from-orange-200/40 dark:from-orange-900/20' },
    { title: 'Churn Rate', value: '2.4%', change: '+0.5%', positive: true, icon: 'trending_down', iconBg: 'bg-indigo-100 dark:bg-indigo-900/30', iconColor: 'text-indigo-600 dark:text-indigo-400', gradientFrom: 'from-indigo-200/40 dark:from-indigo-900/20' },
    { title: 'Net Revenue', value: '₹45,200', change: '+8%', positive: true, icon: 'account_balance_wallet', iconBg: 'bg-emerald-100 dark:bg-emerald-900/30', iconColor: 'text-emerald-600 dark:text-emerald-400', gradientFrom: 'from-emerald-200/40 dark:from-emerald-900/20' },
];

const activityData = [
    { id: 1, status: 'Paid', statusBg: 'bg-emerald-100 dark:bg-emerald-900/30', statusText: 'text-emerald-700 dark:text-emerald-400', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeGYa53_XXpp2lLMkSJn_UTgbUoh92SlaX4DKO0Rc920yJ3pAERBlZpEmg7kTvd9osmlPWIINGQMrj5AxjPI2Juw0zoyddV3sf-OF2EEKXhg0OgiQpj_EIYNYc--e2XFYsKh3ZjyelXpd-VfkCT4MqJaMtIRT4MB7oWIQBlZKnMu4GygObU1_uTNAVN4dAsQ5nnvqRT2q931O4IsUr5r-bFa2657zCsddPNSjMJMvX8hfCs-1V0if501SHNLl736kRuB0j7RKTiAQ', name: 'Ayesha Khan', email: 'ayesha.k@example.com', event: 'Subscription Renewal', date: 'Oct 24, 2023', amount: '₹1,240', amountColor: '' },
    { id: 2, status: 'Pending', statusBg: 'bg-orange-100 dark:bg-orange-900/30', statusText: 'text-orange-700 dark:text-orange-400', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFdUBUHRT4gDh3U5r2jTTLovBDg1M1RuojbHYhUaMwnsaQYkhYtDKaJw62Z9ilcAW_UB5K1jboJ-XY85Tc4GIJelH0T4jlGbXvGBQ9C9rY0bchOS2EJEqbOlsad200MjSH6KT9o6xWYkLi9SeRWZfr-3ps2swHUiW2-RniLEk8VhRiBN3k65XLZpBEi3RYcGVtqph6h9ykhJxZh9AjTKxxoV0t-yPFcs95wgEwUj8IjuzcP973q-pXuwB_0rOawkmrW89hiFqY1o0', name: 'Rahul Sharma', email: 'rahul.s@enterprise.in', event: 'Upgrade (Pro)', date: 'Oct 23, 2023', amount: '₹4,500', amountColor: '' },
    { id: 3, status: 'Paid', statusBg: 'bg-emerald-100 dark:bg-emerald-900/30', statusText: 'text-emerald-700 dark:text-emerald-400', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtbA_f0TEy4XVmLPM1usv-3u6qn--uUWCO-qeUVVUhp9u6o65_71ydIJh7ZW-xwVAa3-Od9ctK9zfOYsDtWNrlfYmVXy4T2j--IH9kVrUVKheNFwihHd3xDp2GG7YF6cdeaPvyDDQu3LBDvV943k7g0F881_gQZ35TToZxLYtYEVwrdkI72l1OnkV-Jm6nwOuSF0t_x2r0mF5Ju9rw0xu6g7yfPDiItcKiHc_DqW1Y8VeoLs5tyt4wDKCqkk3trQ9XDbATYq0WBGk', name: 'Priya Mehta', email: 'mehta_priya@domain.com', event: 'Subscription Renewal', date: 'Oct 22, 2023', amount: '₹1,240', amountColor: '' },
    { id: 4, status: 'Failed', statusBg: 'bg-red-100 dark:bg-red-900/30', statusText: 'text-red-700 dark:text-red-400', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCoJTYbjBTqnAVxEutyaPCP8wr7slOLIDGB91blxzOoTTl9HiG1e1yWiM7Gf942eMzeQzQgb83lJF_hHZ_pwad-uQfw0WTAhJ5Zj2Vlom9TwNvKndrC9K2FUqT9G7ruiq5f7PhbfCQTVBVZfhKN283AnhfkMaw7WyMLlvle6EF9VruyClTWo-7okXwUwMT13_iSJOBBGoNNSar6LBZuwVx4pk_1KBdi3vVOng9paMUzYcMR1p1zAJU0thIQF-3JecCUnE9RAC8SjPs', name: 'Vikram Singh', email: 'v.singh@corporate.org', event: 'Add-on Purchase', date: 'Oct 21, 2023', amount: '₹899', amountColor: 'text-red-600 dark:text-red-400' },
];

export default function BillingDashboardPage() {
    const [activeRange, setActiveRange] = useState('yearly');
    const [hoveredBar, setHoveredBar] = useState(null);

    const dataMap = {
        yearly: monthlyRevenueData,
        monthly: dailyRevenueData,
        weekly: weeklyRevenueData,
    };
    const chartData = dataMap[activeRange];

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.title} className="bg-surface-light dark:bg-surface-dark p-6 rounded-[2rem] shadow-sm hover:shadow-lg transition-all duration-300 border-0 group relative overflow-hidden">
                        {/* Gradient fill at bottom */}
                        <div className={`absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t ${stat.gradientFrom} to-transparent pointer-events-none`}></div>

                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.title}</span>
                            <div className={`${stat.iconBg} p-2.5 rounded-xl`}>
                                <span className={`material-icons-round text-lg ${stat.iconColor}`}>{stat.icon}</span>
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2 mb-1 relative z-10">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                            <span className={`text-xs font-semibold ${stat.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>{stat.change}</span>
                        </div>
                        <p className="text-xs text-slate-400 relative z-10">vs last month</p>
                    </div>
                ))}
            </div>

            {/* Revenue Chart */}
            <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-[2rem] shadow-sm border-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Revenue Growth</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Overview of billing income trends</p>
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
                        {chartData.map((item, index) => {
                            const isLast = index === chartData.length - 1;
                            return (
                                <div
                                    key={`${activeRange}-${index}`}
                                    className={`flex-1 mx-1.5 rounded-2xl relative group cursor-pointer transition-all duration-300 hover:scale-y-105 origin-bottom ${isLast
                                        ? 'bg-gradient-to-t from-primary to-primary-dark shadow-xl shadow-primary/20'
                                        : 'bg-primary/10 hover:bg-primary/30'
                                        }`}
                                    style={{ height: `${item.pct}%` }}
                                    onMouseEnter={() => setHoveredBar(index)}
                                    onMouseLeave={() => setHoveredBar(null)}
                                >
                                    <div
                                        className={`absolute -top-10 left-1/2 -translate-x-1/2 text-white text-xs font-bold py-1.5 px-3 rounded-full shadow-lg whitespace-nowrap transition-opacity ${isLast
                                            ? 'bg-slate-900 opacity-100'
                                            : `bg-slate-800 ${hoveredBar === index ? 'opacity-100' : 'opacity-0'}`
                                            }`}
                                    >
                                        ₹{item.value.toLocaleString('en-IN')}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Trend line */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <path className="opacity-40" d="M2,70 C10,60 20,65 30,50 S50,45 60,30 S80,20 98,5" fill="none" stroke="#135bec" strokeLinecap="round" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
                    </svg>
                </div>

                {/* Month labels */}
                <div className="flex justify-between text-xs text-slate-400 mt-6 px-3 font-semibold uppercase tracking-wide">
                    {chartData.map((item) => (
                        <span key={item.month}>{item.month}</span>
                    ))}
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-[2rem] shadow-sm overflow-hidden border-0">
                <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</h2>
                    <button className="text-sm text-primary hover:text-primary-dark font-semibold bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-full transition-colors">
                        View All
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">
                            <tr>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-6 py-5">Customer</th>
                                <th className="px-6 py-5">Event Type</th>
                                <th className="px-6 py-5">Date</th>
                                <th className="px-6 py-5 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                            {activityData.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${item.statusBg} ${item.statusText}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <img src={item.avatar} alt={item.name} className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 object-cover" />
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{item.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-300 font-medium">{item.event}</td>
                                    <td className="px-6 py-5 text-sm text-slate-500 dark:text-slate-400">{item.date}</td>
                                    <td className={`px-6 py-5 text-sm font-bold text-right ${item.amountColor || 'text-slate-900 dark:text-white'}`}>{item.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
