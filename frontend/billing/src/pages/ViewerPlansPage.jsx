import { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const allInvoices = [
    { date: 'Oct 24, 2023', id: 'INV-2023-001', amount: '₹2,499', plan: 'Pro Plan - Monthly', status: 'paid' },
    { date: 'Sep 24, 2023', id: 'INV-2023-002', amount: '₹2,499', plan: 'Pro Plan - Monthly', status: 'paid' },
    { date: 'Aug 24, 2023', id: 'INV-2023-003', amount: '₹2,499', plan: 'Pro Plan - Monthly', status: 'pending' },
    { date: 'Jul 24, 2023', id: 'INV-2023-004', amount: '₹2,499', plan: 'Pro Plan - Monthly', status: 'paid' },
    { date: 'Jun 24, 2023', id: 'INV-2023-005', amount: '₹2,499', plan: 'Pro Plan - Monthly', status: 'paid' },
    { date: 'May 24, 2023', id: 'INV-2023-006', amount: '₹2,499', plan: 'Pro Plan - Monthly', status: 'paid' },
    { date: 'Apr 24, 2023', id: 'INV-2023-007', amount: '₹2,499', plan: 'Pro Plan - Monthly', status: 'paid' },
    { date: 'Mar 24, 2023', id: 'INV-2023-008', amount: '₹2,499', plan: 'Pro Plan - Monthly', status: 'paid' },
    { date: 'Feb 24, 2023', id: 'INV-2023-009', amount: '₹1,999', plan: 'Basic Plan - Monthly', status: 'paid' },
    { date: 'Jan 24, 2023', id: 'INV-2023-010', amount: '₹1,999', plan: 'Basic Plan - Monthly', status: 'paid' },
    { date: 'Dec 24, 2022', id: 'INV-2022-011', amount: '₹1,999', plan: 'Basic Plan - Monthly', status: 'paid' },
    { date: 'Nov 24, 2022', id: 'INV-2022-012', amount: '₹1,999', plan: 'Basic Plan - Monthly', status: 'pending' },
];

const statusConfig = {
    paid: {
        label: 'Paid',
        dotClass: 'bg-emerald-500',
        badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        animate: false,
    },
    pending: {
        label: 'Pending',
        dotClass: 'bg-amber-500',
        badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        animate: true,
    },
};

const dateRanges = [
    { label: 'All Time', value: 'all' },
    { label: 'Last 3 Months', value: '3' },
    { label: 'Last 6 Months', value: '6' },
    { label: 'Last 12 Months', value: '12' },
];

const ITEMS_PER_PAGE = 6;

function parseInvoiceDate(dateStr) {
    return new Date(dateStr);
}

function downloadInvoice(invoice) {
    const content = [
        '════════════════════════════════════════════',
        '              INVOICE',
        '════════════════════════════════════════════',
        '',
        `  Invoice ID:   ${invoice.id}`,
        `  Date:         ${invoice.date}`,
        `  Plan:         ${invoice.plan}`,
        `  Amount:       ${invoice.amount}`,
        `  Status:       ${invoice.status.toUpperCase()}`,
        '',
        '────────────────────────────────────────────',
        '  Billed To:    Alex Morgan',
        '  Email:        viewer@billabear.com',
        '────────────────────────────────────────────',
        '',
        '  Payment Method: •••• •••• •••• 4242',
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

export default function ViewerPlansPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showDateDropdown, setShowDateDropdown] = useState(false);

    const statusRef = useRef(null);
    const dateRef = useRef(null);

    // Close dropdowns on outside click
    useEffect(() => {
        function handleClickOutside(e) {
            if (statusRef.current && !statusRef.current.contains(e.target)) {
                setShowStatusDropdown(false);
            }
            if (dateRef.current && !dateRef.current.contains(e.target)) {
                setShowDateDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter invoices
    const filteredInvoices = useMemo(() => {
        let results = allInvoices;

        // Search filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            results = results.filter(
                (inv) =>
                    inv.id.toLowerCase().includes(q) ||
                    inv.amount.toLowerCase().includes(q) ||
                    inv.amount.replace('₹', '').toLowerCase().includes(q)
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            results = results.filter((inv) => inv.status === statusFilter);
        }

        // Date filter
        if (dateFilter !== 'all') {
            const months = parseInt(dateFilter, 10);
            const cutoff = new Date();
            cutoff.setMonth(cutoff.getMonth() - months);
            results = results.filter((inv) => parseInvoiceDate(inv.date) >= cutoff);
        }

        return results;
    }, [searchQuery, statusFilter, dateFilter]);

    // Reset page when filters change
    useMemo(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, dateFilter]);

    // Pagination
    const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE));
    const paginatedInvoices = filteredInvoices.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    const showingStart = filteredInvoices.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const showingEnd = Math.min(currentPage * ITEMS_PER_PAGE, filteredInvoices.length);

    return (
        <div className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col">
            {/* Breadcrumbs & Header */}
            <div className="mb-8">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                    <Link className="hover:text-primary transition-colors" to="/viewer">Overview</Link>
                    <span className="material-symbols-outlined text-xs">chevron_right</span>
                    <span className="text-slate-200 font-medium">My Plans</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">Billing &amp; Invoices</h1>
                        <p className="text-slate-400 max-w-lg">Manage your subscriptions, download past invoices, and view your complete payment history.</p>
                    </div>
                </div>
            </div>

            {/* Main Card Container */}
            <div className="bg-surface-dark rounded-[24px] shadow-lg border border-slate-800 overflow-hidden flex flex-col min-h-[600px]">
                {/* Table Toolbar */}
                <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-dark">
                    <div className="relative w-full sm:w-96 group">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">search</span>
                        <input
                            className="w-full pl-10 pr-4 py-2.5 bg-background-dark border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm placeholder:text-slate-500 text-white"
                            placeholder="Search by Invoice ID or Amount..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        {/* Date Filter */}
                        <div className="relative" ref={dateRef}>
                            <button
                                onClick={() => { setShowDateDropdown(!showDateDropdown); setShowStatusDropdown(false); }}
                                className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-all shadow-sm ${dateFilter !== 'all'
                                    ? 'bg-primary/10 border-primary/30 text-primary'
                                    : 'bg-background-dark border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                                <span>{dateFilter === 'all' ? 'Filter Date' : dateRanges.find(d => d.value === dateFilter)?.label}</span>
                                <span className="material-symbols-outlined text-[16px]">expand_more</span>
                            </button>
                            {showDateDropdown && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-surface-dark rounded-xl shadow-xl border border-slate-700 py-2 z-50">
                                    {dateRanges.map((range) => (
                                        <button
                                            key={range.value}
                                            onClick={() => { setDateFilter(range.value); setShowDateDropdown(false); }}
                                            className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${dateFilter === range.value
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-slate-300 hover:bg-slate-800'
                                                }`}
                                        >
                                            {range.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Status Filter */}
                        <div className="relative" ref={statusRef}>
                            <button
                                onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowDateDropdown(false); }}
                                className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-all shadow-sm ${statusFilter !== 'all'
                                    ? 'bg-primary/10 border-primary/30 text-primary'
                                    : 'bg-background-dark border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[20px]">filter_list</span>
                                <span>{statusFilter === 'all' ? 'Status' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}</span>
                                <span className="material-symbols-outlined text-[16px]">expand_more</span>
                            </button>
                            {showStatusDropdown && (
                                <div className="absolute right-0 top-full mt-2 w-40 bg-surface-dark rounded-xl shadow-xl border border-slate-700 py-2 z-50">
                                    {[
                                        { label: 'All', value: 'all' },
                                        { label: 'Paid', value: 'paid' },
                                        { label: 'Pending', value: 'pending' },
                                    ].map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => { setStatusFilter(opt.value); setShowStatusDropdown(false); }}
                                            className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${statusFilter === opt.value
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-slate-300 hover:bg-slate-800'
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-800/30">
                                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice ID</th>
                                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Plan</th>
                                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="py-4 px-6 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-sm">
                            {paginatedInvoices.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-16 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <span className="material-symbols-outlined text-4xl text-slate-600">search_off</span>
                                            <p className="text-slate-400 font-medium">No invoices found</p>
                                            <p className="text-slate-500 text-xs">Try adjusting your search or filter criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                paginatedInvoices.map((invoice) => {
                                    const config = statusConfig[invoice.status];
                                    return (
                                        <tr key={invoice.id} className="group hover:bg-slate-700/30 transition-colors">
                                            <td className="py-4 px-6 font-medium text-white">{invoice.date}</td>
                                            <td className="py-4 px-6 text-slate-300 font-mono">{invoice.id}</td>
                                            <td className="py-4 px-6 font-semibold text-white">{invoice.amount}</td>
                                            <td className="py-4 px-6 text-slate-300">{invoice.plan}</td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.badgeClass}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass} ${config.animate ? 'animate-pulse' : ''}`}></span>
                                                    {config.label}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <button
                                                    onClick={() => downloadInvoice(invoice)}
                                                    className="inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-primary hover:bg-primary/10 transition-colors"
                                                    title="Download Invoice"
                                                >
                                                    <span className="material-symbols-outlined">download</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-6 border-t border-slate-800 flex items-center justify-between bg-surface-dark">
                    <span className="text-sm text-slate-500">
                        {filteredInvoices.length === 0 ? (
                            'No results'
                        ) : (
                            <>Showing <span className="font-medium text-white">{showingStart}-{showingEnd}</span> of <span className="font-medium text-white">{filteredInvoices.length}</span> invoices</>
                        )}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 rounded-lg border border-slate-700 text-sm font-medium text-slate-400 hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-slate-500 px-2">
                            Page <span className="text-white font-medium">{currentPage}</span> of <span className="text-white font-medium">{totalPages}</span>
                        </span>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 rounded-lg border border-slate-700 text-sm font-medium text-slate-300 hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer Info */}
            <div className="mt-8 flex items-center justify-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">lock</span>
                    <span>Payments processed securely via Stripe</span>
                </div>
                <span>•</span>
                <a className="hover:underline hover:text-slate-300" href="#">Terms of Service</a>
                <span>•</span>
                <a className="hover:underline hover:text-slate-300" href="#">Privacy Policy</a>
            </div>
        </div>
    );
}
