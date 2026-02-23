import { useState } from 'react';
import { Link } from 'react-router-dom';

const initialPaymentMethods = [
    {
        id: 'pm_1',
        type: 'visa',
        last4: '4242',
        expiry: '08/26',
        isDefault: true,
        logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2S66kSbyb7XIpO5qI-NkFfkvmOhJDFaH6VoaAY9SqhRl6dtA7BsSjkb2ySU5hz7onHA9q8H0Z4Lya1qWALybx37KqjnPoxpEKRATcYq8PIu4XhHGMxcWrgDHXkQoYBfbSx_ZXZv09SEjsqEYN57EJkQb2spdLMh52Y_Vd4n4Xo3O-90rbqtso6o6qRyPD4uBG-u8wlKKjZX5PyMSWLEKiZOUC1jNUCVZL3wo8I-T5qUr5IfKZpSHhk55XdeFMloOsPCXU67hOscI'
    },
    {
        id: 'pm_2',
        type: 'mastercard',
        last4: '8812',
        expiry: '12/25',
        isDefault: false,
        logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAewr15xLtl-zhItNg8hwrCzXxHkCcBNGhwYY5NXlJauupSrJ6VLck7CoQ-cl_Z8s30wLZLkYftrJzXa83Bp8ycVK3qQavnZ7oeyIkwotgsMJdz3fdBMWhK_uYcOvIcdv5Zzt7epMf0bpAj21FdWawMXxJB0KakNYiWwmjDTuksFf11emTWdBTxjLMpiCFhx8tDxfX4fiGaVvjDyO9Inh_Lu-Dl_iiwNBgLWTAGCN_YfO9UJ0oshGW4FZNDgdgShKWrYEP2IZ_nDt4'
    },
    {
        id: 'pm_3',
        type: 'applepay',
        name: 'Apple Pay',
        linkText: 'Linked to iCloud account',
        logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZnECKtu1kaS3L5tMpwP8xhnJ18d0z6CO1cV7H0g1kfNtFAV6Q9dvzan4FQb50cFUM67IZ2RreV3w0wHiTcUv63WAWYmuTo2cORfjSSNUtKRvpTPj0syg28ssT4uiJkJzHDwQUWbC-ItLqyR1z4l1pDTN2pcbFp8jl38lmW06vYgubcbCkovrLW59Bx8nCxJNGX_nMYZ1uooXQBuETEIkWrBZheRBdR884EBxfkQv3Oy2UPd539BbO5ji6C3KK3NiXeyZzqDzYTao'
    }
];

export default function ViewerPaymentMethodsPage() {
    const [methods, setMethods] = useState(initialPaymentMethods);

    const handleSetDefault = (id) => {
        setMethods(methods.map(method => ({
            ...method,
            isDefault: method.id === id
        })));
    };

    const handleDelete = (id) => {
        // Find if we are deleting the default method
        const methodToDelete = methods.find(m => m.id === id);

        const newMethods = methods.filter(m => m.id !== id);

        // If we deleted the default, set the first available one as default
        if (methodToDelete?.isDefault && newMethods.length > 0) {
            newMethods[0].isDefault = true;
        }

        setMethods(newMethods);
    };

    return (
        <div className="w-full max-w-[1200px] mx-auto p-6 lg:p-10 flex flex-col min-h-full">
            {/* Header section matching desktop layout style */}
            <header className="flex flex-col gap-2 mb-8">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-2">
                    <Link to="/viewer" className="hover:text-primary transition-colors">Dashboard</Link>
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    <span className="text-white">Payment Methods</span>
                </div>
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-2">Payment Methods</h1>
                        <p className="text-slate-400 text-sm">Manage your cards and billing preferences.</p>
                    </div>
                    <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full text-sm font-bold shadow-[0_0_20px_rgba(19,91,236,0.3)] transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">add_circle</span>
                        Add New
                    </button>
                </div>
            </header>

            {/* Main Container */}
            <div className="flex-1 max-w-2xl mx-auto w-full flex flex-col pt-4">
                <div className="bg-surface-dark rounded-[24px] p-2 border border-slate-800 shadow-2xl relative overflow-hidden">

                    {/* Background Decor */}
                    <div className="absolute -top-24 -right-24 size-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="absolute -bottom-24 -left-24 size-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

                    <div className="relative z-10 p-2 sm:p-4 pb-2">
                        {methods.map((method) => {
                            if (method.type === 'applepay') {
                                return (
                                    <div key={method.id} className="p-5 rounded-2xl bg-transparent border border-transparent hover:bg-background-dark/30 transition-colors cursor-pointer group mb-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-10 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                                                    <img alt={method.name} className="w-9 object-contain" src={method.logo} />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-base text-white">{method.name}</h3>
                                                    <p className="text-slate-500 text-xs">{method.linkText}</p>
                                                </div>
                                            </div>
                                            <span className="material-symbols-outlined text-slate-500 group-hover:text-slate-300 transition-colors">chevron_right</span>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div key={method.id} className={`p-5 rounded-2xl mb-3 border transition-colors ${method.isDefault ? 'bg-background-dark/50 border-slate-800/50' : 'bg-transparent border-transparent hover:bg-background-dark/30'}`}>
                                    <div className="flex items-start sm:items-center justify-between mb-5 gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-10 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700 shrink-0">
                                                <img alt={method.type} className="w-9 object-contain" src={method.logo} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-base text-white flex items-center gap-2 flex-wrap">
                                                    •••• {method.last4}
                                                    {method.isDefault && (
                                                        <span className="bg-primary/20 text-primary text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border border-primary/30">Default</span>
                                                    )}
                                                </h3>
                                                <p className="text-slate-500 text-xs mt-0.5">Expires {method.expiry}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 shrink-0">
                                            <button className="size-9 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                            </button>
                                            <button onClick={() => handleDelete(method.id)} className="size-9 rounded-full flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors">
                                                <span className="material-symbols-outlined text-[20px]">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                                        <span className="text-sm font-medium text-slate-300">Set as primary</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={method.isDefault}
                                                onChange={() => handleSetDefault(method.id)}
                                            />
                                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-8 flex flex-col items-center gap-4 text-center">
                    <div className="flex items-center gap-2 text-slate-500 bg-surface-dark px-4 py-2 rounded-full border border-slate-800">
                        <span className="material-symbols-outlined text-[16px]">lock</span>
                        <p className="text-[11px] uppercase tracking-widest font-bold">Secure Encrypted Environment</p>
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed max-w-[280px]">
                        All transactions are secure and encrypted. We do not store your full card details on our servers.
                    </p>
                </div>
            </div>
        </div>
    );
}
