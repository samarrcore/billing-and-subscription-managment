import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const settingSections = [
    {
        id: 'general',
        label: 'Preferences',
        icon: 'tune',
        fields: [
            { key: 'language', label: 'Language', type: 'select', options: ['English', 'Spanish', 'French', 'German'], defaultValue: 'English' },
            { key: 'timezone', label: 'Timezone', type: 'select', options: ['UTC', 'US/Eastern', 'US/Pacific', 'Europe/London', 'Asia/Kolkata'], defaultValue: 'UTC' },
        ],
    },
    {
        id: 'notifications',
        label: 'Notifications',
        icon: 'notifications',
        fields: [
            { key: 'emailNotifs', label: 'Email Receipt', type: 'toggle', defaultValue: true },
            { key: 'paymentAlerts', label: 'Payment Method Expiry Alerts', type: 'toggle', defaultValue: true },
            { key: 'upcomingRenewal', label: 'Upcoming Renewal Reminders', type: 'toggle', defaultValue: true },
        ],
    },
];

export default function ViewerSettingsPage() {
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
        <div className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col space-y-6">
            <div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">Settings</h2>
                <p className="text-slate-400 max-w-lg">
                    Manage your account preferences and notification settings
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Section Nav */}
                <div className="md:w-56 flex-shrink-0">
                    <div className="bg-surface-dark rounded-[24px] shadow-lg border border-slate-800 p-3 space-y-1">
                        {settingSections.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setActiveSection(s.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${activeSection === s.id
                                    ? 'bg-primary/10 text-primary border border-primary/30'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                                {s.label}
                            </button>
                        ))}
                        <div className="border-t border-slate-800 my-2 pt-2">
                            <button
                                onClick={() => setActiveSection('account')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${activeSection === 'account'
                                    ? 'bg-primary/10 text-primary border border-primary/30'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[20px]">account_circle</span>
                                Account
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section Content */}
                <div className="flex-1">
                    {isAccountSection ? (
                        <div className="bg-surface-dark rounded-[24px] shadow-lg border border-slate-800 p-8 min-h-[500px]">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary">account_circle</span>
                                </div>
                                <h3 className="text-xl font-bold text-white">Account</h3>
                            </div>

                            {/* Current Account Info */}
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-6 bg-background-dark border border-slate-700 rounded-2xl mb-8">
                                <div
                                    className="bg-center bg-no-repeat bg-cover rounded-full h-16 w-16 border-2 border-slate-700 shadow-sm"
                                    style={{
                                        backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDSj5jY7G1SSXYigLN2DoRUoVJbULj6NR7SRc32FYlYwQ5Tw_oHt-TsO0aSj67nFuPQJJ19Pt91axgmwEl647vqCfGwnl7bFuoPUkKmZERUYFWTEyxpVLIkE4l7wSV7uJ6zh4DeJTqUoEx5LZEVsm1R4iG46vKIfHVAaSX_Cx7CDtMaLKKLDo68kifnmxdrWyjnxCIGktXfp4O9zNx8FEg1zLT_Lk6blLGDvH9WNYdR9RhUFaULWk4G-4VSAtGOebGAKZFefqu3i3E")`
                                    }}
                                ></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-lg font-bold text-white">Alex Morgan</p>
                                    <p className="text-sm text-slate-400">viewer@billabear.com</p>
                                    <p className="text-xs text-emerald-400 font-medium mt-1 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Active session
                                    </p>
                                </div>
                            </div>

                            {/* Account Actions */}
                            <div className="space-y-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between py-4 border-b border-slate-800 gap-4">
                                    <div>
                                        <p className="text-sm font-semibold text-white">Switch Account</p>
                                        <p className="text-xs text-slate-400 mt-0.5">Sign in with a different account</p>
                                    </div>
                                    <button
                                        onClick={handleSwitchAccount}
                                        className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all w-full md:w-auto"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
                                        Switch
                                    </button>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
                                    <div>
                                        <p className="text-sm font-semibold text-red-500">Log Out</p>
                                        <p className="text-xs text-slate-400 mt-0.5">Sign out of your current session</p>
                                    </div>
                                    <button
                                        onClick={() => setShowLogoutModal(true)}
                                        className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 rounded-xl transition-all shadow-lg w-full md:w-auto"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">logout</span>
                                        Log Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-surface-dark rounded-[24px] shadow-lg border border-slate-800 p-8 min-h-[500px] flex flex-col">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary">{section.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold text-white">{section.label}</h3>
                            </div>

                            <div className="space-y-6 flex-1">
                                {section.fields.map((field) => (
                                    <div key={field.key} className="flex flex-col md:flex-row md:items-center justify-between py-3 gap-3 border-b border-slate-800/50 last:border-0">
                                        <label className="text-sm font-medium text-slate-300">
                                            {field.label}
                                        </label>

                                        {field.type === 'text' && (
                                            <input
                                                type="text"
                                                value={values[field.key]}
                                                onChange={(e) => handleChange(field.key, e.target.value)}
                                                className="w-full md:w-64 px-4 py-2.5 bg-background-dark border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            />
                                        )}

                                        {field.type === 'select' && (
                                            <div className="relative w-full md:w-64">
                                                <select
                                                    value={values[field.key]}
                                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                                    className="w-full px-4 py-2.5 bg-background-dark border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                                                >
                                                    {field.options.map((opt) => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[20px]">
                                                    expand_more
                                                </span>
                                            </div>
                                        )}

                                        {field.type === 'toggle' && (
                                            <button
                                                onClick={() => handleChange(field.key, !values[field.key])}
                                                className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${values[field.key] ? 'bg-primary' : 'bg-slate-700'
                                                    }`}
                                            >
                                                <div
                                                    className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-all ${values[field.key] ? 'left-[26px]' : 'left-0.5'
                                                        }`}
                                                />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-800">
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg hover:shadow-xl"
                                >
                                    <span className="material-symbols-outlined text-sm">save</span>
                                    Save Changes
                                </button>
                                {saved && (
                                    <span className="flex items-center gap-1.5 text-sm text-emerald-400 font-medium animate-pulse">
                                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
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
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowLogoutModal(false)}>
                    <div className="bg-surface-dark border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-red-500">logout</span>
                            </div>
                            <h3 className="text-xl font-bold text-white">Log Out</h3>
                        </div>
                        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                            Are you sure you want to log out? You will need to sign in again to access your dashboard and manage your subscriptions.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-3 justify-end">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 border border-transparent rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-lg"
                            >
                                <span className="material-symbols-outlined text-[18px]">logout</span>
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
