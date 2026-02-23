import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const initialInvoices = [
    { id: 'INV-001', customer: 'Acme Corp', email: 'enterprise@acme.com', amount: '₹499.00', status: 'Paid', date: '2026-02-16', dueDate: '2026-03-15' },
    { id: 'INV-002', customer: 'John Doe', email: 'john@example.com', amount: '₹120.00', status: 'Paid', date: '2026-02-16', dueDate: '2026-03-10' },
    { id: 'INV-003', customer: 'Startup Inc', email: 'billing@startup.io', amount: '₹29.00', status: 'Overdue', date: '2026-01-20', dueDate: '2026-02-20' },
    { id: 'INV-004', customer: 'Design Lab', email: 'hello@designlab.co', amount: '₹850.00', status: 'Paid', date: '2026-02-16', dueDate: '2026-03-01' },
    { id: 'INV-005', customer: 'TechFlow', email: 'team@techflow.dev', amount: '₹499.00', status: 'Draft', date: '2026-02-15', dueDate: '2026-03-15' },
    { id: 'INV-006', customer: 'CloudBase', email: 'admin@cloudbase.io', amount: '₹120.00', status: 'Sent', date: '2026-02-14', dueDate: '2026-03-14' },
];

const statusStyles = {
    Paid: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
    Overdue: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    Draft: 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400',
    Sent: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
};

export default function InvoicesPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [invoices, setInvoices] = useState(initialInvoices);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [filter, setFilter] = useState('All');
    const [newInvoice, setNewInvoice] = useState({
        customer: '',
        email: '',
        amount: '',
    });

    useEffect(() => {
        if (searchParams.get('action') === 'create') {
            setShowCreateModal(true);
            setSearchParams({});
        }
        if (searchParams.get('customer')) {
            // Could filter by customer if arrived from ActivityTable
        }
    }, [searchParams, setSearchParams]);

    const handleCreate = () => {
        if (!newInvoice.customer || !newInvoice.amount) return;
        const id = `INV-${String(invoices.length + 1).padStart(3, '0')}`;
        setInvoices((prev) => [
            {
                id,
                customer: newInvoice.customer,
                email: newInvoice.email || 'N/A',
                amount: `₹${parseFloat(newInvoice.amount).toFixed(2)}`,
                status: 'Draft',
                date: new Date().toISOString().split('T')[0],
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            },
            ...prev,
        ]);
        setNewInvoice({ customer: '', email: '', amount: '' });
        setShowCreateModal(false);
    };

    const handleSend = (id) => {
        setInvoices((prev) =>
            prev.map((inv) => (inv.id === id ? { ...inv, status: 'Sent' } : inv))
        );
    };

    const handleMarkPaid = (id) => {
        setInvoices((prev) =>
            prev.map((inv) => (inv.id === id ? { ...inv, status: 'Paid' } : inv))
        );
    };

    const handleDelete = (id) => {
        setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    };

    const filtered = filter === 'All' ? invoices : invoices.filter((inv) => inv.status === filter);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Invoices</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Manage and track all invoices
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-full">
                        {['All', 'Draft', 'Sent', 'Paid', 'Overdue'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${filter === f
                                    ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm font-bold'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-primary dark:hover:bg-primary-dark text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        <span className="material-icons-round text-sm">add</span>
                        New Invoice
                    </button>
                </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark rounded-[2rem] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">
                            <tr>
                                <th className="px-8 py-5">Invoice</th>
                                <th className="px-6 py-5">Customer</th>
                                <th className="px-6 py-5">Status</th>
                                <th className="px-6 py-5">Date</th>
                                <th className="px-6 py-5">Due Date</th>
                                <th className="px-6 py-5 text-right">Amount</th>
                                <th className="px-8 py-5">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                            {filtered.map((inv) => (
                                <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-8 py-5 text-sm font-bold text-primary">{inv.id}</td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{inv.customer}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{inv.email}</p>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${statusStyles[inv.status]}`}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-sm text-slate-500 dark:text-slate-400">{inv.date}</td>
                                    <td className="px-6 py-5 text-sm text-slate-500 dark:text-slate-400">{inv.dueDate}</td>
                                    <td className="px-6 py-5 text-right text-sm font-bold text-slate-900 dark:text-white">{inv.amount}</td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            {inv.status === 'Draft' && (
                                                <>
                                                    <button
                                                        onClick={() => handleSend(inv.id)}
                                                        className="px-3 py-1.5 text-xs font-medium text-primary bg-primary/5 hover:bg-primary/10 rounded-full transition-colors"
                                                    >
                                                        Send
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(inv.id)}
                                                        className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                            {(inv.status === 'Sent' || inv.status === 'Overdue') && (
                                                <button
                                                    onClick={() => handleMarkPaid(inv.id)}
                                                    className="px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-full transition-colors"
                                                >
                                                    Mark Paid
                                                </button>
                                            )}
                                            {inv.status === 'Paid' && (
                                                <span className="text-xs text-slate-400">Completed</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-8 py-12 text-center text-slate-400 dark:text-slate-500">
                                        No invoices found for this filter.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Invoice Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowCreateModal(false)}>
                    <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <span className="material-icons-round text-primary">receipt_long</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Create New Invoice</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Customer Name *
                                </label>
                                <input
                                    type="text"
                                    value={newInvoice.customer}
                                    onChange={(e) => setNewInvoice({ ...newInvoice, customer: e.target.value })}
                                    placeholder="e.g. Acme Corp"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-primary border-0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={newInvoice.email}
                                    onChange={(e) => setNewInvoice({ ...newInvoice, email: e.target.value })}
                                    placeholder="e.g. billing@acme.com"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-primary border-0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Amount *
                                </label>
                                <input
                                    type="number"
                                    value={newInvoice.amount}
                                    onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                                    placeholder="e.g. 499.00"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-primary border-0"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 justify-end mt-8">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                disabled={!newInvoice.customer || !newInvoice.amount}
                                className="px-5 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-full transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Create Invoice
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
