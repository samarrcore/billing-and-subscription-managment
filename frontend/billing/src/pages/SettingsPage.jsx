import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const settingSections = [
    {
        id: 'general',
        label: 'General',
        icon: 'tune',
        fields: [
            { key: 'companyName', label: 'Company Name', type: 'text', defaultValue: 'Billabear' },
            { key: 'currency', label: 'Default Currency', type: 'select', options: ['INR', 'USD', 'EUR', 'GBP', 'JPY'], defaultValue: 'INR' },
            { key: 'timezone', label: 'Timezone', type: 'select', options: ['UTC', 'US/Eastern', 'US/Pacific', 'Europe/London', 'Asia/Kolkata'], defaultValue: 'UTC' },
        ],
    },
    {
        id: 'notifications',
        label: 'Notifications',
        icon: 'notifications',
        fields: [
            { key: 'emailNotifs', label: 'Email Notifications', type: 'toggle', defaultValue: true },
            { key: 'paymentAlerts', label: 'Payment Failure Alerts', type: 'toggle', defaultValue: true },
            { key: 'weeklyReport', label: 'Weekly Revenue Report', type: 'toggle', defaultValue: false },
            { key: 'newSubAlert', label: 'New Subscription Alerts', type: 'toggle', defaultValue: true },
        ],
    },
    {
        id: 'billing',
        label: 'Billing',
        icon: 'credit_card',
        fields: [
            { key: 'autoRetry', label: 'Auto-retry Failed Payments', type: 'toggle', defaultValue: true },
            { key: 'retryAttempts', label: 'Retry Attempts', type: 'select', options: ['1', '2', '3', '5'], defaultValue: '3' },
            { key: 'gracePeriod', label: 'Grace Period (days)', type: 'select', options: ['0', '3', '7', '14', '30'], defaultValue: '7' },
        ],
    },
];

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState('general');
    const [saved, setSaved] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        setShowLogoutModal(false);
        localStorage.removeItem('billabear_token');
        localStorage.removeItem('billabear_user');
        navigate('/login');
    };

    const handleSwitchAccount = () => {
        localStorage.removeItem('billabear_token');
        localStorage.removeItem('billabear_user');
        navigate('/login');
    };

    const initValues = {};
    settingSections.forEach((section) => {
        section.fields.forEach((field) => {
            initValues[field.key] = field.defaultValue;
        });
    });

    const [values, setValues] = useState(initValues);

    const handleChange = (key, value) => {
        setValues((prev) => ({ ...prev, [key]: value }));
        setSaved(false);
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const section = settingSections.find((s) => s.id === activeSection);
    const isAccountSection = activeSection === 'account';

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Settings</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Manage your billing system preferences
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Section Nav */}
                <div className="md:w-56 flex-shrink-0">
                    <div className="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-sm p-3 space-y-1">
                        {settingSections.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setActiveSection(s.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${activeSection === s.id
                                    ? 'bg-primary text-white shadow-md shadow-primary/30'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <span className="material-icons-round text-[20px]">{s.icon}</span>
                                {s.label}
                            </button>
                        ))}
                        <div className="border-t border-slate-200 dark:border-slate-700 my-2 pt-2">
                            <button
                                onClick={() => setActiveSection('account')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${activeSection === 'account'
                                    ? 'bg-primary text-white shadow-md shadow-primary/30'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <span className="material-icons-round text-[20px]">account_circle</span>
                                Account
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section Content */}
                <div className="flex-1">
                    {isAccountSection ? (
                        <div className="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-sm p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <span className="material-icons-round text-primary">account_circle</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Account</h3>
                            </div>

                            {/* Current Account Info */}
                            <div className="flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl mb-8">
                                <img
                                    alt="Profile"
                                    className="w-14 h-14 rounded-full border-2 border-white dark:border-slate-700 shadow-sm"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDO8bebcCf-yB7eitoM0pE7ITDGMYUb4gQ1j-RxIBUSvkLosbcndeXPL7uo0ToEH-YRdR78nEb2Sz1iiVVYC_kDrpi_CQ7dFDfsD3NHBkUFfx7BVjqhDWQa1oanAwjk9W-cmhFS4dTo_ajKP0MxU6F-iP6jc4lZcC2gL-J48rRO5JpkcAgn5dVGFnyOzzd9ITfjFVRQkqgrxeD3Y8JCqgCKZeKWaporyXDCY54_LADLfsX8CaWxu2UpB_ak8IpisHJT8Ri8kCLSO4Q"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-base font-bold text-slate-900 dark:text-white">Admin User</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">admin@billabear.com</p>
                                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                        Active session
                                    </p>
                                </div>
                            </div>

                            {/* Account Actions */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Switch Account</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Sign in with a different account</p>
                                    </div>
                                    <button
                                        onClick={handleSwitchAccount}
                                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-all"
                                    >
                                        <span className="material-icons-round text-[18px]">swap_horiz</span>
                                        Switch
                                    </button>
                                </div>

                                <div className="flex items-center justify-between py-4">
                                    <div>
                                        <p className="text-sm font-semibold text-red-600 dark:text-red-400">Log Out</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Sign out of your current session</p>
                                    </div>
                                    <button
                                        onClick={() => setShowLogoutModal(true)}
                                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                    >
                                        <span className="material-icons-round text-[18px]">logout</span>
                                        Log Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-surface-light dark:bg-surface-dark rounded-3xl shadow-sm p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <span className="material-icons-round text-primary">{section.icon}</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{section.label}</h3>
                            </div>

                            <div className="space-y-6">
                                {section.fields.map((field) => (
                                    <div key={field.key} className="flex items-center justify-between py-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            {field.label}
                                        </label>

                                        {field.type === 'text' && (
                                            <input
                                                type="text"
                                                value={values[field.key]}
                                                onChange={(e) => handleChange(field.key, e.target.value)}
                                                className="w-64 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary border-0"
                                            />
                                        )}

                                        {field.type === 'select' && (
                                            <select
                                                value={values[field.key]}
                                                onChange={(e) => handleChange(field.key, e.target.value)}
                                                className="w-64 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary border-0 cursor-pointer"
                                            >
                                                {field.options.map((opt) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        )}

                                        {field.type === 'toggle' && (
                                            <button
                                                onClick={() => handleChange(field.key, !values[field.key])}
                                                className={`w-12 h-7 rounded-full transition-colors relative ${values[field.key] ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'
                                                    }`}
                                            >
                                                <div
                                                    className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 transition-all ${values[field.key] ? 'left-6' : 'left-1'
                                                        }`}
                                                />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-4 mt-10 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg hover:shadow-xl"
                                >
                                    <span className="material-icons-round text-sm">save</span>
                                    Save Changes
                                </button>
                                {saved && (
                                    <span className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400 font-medium animate-pulse">
                                        <span className="material-icons-round text-[16px]">check_circle</span>
                                        Settings saved successfully!
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowLogoutModal(false)}>
                    <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <span className="material-icons-round text-red-600 dark:text-red-400">logout</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Log Out</h3>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                            Are you sure you want to log out? You will need to sign in again to access your billing dashboard.
                        </p>
                        <div className="flex items-center gap-3 justify-end">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-full transition-colors shadow-lg"
                            >
                                <span className="material-icons-round text-[16px]">logout</span>
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
