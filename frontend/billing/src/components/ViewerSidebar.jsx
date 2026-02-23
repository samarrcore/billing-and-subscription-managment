import { NavLink, useNavigate } from 'react-router-dom';

const navItems = [
    { icon: 'dashboard', label: 'Overview', path: '/viewer' },
    { icon: 'credit_card', label: 'My Plans', path: '/viewer/plans' },
    { icon: 'history', label: 'Billing History', path: '/viewer/billing-history' },
    { icon: 'account_balance_wallet', label: 'Payment Methods', path: '/viewer/payment-methods' },
];

export default function ViewerSidebar({ isOpen, onClose }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('billabear_token');
        localStorage.removeItem('billabear_user');
        navigate('/login');
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-30 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
                    w-72 flex-shrink-0 border-r border-slate-800
                    bg-surface-dark flex flex-col justify-between
                    z-40 m-4 rounded-3xl shadow-xl shadow-black/30
                    h-[calc(100vh-2rem)]
                    fixed lg:relative
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-[calc(100%+2rem)] lg:translate-x-0'}
                `}
            >
                <div>
                    {/* Logo */}
                    <div className="h-20 flex items-center px-8">
                        <div className="flex items-center gap-3 text-primary font-bold text-2xl">
                            <span className="material-icons-round text-3xl bg-primary/10 p-2 rounded-2xl">
                                savings
                            </span>
                            <span className="tracking-tight text-white">
                                Billabear
                            </span>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="px-4 py-2 space-y-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/viewer'}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-full font-medium transition-all ${isActive
                                        ? 'bg-primary text-white shadow-md shadow-primary/30 hover:scale-[1.02]'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                    }`
                                }
                            >
                                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Bottom Section */}
                <div className="p-4 m-4 bg-slate-800/50 rounded-3xl">
                    <nav className="space-y-1 mb-2">
                        <NavLink
                            to="/viewer/settings"
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-full font-medium transition-all ${isActive
                                    ? 'bg-slate-800 shadow-sm text-slate-200'
                                    : 'text-slate-400 hover:bg-slate-800 hover:shadow-sm hover:text-slate-200'
                                }`
                            }
                        >
                            <span className="material-icons-round text-[20px]">settings</span>
                            <span>Settings</span>
                        </NavLink>
                    </nav>
                    <div className="flex items-center gap-3 px-2 py-2 mt-2 border-t border-slate-700 pt-4">
                        <div
                            className="w-10 h-10 rounded-full border-2 border-slate-700 shadow-sm bg-center bg-no-repeat bg-cover"
                            style={{
                                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDSj5jY7G1SSXYigLN2DoRUoVJbULj6NR7SRc32FYlYwQ5Tw_oHt-TsO0aSj67nFuPQJJ19Pt91axgmwEl647vqCfGwnl7bFuoPUkKmZERUYFWTEyxpVLIkE4l7wSV7uJ6zh4DeJTqUoEx5LZEVsm1R4iG46vKIfHVAaSX_Cx7CDtMaLKKLDo68kifnmxdrWyjnxCIGktXfp4O9zNx8FEg1zLT_Lk6blLGDvH9WNYdR9RhUFaULWk4G-4VSAtGOebGAKZFefqu3i3E")`
                            }}
                        ></div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                                Alex Morgan
                            </p>
                            <p className="text-xs text-slate-400 truncate">
                                viewer@billabear.com
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
