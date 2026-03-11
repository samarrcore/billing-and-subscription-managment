import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = 'http://localhost:3001';
const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('billabear_token')}`,
});

function downloadInvoice(invoice) {
    const user = JSON.parse(localStorage.getItem('billabear_user') || '{}');
    const content = [
        '════════════════════════════════════════════',
        '              RECEIPT',
        '════════════════════════════════════════════',
        '',
        `  Invoice ID:   ${invoice.id}`,
        `  Date:         ${invoice.date}`,
        `  Plan:         ${invoice.plan}`,
        `  Amount:       ₹${new Intl.NumberFormat('en-IN').format(invoice.amount)}`,
        `  Status:       ${invoice.status.toUpperCase()}`,
        `  Method:       ${invoice.paymentMethod}`,
        '',
        '────────────────────────────────────────────',
        `  Billed To:    ${user.name || 'Viewer'}`,
        `  Email:        ${user.email || 'viewer@billabear.com'}`,
        '────────────────────────────────────────────',
        '',
        '════════════════════════════════════════════',
        '  Thank you for your payment!',
        '  Billabear Subscription Services',
        '════════════════════════════════════════════',
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoice.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export default function ViewerBillingHistoryPage() {
    const [allInvoices, setAllInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/viewer/billing-history`, { headers: getAuthHeaders() });
                const data = await res.json();
                if (data.success) setAllInvoices(data.invoices);
            } catch (err) {
                console.error('Failed to fetch billing history:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
    };

    const filteredInvoices = useMemo(() => {
        let results = allInvoices;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            results = results.filter((inv) => inv.id.toLowerCase().includes(q) || inv.plan.toLowerCase().includes(q));
        }
        if (statusFilter !== 'all') {
            results = results.filter((inv) => inv.status === statusFilter);
        }
        return results;
    }, [allInvoices, searchQuery, statusFilter]);

    if (loading) {
        return (
            <div className="w-full max-w-[1200px] mx-auto p-6 lg:p-10 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-slate-400 font-medium">Loading billing history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1200px] mx-auto p-6 lg:p-10 flex flex-col min-h-full">
            {/* Header */}
            <header className="flex flex-col gap-2 mb-8">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-2">
                    <Link to="/viewer" className="hover:text-primary transition-colors">Dashboard</Link>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <span className="text-white">Billing History</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white">Billing History</h1>
                </div>
            </header>

            {/* Container */}
            <div className="flex-1 bg-surface-dark rounded-3xl border border-slate-800 shadow-2xl p-6 lg:p-8 flex flex-col gap-8">
                {/* Search & Filter Controls */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:max-w-md">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500">
                            <span className="material-symbols-outlined">search</span>
                        </div>
                        <input
                            className="block w-full rounded-full border border-slate-700 bg-background-dark py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                            placeholder="Search invoice ID or plan..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 custom-scrollbar">
                        <button className="flex shrink-0 items-center justify-center gap-2 rounded-full border border-slate-700 bg-background-dark hover:bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-300 transition-colors">
                            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                            Date Range
                            <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
                        </button>
                        <select
                            className="flex shrink-0 items-center gap-2 rounded-full border border-slate-700 bg-background-dark hover:bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-300 transition-colors appearance-none cursor-pointer focus:outline-none focus:border-primary"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                            <option value="pending">Pending</option>
                        </select>
                        <button className="flex shrink-0 items-center justify-center gap-2 rounded-full border border-slate-700 bg-background-dark hover:bg-slate-800 px-5 py-3 text-sm font-semibold text-slate-300 transition-colors">
                            <span className="material-symbols-outlined text-[18px]">file_download</span>
                            Export
                        </button>
                    </div>
                </div>

                {/* Billing Records List */}
                <div className="flex-1 flex flex-col gap-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 ml-1">Recent Invoices</h2>

                    {filteredInvoices.length === 0 ? (
                        <div className="py-16 text-center bg-background-dark/50 rounded-2xl border border-slate-800/50">
                            <div className="flex flex-col items-center gap-3">
                                <span className="material-symbols-outlined text-4xl text-slate-600">search_off</span>
                                <p className="text-slate-400 font-medium pb-2">No invoices found</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {filteredInvoices.map((invoice) => (
                                <div key={invoice.id} className="group relative flex flex-col justify-between overflow-hidden gap-3 rounded-2xl border border-slate-800 bg-background-dark p-6 transition-all hover:border-primary/50 shadow-sm">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-slate-500">{invoice.id}</p>
                                            <h3 className="text-xl font-bold text-white">{invoice.plan}</h3>
                                            <p className="text-xs text-slate-400">{invoice.date} • {invoice.paymentMethod}</p>
                                        </div>
                                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-2">
                                            <span className="text-2xl sm:text-lg font-bold text-white">{formatCurrency(invoice.amount)}</span>
                                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border ${invoice.statusColor === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : invoice.statusColor === 'rose' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                                                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-5">
                                        {invoice.status === 'failed' && invoice.errorInfo ? (
                                            <p className="text-xs text-rose-400 flex items-center gap-1.5 font-medium">
                                                <span className="material-symbols-outlined text-[16px]">info</span>
                                                {invoice.errorInfo}
                                            </p>
                                        ) : (
                                            <button className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors group/view">
                                                <span className="material-symbols-outlined text-[20px] group-hover/view:text-primary transition-colors">visibility</span>
                                                View {invoice.status === 'pending' ? 'Details' : 'Receipt'}
                                            </button>
                                        )}
                                        {invoice.status === 'failed' ? (
                                            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors" title="Retry Payment">
                                                <span className="material-symbols-outlined text-[20px]">refresh</span>
                                            </button>
                                        ) : (
                                            <button onClick={() => downloadInvoice(invoice)} className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-sm" title="Download Invoice">
                                                <span className="material-symbols-outlined text-[20px]">download</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
