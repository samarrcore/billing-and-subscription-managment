export default function StatCard({ title, value, changePercent, changeDirection, icon, iconColor, sparklinePath, sparklineFillPath }) {
    const isPositive = changeDirection === 'up';
    const trendIcon = isPositive ? 'trending_up' : 'trending_down';

    const colorMap = {
        primary: 'text-primary',
        blue: 'text-blue-500',
        orange: 'text-orange-500',
        indigo: 'text-indigo-500',
    };

    return (
        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-[2rem] shadow-sm hover:shadow-lg transition-all duration-300 border-0 group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className={`material-icons-round text-6xl ${colorMap[iconColor] || 'text-primary'}`}>
                    {icon}
                </span>
            </div>

            <div className="flex justify-between items-start mb-2 relative z-10">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{value}</h3>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-4 relative z-10">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                    <span className="material-icons-round text-[14px] mr-1">{trendIcon}</span>
                    {changePercent}
                </span>
                <span className="text-xs text-slate-400">vs last month</span>
            </div>

            <div className="h-12 w-full relative z-10">
                <svg
                    className={`w-full h-full ${colorMap[iconColor] || 'text-primary'}`}
                    preserveAspectRatio="none"
                    viewBox="0 0 100 25"
                >
                    <path
                        d={sparklinePath}
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="3"
                        vectorEffect="non-scaling-stroke"
                    />
                    {sparklineFillPath && (
                        <path
                            d={sparklineFillPath}
                            fill="currentColor"
                            fillOpacity="0.05"
                            stroke="none"
                        />
                    )}
                </svg>
            </div>
        </div>
    );
}
