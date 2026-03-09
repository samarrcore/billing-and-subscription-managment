const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'billabear-secret-key-2026';

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// ─── User Database ───────────────────────────────────────────────
const users = [
    {
        id: 1,
        email: 'admin@billabear.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDO8bebcCf-yB7eitoM0pE7ITDGMYUb4gQ1j-RxIBUSvkLosbcndeXPL7uo0ToEH-YRdR78nEb2Sz1iiVVYC_kDrpi_CQ7dFDfsD3NHBkUFfx7BVjqhDWQa1oanAwjk9W-cmhFS4dTo_ajKP0MxU6F-iP6jc4lZcC2gL-J48rRO5JpkcAgn5dVGFnyOzzd9ITfjFVRQkqgrxeD3Y8JCqgCKZeKWaporyXDCY54_LADLfsX8CaWxu2UpB_ak8IpisHJT8Ri8kCLSO4Q',
    },
    {
        id: 2,
        email: 'billing@billabear.com',
        password: 'billing123',
        name: 'Billing Manager',
        role: 'billing',
        avatar: null,
    },
    {
        id: 3,
        email: 'viewer@billabear.com',
        password: 'viewer123',
        name: 'Report Viewer',
        role: 'viewer',
        avatar: null,
    },
];

// ─── Routes ──────────────────────────────────────────────────────

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
    const { email, password, role } = req.body;

    // Validate input
    if (!email || !password || !role) {
        return res.status(400).json({
            success: false,
            message: 'Email, password, and role are required.',
        });
    }

    // Find user by email
    const user = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'No account found with this email address.',
        });
    }

    // Check password
    if (user.password !== password) {
        return res.status(401).json({
            success: false,
            message: 'Incorrect password. Please try again.',
        });
    }

    // Check role match
    // 'team' role on login accepts both 'admin' and 'billing' users
    if (role === 'team') {
        if (user.role !== 'admin' && user.role !== 'billing') {
            return res.status(403).json({
                success: false,
                message: `This account does not have team access. Your role is "${user.role}".`,
            });
        }
    } else if (user.role !== role) {
        return res.status(403).json({
            success: false,
            message: `This account does not have ${role} access. Your role is "${user.role}".`,
        });
    }

    // Generate JWT token
    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    // Return success
    return res.json({
        success: true,
        message: 'Login successful!',
        token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
        },
    });
});

// GET /api/auth/verify — Verify JWT token
app.get('/api/auth/verify', (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = users.find((u) => u.id === decoded.id);

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found.' });
        }

        return res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                avatar: user.avatar,
            },
        });
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
});

// GET /api/auth/users — List available accounts (for dev/demo only)
app.get('/api/auth/users', (req, res) => {
    const safeUsers = users.map(({ password, ...rest }) => rest);
    return res.json({ success: true, users: safeUsers });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Start Server ────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n  🚀 Billabear API server running on http://localhost:${PORT}\n`);
    console.log('  Available accounts:');
    console.log('  ┌──────────────────────────────┬──────────────┬──────────┐');
    console.log('  │ Email                        │ Password     │ Role     │');
    console.log('  ├──────────────────────────────┼──────────────┼──────────┤');
    users.forEach((u) => {
        console.log(
            `  │ ${u.email.padEnd(28)} │ ${u.password.padEnd(12)} │ ${u.role.padEnd(8)} │`
        );
    });
    console.log('  └──────────────────────────────┴──────────────┴──────────┘\n');
});
