const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'billabear-secret-key-2026';

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// ═══════════════════════════════════════════════════════════════
//  IN-MEMORY DATA STORE
// ═══════════════════════════════════════════════════════════════

// ─── Plans ───────────────────────────────────────────────────
const plans = [
    { id: 1, name: 'Starter', price: 29, period: '/mo', features: ['Up to 100 customers', 'Basic analytics', 'Email support', '1 team member'], color: 'from-slate-500 to-slate-600', popular: false },
    { id: 2, name: 'Pro', price: 120, period: '/mo', features: ['Up to 1,000 customers', 'Advanced analytics', 'Priority support', '5 team members', 'API access'], color: 'from-primary to-primary-dark', popular: true },
    { id: 3, name: 'Enterprise', price: 499, period: '/mo', features: ['Unlimited customers', 'Custom analytics', 'Dedicated support', 'Unlimited team', 'API access', 'Custom integrations'], color: 'from-indigo-500 to-purple-600', popular: false },
];

// ─── Users ───────────────────────────────────────────────────
let nextUserId = 4;
const users = [
    { id: 1, email: 'admin@billabear.com', password: 'admin123', name: 'Admin User', role: 'admin', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDO8bebcCf-yB7eitoM0pE7ITDGMYUb4gQ1j-RxIBUSvkLosbcndeXPL7uo0ToEH-YRdR78nEb2Sz1iiVVYC_kDrpi_CQ7dFDfsD3NHBkUFfx7BVjqhDWQa1oanAwjk9W-cmhFS4dTo_ajKP0MxU6F-iP6jc4lZcC2gL-J48rRO5JpkcAgn5dVGFnyOzzd9ITfjFVRQkqgrxeD3Y8JCqgCKZeKWaporyXDCY54_LADLfsX8CaWxu2UpB_ak8IpisHJT8Ri8kCLSO4Q' },
    { id: 2, email: 'billing@billabear.com', password: 'billing123', name: 'Billing Manager', role: 'billing', avatar: null },
    { id: 3, email: 'viewer@billabear.com', password: 'viewer123', name: 'Report Viewer', role: 'viewer', avatar: null },
];

// ─── Customers (35 realistic Indian companies) ──────────────
let nextCustomerId = 1;
const customerSeed = [
    ['Reliance Jio', 'enterprise@reliance.com', 'RJ', 3, 'Active', '2024-10-15'],
    ['Tata Consultancy', 'billing@tcs.com', 'TC', 3, 'Active', '2024-09-01'],
    ['Infosys Ltd', 'accounts@infosys.com', 'IL', 2, 'Active', '2024-11-20'],
    ['Wipro Technologies', 'finance@wipro.com', 'WT', 2, 'Active', '2025-01-10'],
    ['HCL Technologies', 'billing@hcltech.com', 'HT', 3, 'Active', '2024-08-05'],
    ['Bajaj Finserv', 'payments@bajaj.com', 'BF', 2, 'Active', '2025-02-14'],
    ['Tech Mahindra', 'accounts@techmahindra.com', 'TM', 2, 'Active', '2025-03-01'],
    ['Larsen & Toubro', 'billing@lnt.com', 'LT', 3, 'Active', '2024-07-22'],
    ['Mahindra Group', 'finance@mahindra.com', 'MG', 1, 'Active', '2025-04-10'],
    ['Adani Enterprises', 'billing@adani.com', 'AE', 3, 'Active', '2024-06-18'],
    ['Bharti Airtel', 'payments@airtel.com', 'BA', 2, 'Active', '2025-05-01'],
    ['Sun Pharma', 'accounts@sunpharma.com', 'SP', 1, 'Active', '2025-06-15'],
    ['HDFC Bank', 'billing@hdfcbank.com', 'HB', 3, 'Active', '2024-05-10'],
    ['ICICI Bank', 'finance@icicibank.com', 'IB', 3, 'Active', '2024-04-20'],
    ['Kotak Securities', 'billing@kotak.com', 'KS', 2, 'Active', '2025-07-01'],
    ['Axis Bank', 'accounts@axisbank.com', 'AB', 2, 'Past Due', '2025-01-25'],
    ['Asian Paints', 'billing@asianpaints.com', 'AP', 1, 'Active', '2025-08-12'],
    ['Maruti Suzuki', 'finance@maruti.com', 'MS', 2, 'Active', '2025-02-28'],
    ['Hero MotoCorp', 'payments@heromotocorp.com', 'HM', 1, 'Past Due', '2025-09-05'],
    ['Zomato', 'billing@zomato.com', 'ZO', 2, 'Active', '2025-03-20'],
    ['Paytm', 'accounts@paytm.com', 'PT', 2, 'Churned', '2025-01-01'],
    ['Flipkart', 'billing@flipkart.com', 'FK', 3, 'Active', '2024-12-01'],
    ['Ola Mobility', 'finance@ola.com', 'OM', 2, 'Active', '2025-04-15'],
    ['Dream Sports', 'billing@dreamsports.com', 'DS', 1, 'Churned', '2025-05-20'],
    ['PhonePe Solutions', 'accounts@phonepe.com', 'PS', 3, 'Active', '2024-11-10'],
    ['Razorpay', 'billing@razorpay.com', 'RP', 2, 'Active', '2025-06-01'],
    ['Zerodha', 'finance@zerodha.com', 'ZE', 1, 'Active', '2025-07-15'],
    ['Swiggy', 'payments@swiggy.com', 'SW', 2, 'Past Due', '2025-02-10'],
    ['CRED', 'billing@cred.com', 'CR', 1, 'Active', '2025-08-25'],
    ['Nykaa', 'accounts@nykaa.com', 'NK', 1, 'Churned', '2025-03-05'],
    ['Freshworks', 'billing@freshworks.com', 'FW', 2, 'Active', '2025-04-01'],
    ['Zoho Corp', 'finance@zoho.com', 'ZC', 3, 'Active', '2024-10-01'],
    ['PolicyBazaar', 'billing@policybazaar.com', 'PB', 1, 'Active', '2025-09-10'],
    ['CarDekho', 'payments@cardekho.com', 'CD', 1, 'Past Due', '2025-06-20'],
    ['MakeMyTrip', 'billing@makemytrip.com', 'MM', 2, 'Active', '2025-05-15'],
];

const customers = customerSeed.map(([name, email, initials, planId, status, joined]) => ({
    id: nextCustomerId++,
    name, email, initials, planId, status, joined,
    totalSpent: 0,
}));

// ─── Subscriptions (one per customer) ───────────────────────
let nextSubId = 1;
const subscriptions = customers.map((c) => {
    const plan = plans.find((p) => p.id === c.planId);
    const isCancelled = c.status === 'Churned';
    return {
        id: nextSubId++,
        customerId: c.id,
        planId: c.planId,
        status: c.status === 'Churned' ? 'Cancelled' : c.status,
        amount: plan.price,
        nextBilling: isCancelled ? '—' : new Date(new Date(c.joined).setFullYear(2026)).toISOString().split('T')[0],
        startDate: c.joined,
    };
});

// ─── Invoices (generate 3-8 per customer) ───────────────────
let nextInvNum = 1;
const invoices = [];
const statusPool = ['Paid', 'Paid', 'Paid', 'Paid', 'Paid', 'Sent', 'Overdue', 'Draft'];

customers.forEach((c) => {
    const plan = plans.find((p) => p.id === c.planId);
    const start = new Date(c.joined);
    const now = new Date('2026-03-10');
    let d = new Date(start);
    let totalSpent = 0;

    while (d < now) {
        const invDate = d.toISOString().split('T')[0];
        const dueDate = new Date(d);
        dueDate.setDate(dueDate.getDate() + 30);
        const st = c.status === 'Churned' ? 'Paid' : statusPool[Math.floor(Math.random() * statusPool.length)];

        invoices.push({
            id: `INV-${String(nextInvNum++).padStart(4, '0')}`,
            customerId: c.id,
            customer: c.name,
            email: c.email,
            amount: plan.price,
            status: st,
            date: invDate,
            dueDate: dueDate.toISOString().split('T')[0],
        });

        if (st === 'Paid') totalSpent += plan.price;
        d.setMonth(d.getMonth() + 1);
    }
    c.totalSpent = totalSpent;
});

// ─── Viewer Subscriptions (personal services per user) ──────
let nextVsId = 1;
const viewerSubscriptions = [];

function createDefaultViewerSubs(userId) {
    const defaults = [
        { name: 'Adobe Creative Cloud', description: 'Design Pro Bundle • 1 User', icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2z8ekZlj6mSsQV_CfVnVCAKtTrZT-3w5f40DlzJEi4UUFbzlGulhU8JHioZr5JHOqTkwgoKGBbp0c9EypjsQJQx17ea23PJ8J7UV5gAzc1DW5ES83CBnsV7bAUwNofVrTQ2i1g7fboUUJW7L4IllmDyzJY03OvcEKvMWvnJZv3DgqVpPzSDoFZIx6Z0w2FpB4xoGJojQuhzwj5mWkbdnrwx1lp3dSstS4AWq_p2J1NAcBHEA3HCfRoJgBTRBs9F3bDxSW6ndYTYc', status: 'Renews in 3 days', statusColor: 'orange', cost: 2499, dateStr: 'Oct 24, 2023', state: 'active', nextAction: 'Next' },
        { name: 'Netflix', description: 'Premium Ultra HD • 4 Screens', icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2lFOSvhpb-A2KzgdNTQ9Ng48LEyQUdcrbQqdOflhSdYZXz_r4o2CYpZjQUK25aD4wHriIDD2y1nTF0fvR4KBaO_izGqg_1C6hyXHaoY3y1uIfPv_bj16LiTOkzEgkPW0HB8nv5phm9m-SpHTkWU4RYr-_RwVlI6Ylk4dSDggmymurPOdDTmIOzUiY8pQNyOUyeFM3yhfimWzFzkmfokHxFJlbiV5jObBBXjl_EFe-2xSz4PJFK0GHJoeb2nACVPgbRUMvIEutCYI', status: 'Active', statusColor: 'green', cost: 1349, dateStr: 'Nov 02, 2023', state: 'active', nextAction: 'Next' },
        { name: 'Spotify', description: 'Student Plan', icon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5wgtJsEvLehpIsOm85_B8A1NvSz-JYNegfJYVr77EcWp_jAA116FpkH_rW8eFlmV2W1HNLSuQEGDiBTHG2EoNLfdTNukimEuFb9t5T1Jw16hlS4tziy_OS2fuKoWggh_QFoVlG9Roj1Db2WhBtmPyvK8gxmhnzhaTXdhaxPeTXHACw_0imMzVfmXeVvMy5-STRgKqxpZKP6L2rIWplVnB9GSQ6cndcBujUjeE3KohCwpe1hrkM9BKm2ybB3eE67C9QrPNl2UH0DQ', status: 'Paused', statusColor: 'slate', cost: 419, dateStr: 'Dec 01, 2023', state: 'paused', nextAction: 'Resumes' },
    ];
    defaults.forEach((sub) => {
        viewerSubscriptions.push({
            id: nextVsId++,
            visibleId: sub.name.toLowerCase().replace(/\s+/g, '-'),
            userId,
            ...sub,
            timestamp: new Date(sub.dateStr).getTime(),
        });
    });
}
createDefaultViewerSubs(3); // default viewer user

// ─── Activity Log ────────────────────────────────────────────
const activityLog = [
    { id: 1, status: 'Paid', statusColor: 'emerald', name: 'Reliance Jio', email: 'enterprise@reliance.com', initials: 'RJ', eventType: 'Subscription Renewal', amount: 499, createdAt: new Date('2026-03-10T10:00:00') },
    { id: 2, status: 'New', statusColor: 'blue', name: 'Tech Mahindra', email: 'accounts@techmahindra.com', initials: 'TM', eventType: 'New Subscription', amount: 120, createdAt: new Date('2026-03-10T08:00:00') },
    { id: 3, status: 'Failed', statusColor: 'red', name: 'Swiggy', email: 'payments@swiggy.com', initials: 'SW', eventType: 'Payment Failed', amount: 120, createdAt: new Date('2026-03-10T05:00:00') },
    { id: 4, status: 'Paid', statusColor: 'emerald', name: 'Flipkart', email: 'billing@flipkart.com', initials: 'FK', eventType: 'Invoice Payment', amount: 499, createdAt: new Date('2026-03-09T22:00:00') },
    { id: 5, status: 'Paid', statusColor: 'emerald', name: 'HDFC Bank', email: 'billing@hdfcbank.com', initials: 'HB', eventType: 'Subscription Renewal', amount: 499, createdAt: new Date('2026-03-09T18:00:00') },
    { id: 6, status: 'New', statusColor: 'blue', name: 'Bajaj Finserv', email: 'payments@bajaj.com', initials: 'BF', eventType: 'New Subscription', amount: 120, createdAt: new Date('2026-03-09T14:00:00') },
];
let nextActivityId = 7;

function addActivity(data) {
    activityLog.unshift({ id: nextActivityId++, createdAt: new Date(), ...data });
    if (activityLog.length > 50) activityLog.pop();
}

function timeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hrs ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

// ═══════════════════════════════════════════════════════════════
//  AUTH MIDDLEWARE
// ═══════════════════════════════════════════════════════════════

function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'No token provided.' });
    }
    try {
        const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
        const user = users.find((u) => u.id === decoded.id);
        if (!user) return res.status(401).json({ success: false, message: 'User not found.' });
        req.user = user;
        next();
    } catch {
        return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
}

function requireRole(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: 'Access denied.' });
        }
        next();
    };
}

// ═══════════════════════════════════════════════════════════════
//  AUTH ROUTES
// ═══════════════════════════════════════════════════════════════

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return res.status(400).json({ success: false, message: 'Email, password, and role are required.' });
    }

    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return res.status(401).json({ success: false, message: 'No account found with this email address.' });
    if (user.password !== password) return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });

    if (role === 'team') {
        if (user.role !== 'admin' && user.role !== 'billing') {
            return res.status(403).json({ success: false, message: `This account does not have team access. Your role is "${user.role}".` });
        }
    } else if (user.role !== role) {
        return res.status(403).json({ success: false, message: `This account does not have ${role} access. Your role is "${user.role}".` });
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({
        success: true, message: 'Login successful!', token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar },
    });
});

// POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const newUser = { id: nextUserId++, email, password, name, role: 'viewer', avatar: null };
    users.push(newUser);

    // Create default viewer subscriptions for new user
    createDefaultViewerSubs(newUser.id);

    const token = jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({
        success: true, message: 'Account created successfully!', token,
        user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role, avatar: null },
    });
});

// GET /api/auth/verify
app.get('/api/auth/verify', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'No token provided.' });
    }
    try {
        const decoded = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
        const user = users.find((u) => u.id === decoded.id);
        if (!user) return res.status(401).json({ success: false, message: 'User not found.' });
        return res.json({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar } });
    } catch {
        return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
});

// GET /api/auth/users (dev/demo)
app.get('/api/auth/users', (req, res) => {
    const safeUsers = users.map(({ password, ...rest }) => rest);
    return res.json({ success: true, users: safeUsers });
});

// ═══════════════════════════════════════════════════════════════
//  DASHBOARD DATA ROUTES (Admin/Billing)
// ═══════════════════════════════════════════════════════════════

app.get('/api/data/dashboard-stats', requireAuth, requireRole('admin', 'billing'), (req, res) => {
    const activeSubs = subscriptions.filter((s) => s.status === 'Active');
    const mrr = activeSubs.reduce((sum, s) => sum + s.amount, 0);
    const totalSubs = subscriptions.length;
    const cancelledSubs = subscriptions.filter((s) => s.status === 'Cancelled').length;
    const churnRate = totalSubs > 0 ? ((cancelledSubs / totalSubs) * 100).toFixed(1) : '0.0';
    const paidInvoices = invoices.filter((i) => i.status === 'Paid');
    const netRevenue = paidInvoices.reduce((sum, i) => sum + i.amount, 0);

    res.json({
        success: true,
        stats: [
            { title: 'Monthly Recurring Revenue', value: `₹${mrr.toLocaleString('en-IN')}`, changePercent: '12%', changeDirection: 'up', icon: 'payments', iconColor: 'primary', sparklinePath: 'M0,20 C10,18 20,22 30,15 C40,10 50,18 60,12 C70,5 80,10 90,5 L100,2', sparklineFillPath: 'M0,20 L0,25 L100,25 L100,2 L90,5 C80,10 70,5 60,12 C50,18 40,10 30,15 C20,22 10,18 0,20' },
            { title: 'Active Subscribers', value: String(activeSubs.length), changePercent: '5%', changeDirection: 'up', icon: 'people', iconColor: 'blue', sparklinePath: 'M0,15 Q25,20 50,10 T100,5' },
            { title: 'Churn Rate', value: `${churnRate}%`, changePercent: '0.4%', changeDirection: 'down', icon: 'show_chart', iconColor: 'orange', sparklinePath: 'M0,5 L10,5 L20,10 L30,5 L40,8 L50,15 L60,15 L70,20 L80,18 L90,22 L100,20' },
            { title: 'Net Revenue', value: `₹${netRevenue.toLocaleString('en-IN')}`, changePercent: '8.5%', changeDirection: 'up', icon: 'account_balance_wallet', iconColor: 'indigo', sparklinePath: 'M0,25 C20,25 20,10 40,10 C60,10 60,5 80,5 C90,5 90,0 100,0', sparklineFillPath: 'M0,25 L100,25 L100,0 C90,0 90,5 80,5 C60,5 60,10 40,10 C20,10 20,25 0,25' },
        ],
    });
});

app.get('/api/data/revenue-chart', requireAuth, requireRole('admin', 'billing'), (req, res) => {
    const range = req.query.range || 'yearly';
    const paidInvoices = invoices.filter((i) => i.status === 'Paid');

    if (range === 'yearly') {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const data = months.map((month, i) => {
            const total = paidInvoices.filter((inv) => { const d = new Date(inv.date); return d.getMonth() === i; }).reduce((s, inv) => s + inv.amount, 0);
            return { month, value: total };
        });
        const maxVal = Math.max(...data.map((d) => d.value), 1);
        data.forEach((d) => { d.height = `${Math.max(5, Math.round((d.value / maxVal) * 95))}%`; });
        return res.json({ success: true, data });
    }
    if (range === 'weekly') {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const data = days.map((month) => ({ month, value: Math.floor(Math.random() * 2000) + 500 }));
        const maxVal = Math.max(...data.map((d) => d.value), 1);
        data.forEach((d) => { d.height = `${Math.max(5, Math.round((d.value / maxVal) * 95))}%`; });
        return res.json({ success: true, data });
    }
    // monthly (daily for 30 days)
    const data = [1, 5, 10, 15, 20, 25, 30].map((day) => ({ month: String(day), value: Math.floor(Math.random() * 1500) + 300 }));
    const maxVal = Math.max(...data.map((d) => d.value), 1);
    data.forEach((d) => { d.height = `${Math.max(5, Math.round((d.value / maxVal) * 95))}%`; });
    return res.json({ success: true, data });
});

app.get('/api/data/recent-activity', requireAuth, requireRole('admin', 'billing'), (req, res) => {
    const formatted = activityLog.slice(0, 10).map((a) => ({
        ...a,
        date: timeAgo(a.createdAt),
        amount: `₹${a.amount.toLocaleString('en-IN')}.00`,
        initialsGradient: 'from-blue-100 to-indigo-100 dark:from-slate-700 dark:to-slate-600',
        initialsTextColor: 'text-primary dark:text-slate-300',
    }));
    res.json({ success: true, activities: formatted });
});

// ─── Admin: Customers ────────────────────────────────────────
app.get('/api/data/customers', requireAuth, requireRole('admin', 'billing'), (req, res) => {
    const result = customers.map((c) => ({
        ...c,
        plan: plans.find((p) => p.id === c.planId)?.name || 'Unknown',
        totalSpent: `₹${c.totalSpent.toLocaleString('en-IN')}.00`,
    }));
    res.json({ success: true, customers: result });
});

// ─── Admin: Subscriptions ────────────────────────────────────
app.get('/api/data/subscriptions', requireAuth, requireRole('admin', 'billing'), (req, res) => {
    const result = subscriptions.map((s) => {
        const customer = customers.find((c) => c.id === s.customerId);
        const plan = plans.find((p) => p.id === s.planId);
        return {
            id: s.id,
            customer: customer?.name || 'Unknown',
            plan: plan?.name || 'Unknown',
            status: s.status,
            amount: `₹${s.amount.toLocaleString('en-IN')}.00/mo`,
            nextBilling: s.nextBilling,
            startDate: s.startDate,
        };
    });
    res.json({ success: true, subscriptions: result });
});

app.put('/api/data/subscriptions/:id', requireAuth, requireRole('admin', 'billing'), (req, res) => {
    const sub = subscriptions.find((s) => s.id === parseInt(req.params.id));
    if (!sub) return res.status(404).json({ success: false, message: 'Subscription not found.' });

    const { action } = req.body;
    const customer = customers.find((c) => c.id === sub.customerId);

    if (action === 'cancel') {
        sub.status = 'Cancelled';
        sub.nextBilling = '—';
        if (customer) customer.status = 'Churned';
        addActivity({ status: 'Cancelled', statusColor: 'red', name: customer?.name || 'Unknown', email: customer?.email || '', initials: customer?.initials || '??', eventType: 'Subscription Cancelled', amount: sub.amount });
    } else if (action === 'reactivate') {
        sub.status = 'Active';
        sub.nextBilling = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        if (customer) customer.status = 'Active';
        addActivity({ status: 'New', statusColor: 'blue', name: customer?.name || 'Unknown', email: customer?.email || '', initials: customer?.initials || '??', eventType: 'Subscription Reactivated', amount: sub.amount });
    }
    res.json({ success: true, message: 'Subscription updated.' });
});

// ─── Admin: Invoices ─────────────────────────────────────────
app.get('/api/data/invoices', requireAuth, requireRole('admin', 'billing'), (req, res) => {
    res.json({ success: true, invoices });
});

app.post('/api/data/invoices', requireAuth, requireRole('admin', 'billing'), (req, res) => {
    const { customer, email, amount } = req.body;
    if (!customer || !amount) return res.status(400).json({ success: false, message: 'Customer and amount required.' });
    const inv = {
        id: `INV-${String(nextInvNum++).padStart(4, '0')}`,
        customerId: null, customer, email: email || 'N/A',
        amount: parseFloat(amount), status: 'Draft',
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    invoices.unshift(inv);
    res.json({ success: true, invoice: inv });
});

app.put('/api/data/invoices/:id', requireAuth, requireRole('admin', 'billing'), (req, res) => {
    const inv = invoices.find((i) => i.id === req.params.id);
    if (!inv) return res.status(404).json({ success: false, message: 'Invoice not found.' });
    const { status } = req.body;
    if (status) inv.status = status;
    res.json({ success: true, invoice: inv });
});

app.delete('/api/data/invoices/:id', requireAuth, requireRole('admin', 'billing'), (req, res) => {
    const idx = invoices.findIndex((i) => i.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Invoice not found.' });
    invoices.splice(idx, 1);
    res.json({ success: true, message: 'Invoice deleted.' });
});

// ─── Admin: Plans ────────────────────────────────────────────
app.get('/api/data/plans', requireAuth, requireRole('admin', 'billing'), (req, res) => {
    const result = plans.map((p) => ({
        ...p,
        subscribers: subscriptions.filter((s) => s.planId === p.id && s.status === 'Active').length,
    }));
    res.json({ success: true, plans: result });
});

app.put('/api/data/plans/:id', requireAuth, requireRole('admin'), (req, res) => {
    const plan = plans.find((p) => p.id === parseInt(req.params.id));
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found.' });
    if (req.body.price !== undefined) plan.price = parseFloat(req.body.price);
    res.json({ success: true, plan });
});

// ═══════════════════════════════════════════════════════════════
//  VIEWER ROUTES
// ═══════════════════════════════════════════════════════════════

app.get('/api/viewer/subscriptions', requireAuth, requireRole('viewer'), (req, res) => {
    const subs = viewerSubscriptions.filter((s) => s.userId === req.user.id);
    res.json({ success: true, subscriptions: subs });
});

app.put('/api/viewer/subscriptions/:id', requireAuth, requireRole('viewer'), (req, res) => {
    const sub = viewerSubscriptions.find((s) => s.id === parseInt(req.params.id) && s.userId === req.user.id);
    if (!sub) return res.status(404).json({ success: false, message: 'Subscription not found.' });

    const { action } = req.body;
    if (action === 'cancel') {
        sub.status = 'Cancelled'; sub.state = 'cancelled'; sub.statusColor = 'red'; sub.nextAction = 'Cancelled';
    } else if (action === 'pause') {
        sub.status = 'Paused'; sub.state = 'paused'; sub.statusColor = 'slate'; sub.nextAction = 'Resumes';
    } else if (action === 'resume') {
        sub.status = 'Active'; sub.state = 'active'; sub.statusColor = 'green'; sub.nextAction = 'Next';
    }

    // Log activity visible to admin
    addActivity({
        status: sub.status, statusColor: sub.statusColor === 'green' ? 'emerald' : sub.statusColor,
        name: req.user.name, email: req.user.email,
        initials: req.user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2),
        eventType: `${sub.name} ${action === 'cancel' ? 'Cancelled' : action === 'pause' ? 'Paused' : 'Resumed'}`,
        amount: sub.cost,
    });

    res.json({ success: true, message: `Subscription ${action}d.`, subscription: sub });
});

app.get('/api/viewer/invoices', requireAuth, requireRole('viewer'), (req, res) => {
    // Generate viewer-specific invoices from their subscriptions
    const subs = viewerSubscriptions.filter((s) => s.userId === req.user.id);
    const viewerInvoices = [];
    let num = 1;
    subs.forEach((sub) => {
        for (let i = 0; i < 6; i++) {
            const d = new Date(sub.dateStr);
            d.setMonth(d.getMonth() - i);
            viewerInvoices.push({
                date: d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                id: `INV-${d.getFullYear()}-${String(num++).padStart(3, '0')}`,
                amount: `₹${sub.cost.toLocaleString('en-IN')}`,
                plan: `${sub.name} - Monthly`,
                status: i === 2 ? 'pending' : 'paid',
            });
        }
    });
    res.json({ success: true, invoices: viewerInvoices });
});

app.get('/api/viewer/billing-history', requireAuth, requireRole('viewer'), (req, res) => {
    const subs = viewerSubscriptions.filter((s) => s.userId === req.user.id);
    const history = [];
    let num = 882910;
    subs.forEach((sub) => {
        for (let i = 0; i < 3; i++) {
            const d = new Date(sub.dateStr);
            d.setMonth(d.getMonth() - i);
            const st = i === 1 && sub.state !== 'active' ? 'failed' : i === 2 ? 'pending' : 'paid';
            history.push({
                date: d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                id: `INV-${num++}`,
                amount: sub.cost,
                plan: `${sub.name}`,
                paymentMethod: 'Visa **** 4242',
                status: st,
                statusColor: st === 'paid' ? 'emerald' : st === 'failed' ? 'rose' : 'amber',
                errorInfo: st === 'failed' ? 'Payment method declined. Try another card.' : undefined,
            });
        }
    });
    res.json({ success: true, invoices: history });
});

// ═══════════════════════════════════════════════════════════════
//  HEALTH & SERVER START
// ═══════════════════════════════════════════════════════════════

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`\n  🚀 Billabear API server running on http://localhost:${PORT}\n`);
    console.log(`  📊 Seed data loaded:`);
    console.log(`     • ${users.length} users`);
    console.log(`     • ${customers.length} customers`);
    console.log(`     • ${subscriptions.length} subscriptions`);
    console.log(`     • ${invoices.length} invoices`);
    console.log(`     • ${viewerSubscriptions.length} viewer subscriptions`);
    console.log(`     • ${plans.length} plans\n`);
    console.log('  Available accounts:');
    console.log('  ┌──────────────────────────────┬──────────────┬──────────┐');
    console.log('  │ Email                        │ Password     │ Role     │');
    console.log('  ├──────────────────────────────┼──────────────┼──────────┤');
    users.forEach((u) => {
        console.log(`  │ ${u.email.padEnd(28)} │ ${u.password.padEnd(12)} │ ${u.role.padEnd(8)} │`);
    });
    console.log('  └──────────────────────────────┴──────────────┴──────────┘\n');
});
