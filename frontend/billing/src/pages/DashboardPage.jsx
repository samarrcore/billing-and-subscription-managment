import { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import RevenueChart from '../components/RevenueChart';
import ActivityTable from '../components/ActivityTable';

const API_BASE = 'http://localhost:3001';
const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('billabear_token')}`,
});

export default function DashboardPage() {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/data/dashboard-stats`, { headers: getAuthHeaders() });
                const data = await res.json();
                if (data.success) setStats(data.stats);
            } catch (err) {
                console.error('Failed to fetch stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="bg-surface-light dark:bg-surface-dark rounded-[2rem] p-8 animate-pulse">
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-4"></div>
                            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                        </div>
                    ))
                ) : (
                    stats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))
                )}
            </div>

            {/* Revenue Chart */}
            <RevenueChart />

            {/* Activity Table */}
            <ActivityTable />
        </div>
    );
}
