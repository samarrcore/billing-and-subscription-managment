import { useSearchParams, useNavigate } from 'react-router-dom';

const roleInfo = {
    billing: {
        icon: 'receipt_long',
        title: 'Billing Manager',
        description: 'The Billing Manager dashboard is currently being developed. This workspace will allow you to manage invoices, process payments, and handle billing-related tasks.',
    },
    viewer: {
        icon: 'visibility',
        title: 'Viewer',
        description: 'The Viewer dashboard is currently being developed. This workspace will provide read-only access to reports, analytics, and financial summaries.',
    },
};

export default function UnderDevelopmentPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const role = searchParams.get('role') || 'viewer';
    const info = roleInfo[role] || roleInfo.viewer;

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-6 font-display">
            <div className="max-w-lg w-full text-center">
                {/* Animated Icon */}
                <div className="relative inline-flex items-center justify-center mb-8">
                    <div className="absolute w-32 h-32 rounded-full bg-primary/5 animate-ping" style={{ animationDuration: '3s' }}></div>
                    <div className="absolute w-24 h-24 rounded-full bg-primary/10 animate-pulse"></div>
                    <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-xl shadow-primary/30">
                        <span className="material-icons-round text-white text-3xl">{info.icon}</span>
                    </div>
                </div>

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold mb-6">
                    <span className="material-icons-round text-[14px]">construction</span>
                    Under Development
                </div>

                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">{info.title} Dashboard</h1>
                <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-10 max-w-md mx-auto">{info.description}</p>

                {/* Progress Indicator */}
                <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-6 shadow-sm mb-8 max-w-sm mx-auto">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Development Progress</span>
                        <span className="text-xs font-bold text-primary">65%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full transition-all duration-1000"
                            style={{ width: '65%' }}
                        ></div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 text-xs text-slate-400 dark:text-slate-500">
                        <span className="material-icons-round text-[14px]">schedule</span>
                        Estimated completion: Coming soon
                    </div>
                </div>

                {/* Features Being Built */}
                <div className="grid grid-cols-3 gap-3 mb-10 max-w-sm mx-auto">
                    {[
                        { icon: 'analytics', label: 'Analytics' },
                        { icon: 'security', label: 'Permissions' },
                        { icon: 'notifications', label: 'Alerts' },
                    ].map((feature) => (
                        <div key={feature.label} className="bg-surface-light dark:bg-surface-dark rounded-2xl p-3 shadow-sm">
                            <span className="material-icons-round text-primary/40 text-xl mb-1 block">{feature.icon}</span>
                            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">{feature.label}</p>
                        </div>
                    ))}
                </div>

                {/* Back to Login */}
                <button
                    onClick={() => navigate('/login')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-full font-medium text-sm transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5"
                >
                    <span className="material-icons-round text-[18px]">arrow_back</span>
                    Back to Login
                </button>
            </div>
        </div>
    );
}
