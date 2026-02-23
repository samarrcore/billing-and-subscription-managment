import { useState } from 'react';

const initialSubscriptions = [
    { id: 1, customer: 'Acme Corp', plan: 'Enterprise', status: 'Active', amount: '₹499.00/mo', nextBilling: '2026-03-15', startDate: '2025-03-15' },
    { id: 2, customer: 'John Doe', plan: 'Pro', status: 'Active', amount: '₹120.00/mo', nextBilling: '2026-03-10', startDate: '2025-09-10' },
    { id: 3, customer: 'Startup Inc', plan: 'Starter', status: 'Past Due', amount: '₹29.00/mo', nextBilling: '2026-02-20', startDate: '2025-06-20' },
    { id: 4, customer: 'Design Lab', plan: 'Pro', status: 'Active', amount: '₹120.00/mo', nextBilling: '2026-03-01', startDate: '2025-01-01' },
    { id: 5, customer: 'TechFlow', plan: 'Enterprise', status: 'Cancelled', amount: '₹499.00/mo', nextBilling: '—', startDate: '2024-11-15' },
];

const statusStyles = {
    Active: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
    'Past Due': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    Cancelled: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400',
};

export default function SubscriptionsPage() {
    const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
    const [filter, setFilter] = useState('All');
    const [showCancelModal, setShowCancelModal] = useState(null);

    const filtered = filter === 'All' ? subscriptions : subscriptions.filter((s) => s.status === filter);

    const handleCancel = (id) => {
        setSubscriptions((prev) =>
            prev.map((s) => (s.id === id ? { ...s, status: 'Cancelled', nextBilling: '—' } : s))
        );
        setShowCancelModal(null);
    };

    const handleReactivate = (id) => {
        setSubscriptions((prev) =>
            prev.map((s) => (s.id === id ? { ...s, status: 'Active', nextBilling: '2026-04-01' } : s))
        );
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">All Subscriptions</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Manage and monitor all customer subscriptions
                    </p>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-full">
                    {['All', 'Active', 'Past Due', 'Cancelled'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 text-xs font-medium rounded-full transition-colors ${filter === f
                                ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm font-bold'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark rounded-[2rem] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">
                            <tr>
                                <th className="px-8 py-5">Customer</th>
                                <th className="px-6 py-5">Plan</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5">Amount</th>
                                <th className="px-6 py-5">Next Billing</th>
                                <th className="px-8 py-5">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                            {filtered.map((sub) => (
                                <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-8 py-5 text-sm font-semibold text-slate-900 dark:text-white">
                                        {sub.customer}
                                    </td>
                                    <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-300 font-medium">
                                        {sub.plan}
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${statusStyles[sub.status]}`}>
                                            {sub.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-bold text-slate-900 dark:text-white">
                                        {sub.amount}
                                    </td>
                                    <td className="px-6 py-5 text-sm text-slate-500 dark:text-slate-400">
                                        {sub.nextBilling}
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            {sub.status === 'Active' || sub.status === 'Past Due' ? (
                                                <button
                                                    onClick={() => setShowCancelModal(sub.id)}
                                                    className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleReactivate(sub.id)}
                                                    className="px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-full transition-colors"
                                                >
                                                    Reactivate
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-8 py-12 text-center text-slate-400 dark:text-slate-500">
                                        No subscriptions found for this filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowCancelModal(null)}>
                    <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <span className="material-icons-round text-red-600 dark:text-red-400">warning</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Cancel Subscription</h3>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                            Are you sure you want to cancel this subscription? The customer will lose access at the end of their current billing period.
                        </p>
                        <div className="flex items-center gap-3 justify-end">
                            <button
                                onClick={() => setShowCancelModal(null)}
                                className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                            >
                                Keep Active
                            </button>
                            <button
                                onClick={() => handleCancel(showCancelModal)}
                                className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-full transition-colors shadow-lg"
                            >
                                Cancel Subscription
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
