import { useState } from 'react';

export default function ViewerDashboardPage() {
    const [openDropdown, setOpenDropdown] = useState(null);

    const toggleDropdown = (id) => {
        setOpenDropdown(openDropdown === id ? null : id);
    };

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
                    <button className="bg-primary hover:bg-primary-dark text-white transition-colors rounded-full px-6 py-3 text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Add New Service
                    </button>
                </div>
            </header>

            {/* Summary Cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Spend */}
                <div className="bg-surface-dark p-6 lg:p-8 rounded-2xl shadow-lg shadow-black/10 flex flex-col justify-between h-full border border-slate-800 group hover:border-primary/30 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-primary/10 rounded-full text-primary">
                            <span className="material-symbols-outlined">payments</span>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">trending_up</span>
                            +2.4%
                        </span>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-medium mb-1">Total Monthly Spend</p>
                        <p className="text-white text-3xl lg:text-4xl font-extrabold tracking-tight">₹4,200</p>
                    </div>
                </div>

                {/* Next Billing */}
                <div className="bg-surface-dark p-6 lg:p-8 rounded-2xl shadow-lg shadow-black/10 flex flex-col justify-between h-full border border-slate-800 group hover:border-primary/30 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-500/10 rounded-full text-orange-400">
                            <span className="material-symbols-outlined">event</span>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-bold">In 3 days</span>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-medium mb-1">Next Billing Date</p>
                        <p className="text-white text-2xl lg:text-3xl font-bold tracking-tight">Oct 24, 2023</p>
                        <p className="text-slate-500 text-sm mt-1">Adobe Creative Cloud</p>
                    </div>
                </div>

                {/* Active Plans Count */}
                <div className="bg-surface-dark p-6 lg:p-8 rounded-2xl shadow-lg shadow-black/10 flex flex-col justify-between h-full border border-slate-800 group hover:border-primary/30 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-500/10 rounded-full text-purple-400">
                            <span className="material-symbols-outlined">layers</span>
                        </div>
                        <button className="text-primary text-sm font-bold hover:underline">View All</button>
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-medium mb-1">Active Services</p>
                        <p className="text-white text-2xl lg:text-3xl font-bold tracking-tight">3 Plans</p>
                        <div className="flex -space-x-2 mt-3 overflow-hidden">
                            <img
                                alt="Adobe"
                                className="inline-block h-6 w-6 rounded-full ring-2 ring-surface-dark"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgqU0FzSxT-aqxMhTep9I4Mwa6Ut29-WXV9zrW6pfDfLC6t2UKiL-GF2PUonWaWw9E03I1dSOpdqmDf2VFK3cghizeq7rce8OCga9ZRB05-dCTOQ-oz11hqZPrwAdSGSiojRZNJT3jaGNU9th4S7xsWyA0Lu4elK5qLRjAaB72oJw3EyyeId_e7CIb6_1NnsgLhbTb_8och49XkJ4chn2R_cuGOrUPD8fVB-9U8N1hl-84uq7ED9OL1qBMWX46slqTnjZkqzeMGBI"
                            />
                            <img
                                alt="Netflix"
                                className="inline-block h-6 w-6 rounded-full ring-2 ring-surface-dark"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7dX6m7k325FPcbhrBcHTksK0lQ0I4izpEC2bclVA0GqE9d56QUJmY9MSlLYxn0IXar6LA2S9EXC09bNdvN6I-N492Uxs82-XfYGxT2EnhMuqPxKDC-OYmCwOWATqkLh1cWp8TbxbCfzFqen9iSiuezmA-pKxWnyQGeJtj7USWmeCzlknVxCJeL7e4qE3vCVH1ifRNvrYaBmaPlSUcrHhPZRah-Bmr7IoC0YAXWqii-zoXh_DE4NOdDcHr9LKDrc3hcD0O5t1foQ8"
                            />
                            <img
                                alt="Spotify"
                                className="inline-block h-6 w-6 rounded-full ring-2 ring-surface-dark"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfwppjUr6mmbDhqW0IUAtrsKsbk7yxlaGs81Ff-aR2t31Q8ZmA3hV5yUto_-epO4jWgFpkyCo_v-e5me7BA9ebwuk9vAS2D4-493tTwqoZn8k6E_Waq96rNqBBtJDUA1CUtMUhF_eCUeG6y7ci-aj_BAY_ouyLJ7DiIp-8mm0wiOrtfJ95brJWpvw0-ECGAyu5rIPj07OpvzxxL80vvmIDRsq0AMrR-SnQM1A3v0Fjvn9wbrXydfA0BjUlWvfGxAdMb7ulgMjy__s"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Active Subscriptions List */}
            <section className="flex flex-col gap-6">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-white text-xl font-bold">Active Subscriptions</h2>
                    <div className="flex gap-2">
                        <button className="p-2 rounded-full hover:bg-slate-800 text-slate-400 transition-colors">
                            <span className="material-symbols-outlined">filter_list</span>
                        </button>
                        <button className="p-2 rounded-full hover:bg-slate-800 text-slate-400 transition-colors">
                            <span className="material-symbols-outlined">sort</span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {/* Card 1: Adobe */}
                    <div className="bg-surface-dark rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-lg shadow-black/10 border border-slate-800 hover:border-slate-700 transition-all">
                        {/* Icon */}
                        <div className="flex-shrink-0 h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                            <img
                                alt="Adobe"
                                className="w-8 h-8 object-contain"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2z8ekZlj6mSsQV_CfVnVCAKtTrZT-3w5f40DlzJEi4UUFbzlGulhU8JHioZr5JHOqTkwgoKGBbp0c9EypjsQJQx17ea23PJ8J7UV5gAzc1DW5ES83CBnsV7bAUwNofVrTQ2i1g7fboUUJW7L4IllmDyzJY03OvcEKvMWvnJZv3DgqVpPzSDoFZIx6Z0w2FpB4xoGJojQuhzwj5mWkbdnrwx1lp3dSstS4AWq_p2J1NAcBHEA3HCfRoJgBTRBs9F3bDxSW6ndYTYc"
                            />
                        </div>
                        {/* Details */}
                        <div className="flex-grow flex flex-col gap-1">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h3 className="text-lg font-bold text-white">Adobe Creative Cloud</h3>
                                <span className="bg-orange-500/10 text-orange-400 px-3 py-1 rounded-full text-xs font-bold border border-orange-500/20">Renews in 3 days</span>
                            </div>
                            <p className="text-slate-400 text-sm">Design Pro Bundle • 1 User</p>
                        </div>
                        {/* Cost & Date */}
                        <div className="flex flex-row md:flex-col justify-between w-full md:w-auto md:text-right gap-1 items-center md:items-end border-t md:border-t-0 border-slate-800 pt-4 md:pt-0 mt-2 md:mt-0">
                            <span className="text-lg font-bold text-white">$29.00<span className="text-sm font-normal text-slate-500">/mo</span></span>
                            <span className="text-xs text-slate-500 font-medium">Next: Oct 24, 2023</span>
                        </div>
                        {/* Action */}
                        <div className="flex-shrink-0 w-full md:w-auto">
                            <button className="w-full md:w-auto px-6 py-2.5 rounded-full bg-slate-800 text-slate-300 font-bold text-sm hover:bg-primary hover:text-white transition-all border border-slate-700 hover:border-primary flex items-center justify-center gap-2 group/btn">
                                <span>Manage</span>
                                <span className="material-symbols-outlined text-[18px] group-hover/btn:rotate-90 transition-transform">expand_more</span>
                            </button>
                        </div>
                    </div>

                    {/* Card 2: Netflix */}
                    <div className="bg-surface-dark rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-lg shadow-black/10 border border-slate-800 hover:border-slate-700 transition-all">
                        {/* Icon */}
                        <div className="flex-shrink-0 h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                            <img
                                alt="Netflix"
                                className="w-8 h-8 object-contain"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2lFOSvhpb-A2KzgdNTQ9Ng48LEyQUdcrbQqdOflhSdYZXz_r4o2CYpZjQUK25aD4wHriIDD2y1nTF0fvR4KBaO_izGqg_1C6hyXHaoY3y1uIfPv_bj16LiTOkzEgkPW0HB8nv5phm9m-SpHTkWU4RYr-_RwVlI6Ylk4dSDggmymurPOdDTmIOzUiY8pQNyOUyeFM3yhfimWzFzkmfokHxFJlbiV5jObBBXjl_EFe-2xSz4PJFK0GHJoeb2nACVPgbRUMvIEutCYI"
                            />
                        </div>
                        {/* Details */}
                        <div className="flex-grow flex flex-col gap-1">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h3 className="text-lg font-bold text-white">Netflix</h3>
                                <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">Active</span>
                            </div>
                            <p className="text-slate-400 text-sm">Premium Ultra HD • 4 Screens</p>
                        </div>
                        {/* Cost & Date */}
                        <div className="flex flex-row md:flex-col justify-between w-full md:w-auto md:text-right gap-1 items-center md:items-end border-t md:border-t-0 border-slate-800 pt-4 md:pt-0 mt-2 md:mt-0">
                            <span className="text-lg font-bold text-white">$15.99<span className="text-sm font-normal text-slate-500">/mo</span></span>
                            <span className="text-xs text-slate-500 font-medium">Next: Nov 02, 2023</span>
                        </div>
                        {/* Action */}
                        <div className="flex-shrink-0 w-full md:w-auto relative">
                            <button
                                onClick={() => toggleDropdown('netflix')}
                                className="w-full md:w-auto px-6 py-2.5 rounded-full bg-slate-800 text-slate-300 font-bold text-sm hover:bg-primary hover:text-white transition-all border border-slate-700 hover:border-primary flex items-center justify-center gap-2 group/btn"
                            >
                                <span>Manage</span>
                                <span className="material-symbols-outlined text-[18px] group-hover/btn:rotate-90 transition-transform">expand_more</span>
                            </button>
                            {/* Dropdown */}
                            {openDropdown === 'netflix' && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-surface-dark rounded-xl shadow-xl border border-slate-700 p-2 z-20">
                                    <a className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-primary transition-colors cursor-pointer" href="#">
                                        <span className="material-symbols-outlined text-[18px]">upgrade</span>
                                        Upgrade Plan
                                    </a>
                                    <a className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-primary transition-colors cursor-pointer" href="#">
                                        <span className="material-symbols-outlined text-[18px]">vertical_align_bottom</span>
                                        Downgrade
                                    </a>
                                    <div className="h-px bg-slate-700 my-1"></div>
                                    <a className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer" href="#">
                                        <span className="material-symbols-outlined text-[18px]">cancel</span>
                                        Cancel Sub
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Card 3: Spotify */}
                    <div className="bg-surface-dark rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6 shadow-lg shadow-black/10 border border-slate-800 hover:border-slate-700 transition-all opacity-75">
                        {/* Icon */}
                        <div className="flex-shrink-0 h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 grayscale">
                            <img
                                alt="Spotify"
                                className="w-8 h-8 object-contain"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5wgtJsEvLehpIsOm85_B8A1NvSz-JYNegfJYVr77EcWp_jAA116FpkH_rW8eFlmV2W1HNLSuQEGDiBTHG2EoNLfdTNukimEuFb9t5T1Jw16hlS4tziy_OS2fuKoWggh_QFoVlG9Roj1Db2WhBtmPyvK8gxmhnzhaTXdhaxPeTXHACw_0imMzVfmXeVvMy5-STRgKqxpZKP6L2rIWplVnB9GSQ6cndcBujUjeE3KohCwpe1hrkM9BKm2ybB3eE67C9QrPNl2UH0DQ"
                            />
                        </div>
                        {/* Details */}
                        <div className="flex-grow flex flex-col gap-1">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h3 className="text-lg font-bold text-white">Spotify</h3>
                                <span className="bg-slate-800 text-slate-400 px-3 py-1 rounded-full text-xs font-bold border border-slate-700">Paused</span>
                            </div>
                            <p className="text-slate-400 text-sm">Student Plan</p>
                        </div>
                        {/* Cost & Date */}
                        <div className="flex flex-row md:flex-col justify-between w-full md:w-auto md:text-right gap-1 items-center md:items-end border-t md:border-t-0 border-slate-800 pt-4 md:pt-0 mt-2 md:mt-0">
                            <span className="text-lg font-bold text-white">$4.99<span className="text-sm font-normal text-slate-500">/mo</span></span>
                            <span className="text-xs text-slate-500 font-medium">Resumes: Dec 01, 2023</span>
                        </div>
                        {/* Action */}
                        <div className="flex-shrink-0 w-full md:w-auto">
                            <button className="w-full md:w-auto px-6 py-2.5 rounded-full bg-slate-800 text-slate-400 font-bold text-sm hover:bg-primary hover:text-white transition-all border border-slate-700 hover:border-primary flex items-center justify-center gap-2 group/btn">
                                <span>Resume</span>
                                <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Tip Section */}
            <div className="mt-4 rounded-2xl bg-primary/5 border border-primary/10 p-4 flex items-start gap-4">
                <div className="bg-surface-dark rounded-full p-2 text-primary shadow-sm shrink-0 border border-slate-800">
                    <span className="material-symbols-outlined">lightbulb</span>
                </div>
                <div>
                    <h4 className="text-white font-bold text-sm">Did you know?</h4>
                    <p className="text-slate-400 text-sm mt-1">You can save up to 20% by switching your Adobe Creative Cloud subscription to an annual plan. <a className="text-primary font-bold underline" href="#">Check annual pricing</a></p>
                </div>
            </div>

            {/* Footer for Content */}
            <footer className="mt-auto py-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
                <p>© 2023 Subscription Manager Inc. All rights reserved.</p>
                <div className="flex gap-6">
                    <a className="hover:text-slate-300" href="#">Privacy Policy</a>
                    <a className="hover:text-slate-300" href="#">Terms of Service</a>
                    <a className="hover:text-slate-300" href="#">Help Center</a>
                </div>
            </footer>
        </div>
    );
}
