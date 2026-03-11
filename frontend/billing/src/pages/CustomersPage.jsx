import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:3001';
const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('billabear_token')}`,
});

const statusStyles = {
    Active: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
    'Past Due': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    Churned: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400',
};

export default function CustomersPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/data/customers`, { headers: getAuthHeaders() });
                const data = await res.json();
                if (data.success) setCustomers(data.customers);
            } catch (err) {
                console.error('Failed to fetch customers:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    const filtered = customers.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[40vh]">
                <div className="flex flex-col items-center gap-4">
                    <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Loading customers...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Customers</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {customers.length} total customers
                    </p>
                </div>
                <div className="flex items-center bg-white dark:bg-surface-dark rounded-full shadow-sm px-4 py-2 min-w-[260px]">
                    <span className="material-icons-round text-slate-400 text-sm mr-2">search</span>
                    <input
                        type="text"
                        placeholder="Search customers..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent outline-none text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 w-full"
                    />
                    {search && (
                        <button onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600">
                            <span className="material-icons-round text-sm">close</span>
                        </button>
                    )}
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
                                <th className="px-6 py-5">Total Spent</th>
                                <th className="px-6 py-5">Joined</th>
                                <th className="px-8 py-5">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                            {filtered.map((customer) => (
                                <tr key={customer.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-primary dark:text-slate-300 font-bold text-xs shadow-sm">
                                                {customer.initials}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{customer.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{customer.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-300 font-medium">
                                        {customer.plan}
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${statusStyles[customer.status] || statusStyles['Churned']}`}>
                                            {customer.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-sm font-bold text-slate-900 dark:text-white">
                                        {customer.totalSpent}
                                    </td>
                                    <td className="px-6 py-5 text-sm text-slate-500 dark:text-slate-400">
                                        {customer.joined}
                                    </td>
                                    <td className="px-8 py-5">
                                        <button
                                            onClick={() => setSelectedCustomer(selectedCustomer?.id === customer.id ? null : customer)}
                                            className="px-3 py-1.5 text-xs font-medium text-primary bg-primary/5 hover:bg-primary/10 rounded-full transition-colors"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-8 py-12 text-center text-slate-400 dark:text-slate-500">
                                        No customers match your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Customer Detail Side Panel */}
            {selectedCustomer && (
                <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelectedCustomer(null)}>
                    <div className="absolute inset-0 bg-black/30" />
                    <div
                        className="relative w-full max-w-md bg-white dark:bg-surface-dark h-full shadow-2xl p-8 overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Customer Details</h3>
                            <button
                                onClick={() => setSelectedCustomer(null)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
                            >
                                <span className="material-icons-round">close</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center text-primary dark:text-slate-300 font-bold text-lg shadow-sm">
                                {selectedCustomer.initials}
                            </div>
                            <div>
                                <p className="text-xl font-bold text-slate-900 dark:text-white">{selectedCustomer.name}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{selectedCustomer.email}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: 'Plan', value: selectedCustomer.plan },
                                { label: 'Status', value: selectedCustomer.status },
                                { label: 'Total Spent', value: selectedCustomer.totalSpent },
                                { label: 'Joined', value: selectedCustomer.joined },
                            ].map((item) => (
                                <div key={item.label} className="flex justify-between py-3 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-sm text-slate-500 dark:text-slate-400">{item.label}</span>
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
