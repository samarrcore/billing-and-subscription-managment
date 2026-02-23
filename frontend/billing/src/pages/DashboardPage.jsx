import StatCard from '../components/StatCard';
import RevenueChart from '../components/RevenueChart';
import ActivityTable from '../components/ActivityTable';

const stats = [
    {
        title: 'Monthly Recurring Revenue',
        value: '₹12,450',
        changePercent: '12%',
        changeDirection: 'up',
        icon: 'payments',
        iconColor: 'primary',
        sparklinePath: 'M0,20 C10,18 20,22 30,15 C40,10 50,18 60,12 C70,5 80,10 90,5 L100,2',
        sparklineFillPath:
            'M0,20 L0,25 L100,25 L100,2 L90,5 C80,10 70,5 60,12 C50,18 40,10 30,15 C20,22 10,18 0,20',
    },
    {
        title: 'Active Subscribers',
        value: '420',
        changePercent: '5%',
        changeDirection: 'up',
        icon: 'people',
        iconColor: 'blue',
        sparklinePath: 'M0,15 Q25,20 50,10 T100,5',
    },
    {
        title: 'Churn Rate',
        value: '1.2%',
        changePercent: '0.4%',
        changeDirection: 'down',
        icon: 'show_chart',
        iconColor: 'orange',
        sparklinePath:
            'M0,5 L10,5 L20,10 L30,5 L40,8 L50,15 L60,15 L70,20 L80,18 L90,22 L100,20',
    },
    {
        title: 'Net Revenue',
        value: '₹48,200',
        changePercent: '8.5%',
        changeDirection: 'up',
        icon: 'account_balance_wallet',
        iconColor: 'indigo',
        sparklinePath: 'M0,25 C20,25 20,10 40,10 C60,10 60,5 80,5 C90,5 90,0 100,0',
        sparklineFillPath:
            'M0,25 L100,25 L100,0 C90,0 90,5 80,5 C60,5 60,10 40,10 C20,10 20,25 0,25',
    },
];

export default function DashboardPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Revenue Chart */}
            <RevenueChart />

            {/* Activity Table */}
            <ActivityTable />
        </div>
    );
}
