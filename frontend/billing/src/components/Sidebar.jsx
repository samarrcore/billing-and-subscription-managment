import { NavLink, useNavigate } from 'react-router-dom';

const navItems = [
    { icon: 'dashboard', label: 'Dashboard', path: '/dashboard', roles: ['admin', 'billing'] },
    { icon: 'autorenew', label: 'Subscriptions', path: '/dashboard/subscriptions', roles: ['admin', 'billing'] },
    { icon: 'layers', label: 'Plans', path: '/dashboard/plans', roles: ['admin'] },
    { icon: 'group', label: 'Customers', path: '/dashboard/customers', roles: ['admin', 'billing'] },
    { icon: 'receipt_long', label: 'Invoices', path: '/dashboard/invoices', roles: ['admin', 'billing'] },
];

function getUserRole() {
    try {
        const user = JSON.parse(localStorage.getItem('billabear_user') || '{}');
        return user.role || 'admin';
    } catch {
        return 'admin';
    }
}

function getUserInfo() {
    try {
        const user = JSON.parse(localStorage.getItem('billabear_user') || '{}');
        return {
            name: user.name || 'Team User',
            email: user.email || 'user@billabear.com',
            role: user.role || 'admin',
        };
    } catch {
        return { name: 'Team User', email: 'user@billabear.com', role: 'admin' };
    }
}

export default function Sidebar({ isOpen, onClose }) {
    const navigate = useNavigate();
    const userRole = getUserRole();
    const userInfo = getUserInfo();
    const isAdmin = userRole === 'admin';

    const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole));

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
                    className="fixed inset-0 bg-black/40 z-30 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
          w-72 flex-shrink-0 border-r border-slate-200 dark:border-slate-800
          bg-surface-light dark:bg-surface-dark flex flex-col justify-between
          z-40 m-4 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none
          h-[calc(100vh-2rem)]
          fixed md:relative
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-[calc(100%+2rem)] md:translate-x-0'}
        `}
            >
                <div>
                    <div className="h-20 flex items-center px-8">
                        <div className="flex items-center gap-3 text-primary font-bold text-2xl">
                            <span className="material-icons-round text-3xl bg-primary/10 p-2 rounded-2xl">
                                savings
                            </span>
                            <span className="tracking-tight text-slate-900 dark:text-white">
                                Billabear
                            </span>
                        </div>
                    </div>

                    <nav className="px-4 py-2 space-y-2">
                        {filteredNavItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/dashboard'}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-full font-medium transition-all ${isActive
                                        ? 'bg-primary text-white shadow-md shadow-primary/30 hover:scale-[1.02]'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                                    }`
                                }
                            >
                                <span className="material-icons-round text-[20px]">{item.icon}</span>
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="p-4 m-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl">
                    <nav className="space-y-1 mb-2">
                        {isAdmin && (
                            <NavLink
                                to="/dashboard/settings"
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-2.5 rounded-full font-medium transition-all ${isActive
                                        ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-slate-200'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm hover:text-slate-900 dark:hover:text-slate-200'
                                    }`
                                }
                            >
                                <span className="material-icons-round text-[20px]">settings</span>
                                <span>Settings</span>
                            </NavLink>
                        )}
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full font-medium transition-all text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm hover:text-red-500"
                        >
                            <span className="material-icons-round text-[20px]">logout</span>
                            <span>Logout</span>
                        </button>
                    </nav>
                    <div className="flex items-center gap-3 px-2 py-2 mt-2 border-t border-slate-200 dark:border-slate-700 pt-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${isAdmin
                            ? 'bg-gradient-to-br from-primary/20 to-primary/40 text-primary'
                            : 'bg-gradient-to-br from-orange-200 to-orange-300 text-orange-700'
                            }`}>
                            {userInfo.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                {userInfo.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {userInfo.email}
                            </p>
                        </div>
                        {!isAdmin && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 px-2 py-0.5 rounded-full">
                                Billing
                            </span>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}
