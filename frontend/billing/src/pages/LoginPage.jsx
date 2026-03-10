import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const roles = [
    { value: 'team', label: 'Team', icon: 'groups' },
    { value: 'viewer', label: 'Viewer', icon: 'visibility' },
];

const API_BASE = 'http://localhost:3001';

export default function LoginPage() {
    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState('team');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const clearForm = () => {
        setEmail('');
        setPassword('');
        setName('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isRegister) {
                // Registration
                const res = await fetch(`${API_BASE}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, name }),
                });
                const data = await res.json();
                if (!data.success) {
                    setError(data.message);
                    setLoading(false);
                    return;
                }
                localStorage.setItem('billabear_token', data.token);
                localStorage.setItem('billabear_user', JSON.stringify(data.user));
                navigate('/viewer');
            } else {
                // Login
                const res = await fetch(`${API_BASE}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, role: selectedRole }),
                });
                const data = await res.json();
                if (!data.success) {
                    setError(data.message);
                    setLoading(false);
                    return;
                }
                localStorage.setItem('billabear_token', data.token);
                localStorage.setItem('billabear_user', JSON.stringify(data.user));
                if (data.user.role === 'admin' || data.user.role === 'billing') {
                    navigate('/dashboard');
                } else if (data.user.role === 'viewer') {
                    navigate('/viewer');
                } else {
                    navigate(`/under-development?role=${data.user.role}`);
                }
            }
        } catch (err) {
            setError('Unable to connect to the server. Please make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 font-display antialiased selection:bg-primary/30 selection:text-primary min-h-screen flex overflow-hidden">
            {/* Left Panel — Login/Register Form */}
            <div className="w-full lg:w-[40%] flex flex-col justify-between p-8 md:p-12 lg:p-20 bg-white dark:bg-slate-900 z-10">
                <div className="mb-12">
                    <div className="flex items-center gap-3 text-primary font-bold text-2xl">
                        <span className="material-icons-round text-3xl bg-primary/10 p-2 rounded-xl">savings</span>
                        <span className="tracking-tight text-slate-900 dark:text-white">Billabear</span>
                    </div>
                </div>

                <div className="max-w-md w-full mx-auto">
                    <header className="mb-10">
                        <h1 className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight mb-3">
                            {isRegister ? 'Create account' : 'Welcome back'}
                        </h1>
                        <p className="text-lg text-slate-500 dark:text-slate-400">
                            {isRegister
                                ? 'Sign up as a viewer to manage your subscriptions.'
                                : 'Please enter your details to access your dashboard.'}
                        </p>
                    </header>

                    <form className="space-y-8" onSubmit={handleSubmit}>
                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 animate-shake">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                                    <span className="material-icons-round text-red-600 dark:text-red-400 text-lg">error</span>
                                </div>
                                <p className="text-sm font-medium text-red-700 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        <div className="space-y-5">
                            {/* Name field (register only) */}
                            {isRegister && (
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => { setName(e.target.value); setError(''); }}
                                        placeholder="John Doe"
                                        required
                                        className="w-full px-6 py-4 rounded-[20px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-base outline-none placeholder:text-slate-400 text-slate-900 dark:text-white"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                    placeholder="name@company.com"
                                    required
                                    className="w-full px-6 py-4 rounded-[20px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-base outline-none placeholder:text-slate-400 text-slate-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2 ml-1">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                                    {!isRegister && (
                                        <a className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors cursor-pointer">Forgot password?</a>
                                    )}
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                                    placeholder={isRegister ? 'Min. 6 characters' : '••••••••'}
                                    required
                                    className="w-full px-6 py-4 rounded-[20px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-base outline-none placeholder:text-slate-400 text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Role Selection (login only) */}
                        {!isRegister && (
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 ml-1">Select Workspace Role</label>
                                <div className="flex flex-row gap-3">
                                    {roles.map((role) => {
                                        const isSelected = selectedRole === role.value;
                                        return (
                                            <label
                                                key={role.value}
                                                className={`flex-1 flex flex-col items-center justify-center gap-3 p-4 rounded-[24px] border-2 cursor-pointer transition-all group text-center ${isSelected
                                                    ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/20'
                                                    : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value={role.value}
                                                    checked={isSelected}
                                                    onChange={(e) => { setSelectedRole(e.target.value); setError(''); }}
                                                    className="hidden"
                                                />
                                                <div
                                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isSelected
                                                        ? 'bg-primary text-white'
                                                        : 'bg-slate-100 dark:bg-slate-700'
                                                        }`}
                                                >
                                                    <span className="material-icons-round text-2xl">{role.icon}</span>
                                                </div>
                                                <div>
                                                    <p className="text-[13px] font-bold">{role.label}</p>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Register info badge */}
                        {isRegister && (
                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                                <span className="material-icons-round text-primary text-lg">info</span>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    New accounts are created with <span className="font-bold text-primary">Viewer</span> role. Contact admin for Team access.
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary-dark text-white py-5 rounded-[20px] font-bold text-lg shadow-xl shadow-primary/20 transition-all hover:translate-y-[-1px] active:translate-y-[1px] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {isRegister ? 'Creating account...' : 'Signing in...'}
                                </>
                            ) : (
                                isRegister ? 'Create Account' : 'Sign in to Account'
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-slate-500 text-sm">
                        {isRegister ? (
                            <>Already have an account?{' '}<button onClick={() => { setIsRegister(false); clearForm(); }} className="text-primary font-semibold hover:underline cursor-pointer">Sign in</button></>
                        ) : (
                            <>Don't have an account?{' '}<button onClick={() => { setIsRegister(true); clearForm(); }} className="text-primary font-semibold hover:underline cursor-pointer">Create account</button></>
                        )}
                    </p>
                </div>

                <div className="flex gap-6 mt-auto pt-10">
                    <a className="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">Privacy Policy</a>
                    <a className="text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">Terms of Use</a>
                </div>
            </div>

            {/* Right Panel — Decorative */}
            <div className="hidden lg:flex w-[60%] p-6 items-center justify-center relative bg-slate-50 dark:bg-slate-950">
                <div className="w-full h-full rounded-[48px] custom-pattern relative flex flex-col items-center justify-center overflow-hidden p-12 shadow-inner">
                    <div className="relative w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl p-8 mb-12">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-3 h-3 rounded-full bg-white/30"></div>
                            <div className="w-3 h-3 rounded-full bg-white/30"></div>
                            <div className="w-3 h-3 rounded-full bg-white/30"></div>
                        </div>
                        <div className="space-y-6">
                            <div className="h-8 w-1/3 bg-white/20 rounded-lg"></div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="h-24 bg-white/10 rounded-2xl"></div>
                                <div className="h-24 bg-white/10 rounded-2xl"></div>
                                <div className="h-24 bg-white/10 rounded-2xl"></div>
                            </div>
                            <div className="h-48 w-full bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                                <span className="material-symbols-outlined text-white/20 text-6xl">bar_chart</span>
                            </div>
                        </div>

                        <div className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-2xl flex items-center gap-4 border border-slate-100 dark:border-slate-700">
                            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                <span className="material-icons-round text-green-500">trending_up</span>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Revenue Growth</p>
                                <p className="text-lg font-bold text-slate-800 dark:text-white">+24.8%</p>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-md text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">Streamline your billing management</h2>
                        <p className="text-white/70 text-lg leading-relaxed">
                            "Billabear has completely transformed how we handle our global subscriptions. The role-based access is a lifesaver for our finance team."
                        </p>
                        <div className="mt-8 flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full border-2 border-white/50 mb-3 overflow-hidden">
                                <img
                                    alt="User avatar"
                                    className="w-full h-full object-cover bg-primary-dark"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsgAi0QQvMIyiOkzjJS4Zbmb9Vm8OBUvERB0xP5nvdjpOeFXYVRNZkvLck2UwWhj_s--fd1TRTC42Q-soKcuY7QvKvChFgrJ7rR2LGsGNG_PpxkXI5Vfg2o2T7C4dqxeXRCAi6Ad6EeUliTEriK8QtwL9s-7pKKQZWtcmp_0ceFqMa-8O1q4ucPC6VQV28U7k_t5gMvBsQu70teKytc0yyy17TpFf2CQATWKDG0KWuAClnijVaoPloqb6joCr8zzSrvEP_MsD0SZY"
                                />
                            </div>
                            <p className="text-white font-bold">Sarah Jenkins</p>
                            <p className="text-white/50 text-xs">Head of Finance, TechScale Inc.</p>
                        </div>
                    </div>

                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
                </div>
            </div>
        </div>
    );
}
