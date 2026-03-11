import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:3001';
const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('billabear_token')}`,
});

const statusStyles = {
    emerald: {
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
        text: 'text-emerald-700 dark:text-emerald-400',
        dot: 'bg-emerald-500 shadow-sm shadow-emerald-500/50',
    },
    blue: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-700 dark:text-blue-400',
        dot: 'bg-blue-500 shadow-sm shadow-blue-500/50',
    },
    red: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-400',
        dot: 'bg-red-500 shadow-sm shadow-red-500/50',
    },
    orange: {
        bg: 'bg-orange-100 dark:bg-orange-900/30',
        text: 'text-orange-700 dark:text-orange-400',
        dot: 'bg-orange-500 shadow-sm shadow-orange-500/50',
    },
    slate: {
        bg: 'bg-slate-100 dark:bg-slate-800',
        text: 'text-slate-500 dark:text-slate-400',
        dot: 'bg-slate-500 shadow-sm shadow-slate-500/50',
    },
};

export default function ActivityTable() {
    const [openMenuId, setOpenMenuId] = useState(null);
    const [activityData, setActivityData] = useState([]);
    const [loading, setLoading] = useState(true);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/data/recent-activity`, { headers: getAuthHeaders() });
                const data = await res.json();
                if (data.success) setActivityData(data.activities);
            } catch (err) {
                console.error('Failed to fetch activity:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchActivity();
    }, []);

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenuId(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAction = (action, item) => {
        setOpenMenuId(null);
        switch (action) {
            case 'view':
                navigate(`/dashboard/customers?id=${item.id}`);
                break;
            case 'invoice':
                navigate(`/dashboard/invoices?customer=${encodeURIComponent(item.name)}`);
                break;
            case 'retry':
                alert(`Retrying payment for ${item.name}...`);
                break;
            default:
                break;
        }
    };

    return (
        <div className="bg-surface-light dark:bg-surface-dark rounded-[2rem] shadow-sm overflow-hidden border-0">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</h2>
                <button
                    onClick={() => navigate('/dashboard/invoices')}
                    className="text-sm text-primary hover:text-primary-dark font-semibold bg-primary/5 hover:bg-primary/10 px-4 py-2 rounded-full transition-colors"
                >
                    View All
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">
                        <tr>
                            <th className="px-8 py-5 rounded-tl-[1rem]">Status</th>
                            <th className="px-6 py-5">Customer</th>
                            <th className="px-6 py-5">Event Type</th>
                            <th className="px-6 py-5">Date</th>
                            <th className="px-6 py-5 text-right">Amount</th>
                            <th className="px-8 py-5 rounded-tr-[1rem]"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {loading ? (
                            [...Array(4)].map((_, i) => (
                                <tr key={i}>
                                    <td className="px-8 py-5"><div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse"></div></td>
                                    <td className="px-6 py-5"><div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div></td>
                                    <td className="px-6 py-5"><div className="h-6 w-28 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div></td>
                                    <td className="px-6 py-5"><div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div></td>
                                    <td className="px-6 py-5"><div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse ml-auto"></div></td>
                                    <td className="px-8 py-5"></td>
                                </tr>
                            ))
                        ) : (
                            activityData.map((item) => {
                                const style = statusStyles[item.statusColor] || statusStyles.slate;
                                return (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                                    >
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${style.bg} ${style.text}`}
                                            >
                                                <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${item.initialsGradient} flex items-center justify-center ${item.initialsTextColor} font-bold text-xs shadow-sm`}
                                                >
                                                    {item.initials}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-300 font-medium">
                                            {item.eventType}
                                        </td>
                                        <td className="px-6 py-5 text-sm text-slate-500 dark:text-slate-400">
                                            {item.date}
                                        </td>
                                        <td className="px-6 py-5 text-right font-bold text-slate-900 dark:text-white">
                                            {item.amount}
                                        </td>
                                        <td className="px-8 py-5 text-right relative">
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-primary transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <span className="material-icons-round text-lg">more_horiz</span>
                                            </button>

                                            {openMenuId === item.id && (
                                                <div
                                                    ref={menuRef}
                                                    className="absolute right-8 top-full mt-1 bg-white dark:bg-surface-dark rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 min-w-[160px] z-50"
                                                >
                                                    <button
                                                        onClick={() => handleAction('view', item)}
                                                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                                                    >
                                                        <span className="material-icons-round text-[16px]">visibility</span>
                                                        View Details
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction('invoice', item)}
                                                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                                                    >
                                                        <span className="material-icons-round text-[16px]">receipt</span>
                                                        View Invoice
                                                    </button>
                                                    {item.status === 'Failed' && (
                                                        <button
                                                            onClick={() => handleAction('retry', item)}
                                                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 flex items-center gap-2"
                                                        >
                                                            <span className="material-icons-round text-[16px]">refresh</span>
                                                            Retry Payment
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
