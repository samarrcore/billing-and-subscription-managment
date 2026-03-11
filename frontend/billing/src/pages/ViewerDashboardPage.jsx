import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_BASE = 'http://localhost:3001';
const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('billabear_token')}`,
});

export default function ViewerDashboardPage() {
    const navigate = useNavigate();
    const [openDropdown, setOpenDropdown] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('default');
    const [filterState, setFilterState] = useState('all');

    const filterRef = useRef(null);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const sortRef = useRef(null);
    const [showSortDropdown, setShowSortDropdown] = useState(false);

    // Plan change state
    const [changePlanModal, setChangePlanModal] = useState(null); // subId
    const [availablePlans, setAvailablePlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [changingPlan, setChangingPlan] = useState(false);
    const [prorationResult, setProrationResult] = useState(null);

    // Fetch subscriptions from API
    const fetchSubscriptions = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/viewer/subscriptions`, { headers: getAuthHeaders() });
            const data = await res.json();
            if (data.success) setSubscriptions(data.subscriptions);
        } catch (err) {
            console.error('Failed to fetch subscriptions:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSubscriptions(); }, []);

    useEffect(() => {
        function handleClickOutside(e) {
            if (filterRef.current && !filterRef.current.contains(e.target)) setShowFilterDropdown(false);
            if (sortRef.current && !sortRef.current.contains(e.target)) setShowSortDropdown(false);
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = (id) => {
        setOpenDropdown(openDropdown === id ? null : id);
    };

    const handleAction = async (id, action) => {
        try {
            const res = await fetch(`${API_BASE}/api/viewer/subscriptions/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ action }),
            });
            const data = await res.json();
            if (data.success) {
                setSubscriptions(subs => subs.map(sub =>
                    sub.id === id ? data.subscription : sub
                ));
            }
        } catch (err) {
            console.error('Failed to update subscription:', err);
        }
        setOpenDropdown(null);
    };

    const openChangePlan = async (subId) => {
        setOpenDropdown(null);
        setChangePlanModal(subId);
        setSelectedPlan(null);
        setProrationResult(null);
        try {
            const res = await fetch(`${API_BASE}/api/viewer/plans`, { headers: getAuthHeaders() });
            const data = await res.json();
            if (data.success) setAvailablePlans(data.plans);
        } catch (err) {
            console.error('Failed to fetch plans:', err);
        }
    };

    const confirmChangePlan = async () => {
        if (!selectedPlan || !changePlanModal) return;
        setChangingPlan(true);
        try {
            const res = await fetch(`${API_BASE}/api/viewer/subscriptions/${changePlanModal}/change-plan`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ planId: selectedPlan }),
            });
            const data = await res.json();
            if (data.success) {
                setProrationResult(data.proration);
                setSubscriptions(subs => subs.map(sub =>
                    sub.id === changePlanModal ? data.subscription : sub
                ));
            }
        } catch (err) {
            console.error('Failed to change plan:', err);
        } finally {
            setChangingPlan(false);
        }
    };

    const totalSpend = subscriptions.filter(s => s.state === 'active').reduce((acc, curr) => acc + curr.cost, 0);
    const activePlansCount = subscriptions.filter(s => s.state === 'active').length;
    const activeSubsGtNow = subscriptions.filter(s => s.state === 'active').sort((a, b) => a.timestamp - b.timestamp);
    const nextBillingDateState = activeSubsGtNow.length > 0 ? activeSubsGtNow[0] : null;

    const filteredAndSortedSubs = useMemo(() => {
        let result = [...subscriptions];
        if (filterState !== 'all') result = result.filter(s => s.state === filterState);
        if (sortOrder === 'cost') result.sort((a, b) => b.cost - a.cost);
        else if (sortOrder === 'date') result.sort((a, b) => a.timestamp - b.timestamp);
        return result;
    }, [subscriptions, sortOrder, filterState]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
    };

    const getStatusBadgeClass = (color) => {
        if (color === 'orange') return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
        if (color === 'green') return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
        if (color === 'slate') return 'bg-slate-800 text-slate-400 border border-slate-700';
        if (color === 'red') return 'bg-red-500/10 text-red-400 border border-red-500/20';
        return 'bg-slate-800 text-slate-400 border border-slate-700';
    };

    // Current sub being changed
    const changingSub = subscriptions.find(s => s.id === changePlanModal);

    if (loading) {
        return (
            <div className="w-full max-w-[1200px] mx-auto p-6 lg:p-10 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-slate-400 font-medium">Loading your subscriptions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1200px] mx-auto p-6 lg:p-10 flex flex-col gap-10">
            {/* Header Section */}
            <header className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-2">
                    <span>Dashboard</span>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <span className="text-primary">Overview</span>
                </div>
                <div className="flex flex-wrap justify-between items-end gap-4">
                    <div>
                        <h1 className="text-white text-3xl lg:text-4xl font-extrabold tracking-tight">My Subscriptions</h1>
                        <p className="text-slate-400 text-base mt-2">Manage your active plans, track spending, and handle renewals.</p>
                    </div>
                    <button onClick={() => navigate('/viewer/plans')} className="bg-primary hover:bg-primary-dark text-white transition-colors rounded-full px-6 py-3 text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Add New Service
                    </button>
                </div>
            </header>

            {/* Summary Cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface-dark p-6 lg:p-8 rounded-2xl shadow-lg shadow-black/10 flex flex-col justify-between h-full border border-slate-800 group transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-primary/10 rounded-full text-primary"><span className="material-symbols-outlined">payments</span></div>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">trending_up</span>+2.4%
                        </span>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-medium mb-1">Total Monthly Spend</p>
                        <p className="text-white text-3xl lg:text-4xl font-extrabold tracking-tight">{formatCurrency(totalSpend)}</p>
                    </div>
                </div>

                <div className="bg-surface-dark p-6 lg:p-8 rounded-2xl shadow-lg shadow-black/10 flex flex-col justify-between h-full border border-slate-800 group transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-500/10 rounded-full text-orange-400"><span className="material-symbols-outlined">event</span></div>
                        {nextBillingDateState && (<span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-bold">Upcoming</span>)}
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-medium mb-1">Next Billing Date</p>
                        <p className="text-white text-2xl lg:text-3xl font-bold tracking-tight">{nextBillingDateState ? nextBillingDateState.dateStr : '-'}</p>
                        <p className="text-slate-500 text-sm mt-1">{nextBillingDateState ? nextBillingDateState.name : 'No active subscriptions'}</p>
                    </div>
                </div>

                <div className="bg-surface-dark p-6 lg:p-8 rounded-2xl shadow-lg shadow-black/10 flex flex-col justify-between h-full border border-slate-800 group transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-500/10 rounded-full text-purple-400"><span className="material-symbols-outlined">layers</span></div>
                        <button onClick={() => navigate('/viewer/plans')} className="text-primary text-sm font-bold hover:underline transition-all">View All Plans</button>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-medium mb-1">Active Services</p>
                        <p className="text-white text-2xl lg:text-3xl font-bold tracking-tight">{activePlansCount} Plans</p>
                        <div className="flex -space-x-2 mt-3 overflow-hidden">
                            {subscriptions.filter(s => s.state === 'active').slice(0, 3).map((sub) => (
                                <img key={sub.id} alt={sub.name} className="inline-block h-6 w-6 rounded-full ring-2 ring-surface-dark object-contain bg-slate-800 p-0.5" src={sub.icon} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Active Subscriptions List */}
            <section className="flex flex-col gap-6">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-white text-xl font-bold">Subscriptions</h2>
                    <div className="flex gap-2">
                        <div className="relative" ref={filterRef}>
                            <button onClick={() => setShowFilterDropdown(!showFilterDropdown)} className={`p-2 rounded-full transition-colors flex items-center justify-center ${filterState !== 'all' ? 'bg-primary/20 text-primary' : 'hover:bg-slate-800 text-slate-400'}`} title="Filter by Status">
                                <span className="material-symbols-outlined">filter_list</span>
                            </button>
                            {showFilterDropdown && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-surface-dark rounded-xl shadow-xl border border-slate-700 py-2 z-30">
                                    {['all', 'active', 'paused', 'cancelled'].map(opt => (
                                        <button key={opt} onClick={() => { setFilterState(opt); setShowFilterDropdown(false); }} className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${filterState === opt ? 'bg-primary/10 text-primary' : 'text-slate-300 hover:bg-slate-800'}`}>
                                            {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="relative" ref={sortRef}>
                            <button onClick={() => setShowSortDropdown(!showSortDropdown)} className={`p-2 rounded-full transition-colors flex items-center justify-center ${sortOrder !== 'default' ? 'bg-primary/20 text-primary' : 'hover:bg-slate-800 text-slate-400'}`} title="Sort Subscriptions">
                                <span className="material-symbols-outlined">sort</span>
                            </button>
                            {showSortDropdown && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-surface-dark rounded-xl shadow-xl border border-slate-700 py-2 z-30">
                                    <button onClick={() => { setSortOrder('default'); setShowSortDropdown(false); }} className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${sortOrder === 'default' ? 'bg-primary/10 text-primary' : 'text-slate-300 hover:bg-slate-800'}`}>Default</button>
                                    <button onClick={() => { setSortOrder('cost'); setShowSortDropdown(false); }} className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${sortOrder === 'cost' ? 'bg-primary/10 text-primary' : 'text-slate-300 hover:bg-slate-800'}`}>Cost (High to Low)</button>
                                    <button onClick={() => { setSortOrder('date'); setShowSortDropdown(false); }} className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${sortOrder === 'date' ? 'bg-primary/10 text-primary' : 'text-slate-300 hover:bg-slate-800'}`}>Next Billing Date</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {filteredAndSortedSubs.length === 0 ? (
                        <div className="bg-surface-dark rounded-2xl p-12 flex flex-col items-center justify-center gap-4 border border-slate-800">
                            <span className="material-symbols-outlined text-4xl text-slate-600">search_off</span>
                            <p className="text-slate-400 font-medium pb-2">No subscriptions found.</p>
                            {(filterState !== 'all' || sortOrder !== 'default') && (
                                <button onClick={() => { setFilterState('all'); setSortOrder('default'); }} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-xl transition-all">Clear Filters</button>
                            )}
                        </div>
                    ) : (
                        filteredAndSortedSubs.map((sub) => (
                            <div key={sub.id} className={`bg-surface-dark rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-lg shadow-black/10 border border-slate-800 hover:border-slate-700 transition-all ${sub.state !== 'active' ? 'opacity-75' : ''}`}>
                                <div className={`flex-shrink-0 h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 ${sub.state !== 'active' ? 'grayscale' : ''}`}>
                                    <img alt={sub.name} className="w-8 h-8 object-contain" src={sub.icon} />
                                </div>
                                <div className="flex-grow flex flex-col gap-1">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h3 className={`text-lg font-bold ${sub.state === 'cancelled' ? 'text-slate-400 line-through' : 'text-white'}`}>{sub.name}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadgeClass(sub.statusColor)}`}>{sub.status}</span>
                                    </div>
                                    <p className="text-slate-400 text-sm">{sub.description}</p>
                                </div>
                                <div className="flex flex-row md:flex-col justify-between w-full md:w-auto md:text-right gap-1 items-center md:items-end border-t md:border-t-0 border-slate-800 pt-4 md:pt-0 mt-2 md:mt-0">
                                    <span className="text-lg font-bold text-white">{formatCurrency(sub.cost)}<span className="text-sm font-normal text-slate-500">/mo</span></span>
                                    {sub.state !== 'cancelled' ? (
                                        <span className="text-xs text-slate-500 font-medium">{sub.nextAction}: {sub.dateStr}</span>
                                    ) : (
                                        <span className="text-xs text-red-500/70 font-medium">Cancelled</span>
                                    )}
                                </div>
                                <div className="flex-shrink-0 w-full md:w-auto relative">
                                    {sub.state === 'active' ? (
                                        <>
                                            <button onClick={() => toggleDropdown(sub.id)} className="w-full md:w-auto px-6 py-2.5 rounded-full bg-slate-800 text-slate-300 font-bold text-sm hover:bg-primary hover:text-white transition-all border border-slate-700 hover:border-primary flex items-center justify-center gap-2 group/btn">
                                                <span>Manage</span>
                                                <span className="material-symbols-outlined text-[18px] group-hover/btn:rotate-90 transition-transform">expand_more</span>
                                            </button>
                                            {openDropdown === sub.id && (
                                                <div className="absolute right-0 top-full mt-2 w-56 bg-surface-dark rounded-xl shadow-xl border border-slate-700 p-2 z-20">
                                                    <button onClick={() => openChangePlan(sub.id)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-primary transition-colors cursor-pointer">
                                                        <span className="material-symbols-outlined text-[18px]">swap_vert</span>Change Plan
                                                    </button>
                                                    <div className="h-px bg-slate-700 my-1"></div>
                                                    <button onClick={() => handleAction(sub.id, 'pause')} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-amber-500 transition-colors cursor-pointer">
                                                        <span className="material-symbols-outlined text-[18px]">pause</span>Pause Subscription
                                                    </button>
                                                    <div className="h-px bg-slate-700 my-1"></div>
                                                    <button onClick={() => handleAction(sub.id, 'cancel')} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer">
                                                        <span className="material-symbols-outlined text-[18px]">cancel</span>Cancel Sub
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    ) : sub.state === 'paused' ? (
                                        <button onClick={() => handleAction(sub.id, 'resume')} className="w-full md:w-auto px-6 py-2.5 rounded-full bg-slate-800 text-slate-300 font-bold text-sm hover:bg-emerald-600 hover:text-white transition-all border border-slate-700 hover:border-emerald-500 flex items-center justify-center gap-2 group/btn">
                                            <span>Resume</span>
                                            <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                                        </button>
                                    ) : (
                                        <button onClick={() => handleAction(sub.id, 'resume')} className="w-full md:w-auto px-6 py-2.5 rounded-full bg-slate-800 text-slate-500 font-bold text-sm hover:bg-emerald-600 hover:text-white transition-all border border-slate-700 hover:border-emerald-500 flex items-center justify-center gap-2 group/btn">
                                            <span>Restart</span>
                                            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Quick Tip Section */}
            <div className="mt-4 rounded-2xl bg-primary/5 border border-primary/10 p-4 flex items-start gap-4">
                <div className="bg-surface-dark rounded-full p-2 text-primary shadow-sm shrink-0 border border-slate-800">
                    <span className="material-symbols-outlined">lightbulb</span>
                </div>
                <div>
                    <h4 className="text-white font-bold text-sm">Did you know?</h4>
                    <p className="text-slate-400 text-sm mt-1">You can save up to 20% by switching your Adobe Creative Cloud subscription to an annual plan. <Link to="/viewer/plans" className="text-primary font-bold hover:underline transition-all">Check annual pricing</Link></p>
                </div>
            </div>

            <footer className="mt-auto py-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
                <p>© 2026 Billabear Inc. All rights reserved.</p>
                <div className="flex gap-6">
                    <button className="hover:text-slate-300 transition-colors">Privacy Policy</button>
                    <button className="hover:text-slate-300 transition-colors">Terms of Service</button>
                    <button className="hover:text-slate-300 transition-colors">Help Center</button>
                </div>
            </footer>

            {/* ── Change Plan Modal ─────────────────────────────────── */}
            {changePlanModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => { setChangePlanModal(null); setProrationResult(null); }}>
                    <div className="bg-surface-dark rounded-3xl border border-slate-700 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary">swap_vert</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Change Plan</h3>
                                    <p className="text-sm text-slate-400">{changingSub?.name}</p>
                                </div>
                            </div>
                            <button onClick={() => { setChangePlanModal(null); setProrationResult(null); }} className="w-8 h-8 rounded-full hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Proration Success Result */}
                        {prorationResult ? (
                            <div className="p-6 space-y-6">
                                <div className="text-center py-4">
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                                        <span className="material-symbols-outlined text-emerald-400 text-3xl">check_circle</span>
                                    </div>
                                    <h4 className="text-xl font-bold text-white mb-1">
                                        Plan {prorationResult.isUpgrade ? 'Upgraded' : 'Downgraded'}!
                                    </h4>
                                    <p className="text-slate-400">
                                        {prorationResult.oldPlan} → {prorationResult.newPlan}
                                    </p>
                                </div>

                                <div className="bg-slate-800/50 rounded-2xl p-5 space-y-3">
                                    <h5 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">Proration Details</h5>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Days remaining in cycle</span>
                                        <span className="text-white font-medium">{prorationResult.daysRemaining} of {prorationResult.totalDays} days</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Credit from {prorationResult.oldPlan}</span>
                                        <span className="text-emerald-400 font-medium">-{formatCurrency(prorationResult.creditFromOld)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Charge for {prorationResult.newPlan}</span>
                                        <span className="text-white font-medium">+{formatCurrency(prorationResult.chargeForNew)}</span>
                                    </div>
                                    <div className="border-t border-slate-700 pt-3 flex justify-between">
                                        <span className="text-white font-bold">Net adjustment</span>
                                        <span className={`font-bold text-lg ${prorationResult.prorationAmount >= 0 ? 'text-white' : 'text-emerald-400'}`}>
                                            {prorationResult.prorationAmount >= 0 ? '+' : ''}{formatCurrency(prorationResult.prorationAmount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm pt-1">
                                        <span className="text-slate-400">New monthly price</span>
                                        <span className="text-white font-bold">{formatCurrency(prorationResult.newPrice)}/mo</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Next billing date</span>
                                        <span className="text-white font-medium">{prorationResult.nextBillingDate}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => { setChangePlanModal(null); setProrationResult(null); }}
                                    className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-full font-bold text-sm transition-all"
                                >
                                    Done
                                </button>
                            </div>
                        ) : (
                            /* Plan Selection */
                            <div className="p-6 space-y-4">
                                <p className="text-sm text-slate-400 mb-2">
                                    Current plan: <span className="text-white font-semibold">{changingSub?.description}</span> at <span className="text-white font-semibold">{changingSub && formatCurrency(changingSub.cost)}/mo</span>
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {availablePlans.map((plan) => {
                                        const isCurrent = changingSub && plan.price === changingSub.cost;
                                        const isSelected = selectedPlan === plan.id;
                                        const isUpgrade = changingSub && plan.price > changingSub.cost;
                                        return (
                                            <button
                                                key={plan.id}
                                                disabled={isCurrent}
                                                onClick={() => setSelectedPlan(plan.id)}
                                                className={`relative text-left p-5 rounded-2xl border-2 transition-all ${
                                                    isCurrent
                                                        ? 'border-slate-700 bg-slate-800/50 opacity-50 cursor-not-allowed'
                                                        : isSelected
                                                            ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                                                            : 'border-slate-700 bg-slate-800/30 hover:border-slate-600 cursor-pointer'
                                                }`}
                                            >
                                                {isCurrent && (
                                                    <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-700 px-2 py-0.5 rounded-full">Current</span>
                                                )}
                                                {plan.popular && !isCurrent && (
                                                    <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">Popular</span>
                                                )}
                                                <h4 className="text-white font-bold text-sm mb-1">{plan.name}</h4>
                                                <p className="text-2xl font-extrabold text-white mb-1">
                                                    {formatCurrency(plan.price)}
                                                    <span className="text-sm font-normal text-slate-500">{plan.period}</span>
                                                </p>
                                                {!isCurrent && (
                                                    <span className={`text-xs font-bold ${isUpgrade ? 'text-emerald-400' : 'text-orange-400'}`}>
                                                        {isUpgrade ? '↑ Upgrade' : '↓ Downgrade'}
                                                    </span>
                                                )}
                                                <ul className="mt-3 space-y-1.5">
                                                    {plan.features.slice(0, 3).map((f, i) => (
                                                        <li key={i} className="text-xs text-slate-400 flex items-center gap-1.5">
                                                            <span className="material-symbols-outlined text-[14px] text-emerald-500">check</span>
                                                            {f}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </button>
                                        );
                                    })}
                                </div>

                                {selectedPlan && (
                                    <div className="bg-slate-800/50 rounded-xl p-4 flex items-center justify-between">
                                        <div className="text-sm text-slate-300">
                                            <span className="text-white font-semibold">{availablePlans.find(p => p.id === selectedPlan)?.name}</span> — your billing will be prorated automatically
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3 pt-2">
                                    <button
                                        onClick={() => { setChangePlanModal(null); setProrationResult(null); }}
                                        className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full font-bold text-sm transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmChangePlan}
                                        disabled={!selectedPlan || changingPlan}
                                        className="flex-1 py-3 bg-primary hover:bg-primary-dark text-white rounded-full font-bold text-sm transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {changingPlan ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </>
                                        ) : 'Confirm Change'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
