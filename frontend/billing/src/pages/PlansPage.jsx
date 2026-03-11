import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:3001';
const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('billabear_token')}`,
});

export default function PlansPage() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingPlan, setEditingPlan] = useState(null);
    const [editPrice, setEditPrice] = useState('');

    const fetchPlans = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/data/plans`, { headers: getAuthHeaders() });
            const data = await res.json();
            if (data.success) setPlans(data.plans);
        } catch (err) {
            console.error('Failed to fetch plans:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPlans(); }, []);

    const handleEditStart = (plan) => {
        setEditingPlan(plan.id);
        setEditPrice(String(plan.price));
    };

    const handleEditSave = async (id) => {
        try {
            await fetch(`${API_BASE}/api/data/plans/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ price: parseFloat(editPrice) }),
            });
            await fetchPlans();
        } catch (err) {
            console.error('Failed to update plan:', err);
        }
        setEditingPlan(null);
    };

    const handleEditCancel = () => {
        setEditingPlan(null);
        setEditPrice('');
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[40vh]">
                <div className="flex flex-col items-center gap-4">
                    <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Loading plans...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Pricing Plans</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Manage your subscription plans and pricing
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`bg-surface-light dark:bg-surface-dark rounded-[2rem] shadow-sm overflow-hidden border-0 relative ${plan.popular ? 'ring-2 ring-primary shadow-lg shadow-primary/10' : ''}`}
                    >
                        {plan.popular && (
                            <div className="absolute top-6 right-6">
                                <span className="px-3 py-1 text-xs font-bold bg-primary text-white rounded-full">Most Popular</span>
                            </div>
                        )}

                        <div className={`h-2 bg-gradient-to-r ${plan.color}`} />

                        <div className="p-8">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>

                            <div className="flex items-baseline gap-1 mb-1">
                                {editingPlan === plan.id ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold text-slate-900 dark:text-white">₹</span>
                                        <input
                                            type="number"
                                            value={editPrice}
                                            onChange={(e) => setEditPrice(e.target.value)}
                                            className="w-24 text-3xl font-bold bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-1 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                                            autoFocus
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <span className="text-4xl font-bold text-slate-900 dark:text-white">₹{plan.price}</span>
                                        <span className="text-slate-500 dark:text-slate-400 font-medium">{plan.period}</span>
                                    </>
                                )}
                            </div>

                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                {plan.subscribers} active subscribers
                            </p>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                                        <span className="material-icons-round text-emerald-500 text-[18px]">check_circle</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <div className="flex items-center gap-2">
                                {editingPlan === plan.id ? (
                                    <>
                                        <button onClick={() => handleEditSave(plan.id)} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-full transition-colors">Save</button>
                                        <button onClick={handleEditCancel} className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">Cancel</button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => handleEditStart(plan)}
                                        className={`w-full px-4 py-2.5 text-sm font-medium rounded-full transition-colors ${plan.popular
                                            ? 'text-white bg-primary hover:bg-primary-dark shadow-md shadow-primary/30'
                                            : 'text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                                            }`}
                                    >
                                        Edit Price
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
