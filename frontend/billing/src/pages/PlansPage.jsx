import { useState } from 'react';

const initialPlans = [
    {
        id: 1,
        name: 'Starter',
        price: '₹29',
        period: '/mo',
        features: ['Up to 100 customers', 'Basic analytics', 'Email support', '1 team member'],
        color: 'from-slate-500 to-slate-600',
        popular: false,
        subscribers: 85,
    },
    {
        id: 2,
        name: 'Pro',
        price: '₹120',
        period: '/mo',
        features: ['Up to 1,000 customers', 'Advanced analytics', 'Priority support', '5 team members', 'API access'],
        color: 'from-primary to-primary-dark',
        popular: true,
        subscribers: 210,
    },
    {
        id: 3,
        name: 'Enterprise',
        price: '₹499',
        period: '/mo',
        features: ['Unlimited customers', 'Custom analytics', 'Dedicated support', 'Unlimited team', 'API access', 'Custom integrations'],
        color: 'from-indigo-500 to-purple-600',
        popular: false,
        subscribers: 125,
    },
];

export default function PlansPage() {
    const [plans, setPlans] = useState(initialPlans);
    const [editingPlan, setEditingPlan] = useState(null);
    const [editPrice, setEditPrice] = useState('');

    const handleEditStart = (plan) => {
        setEditingPlan(plan.id);
        setEditPrice(plan.price.replace('₹', ''));
    };

    const handleEditSave = (id) => {
        setPlans((prev) =>
            prev.map((p) => (p.id === id ? { ...p, price: `₹${editPrice}` } : p))
        );
        setEditingPlan(null);
    };

    const handleEditCancel = () => {
        setEditingPlan(null);
        setEditPrice('');
    };

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
                        className={`bg-surface-light dark:bg-surface-dark rounded-[2rem] shadow-sm overflow-hidden border-0 relative ${plan.popular ? 'ring-2 ring-primary shadow-lg shadow-primary/10' : ''
                            }`}
                    >
                        {plan.popular && (
                            <div className="absolute top-6 right-6">
                                <span className="px-3 py-1 text-xs font-bold bg-primary text-white rounded-full">
                                    Most Popular
                                </span>
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
                                        <span className="text-4xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
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
                                        <button
                                            onClick={() => handleEditSave(plan.id)}
                                            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-full transition-colors"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={handleEditCancel}
                                            className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                                        >
                                            Cancel
                                        </button>
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
