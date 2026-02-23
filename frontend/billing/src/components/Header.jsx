import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const dateRangeOptions = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Last 12 Months'];

export default function Header({ title, subtitle, onMenuToggle, onDateRangeChange }) {
    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const [selectedRange, setSelectedRange] = useState('Last 30 Days');
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDateDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleRangeSelect = (range) => {
        setSelectedRange(range);
        setShowDateDropdown(false);
        if (onDateRangeChange) onDateRangeChange(range);
    };

    return (
        <header className="flex-shrink-0 h-24 flex items-center justify-between px-8 z-10">
            <div className="flex items-center gap-4">
                <button
                    className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 bg-white dark:bg-surface-dark rounded-full shadow-sm"
                    onClick={onMenuToggle}
                >
                    <span className="material-icons-round">menu</span>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                        {title}
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Date Range Picker */}
                <div className="hidden sm:block relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowDateDropdown(!showDateDropdown)}
                        className="flex items-center bg-white dark:bg-surface-dark border-0 rounded-full shadow-sm px-4 py-2 cursor-pointer hover:shadow-md transition-all text-slate-600 dark:text-slate-300"
                    >
                        <span className="material-icons-round text-slate-400 text-sm mr-2">calendar_today</span>
                        <span className="text-sm font-medium">{selectedRange}</span>
                        <span className="material-icons-round text-slate-400 text-sm ml-2">expand_more</span>
                    </button>

                    {showDateDropdown && (
                        <div className="absolute right-0 top-full mt-2 bg-white dark:bg-surface-dark rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 min-w-[180px] z-50">
                            {dateRangeOptions.map((range) => (
                                <button
                                    key={range}
                                    onClick={() => handleRangeSelect(range)}
                                    className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${selectedRange === range
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Create Invoice Button */}
                <button
                    onClick={() => navigate('/dashboard/invoices?action=create')}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-primary dark:hover:bg-primary-dark text-white px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                    <span className="material-icons-round text-sm">add</span>
                    <span className="hidden sm:inline">Create Invoice</span>
                </button>
            </div>
        </header>
    );
}
