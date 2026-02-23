import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ViewerSidebar from './components/ViewerSidebar';
import DashboardPage from './pages/DashboardPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import PlansPage from './pages/PlansPage';
import CustomersPage from './pages/CustomersPage';
import InvoicesPage from './pages/InvoicesPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import UnderDevelopmentPage from './pages/UnderDevelopmentPage';
import ViewerDashboardPage from './pages/ViewerDashboardPage';
import ViewerPlansPage from './pages/ViewerPlansPage';
import ViewerSettingsPage from './pages/ViewerSettingsPage';
import ViewerBillingHistoryPage from './pages/ViewerBillingHistoryPage';
import ViewerPaymentMethodsPage from './pages/ViewerPaymentMethodsPage';

const pageMeta = {
  '/dashboard': { title: 'Dashboard Overview', subtitle: 'Welcome back to your financial hub.' },
  '/dashboard/subscriptions': { title: 'Subscriptions', subtitle: 'Manage all your customer subscriptions.' },
  '/dashboard/plans': { title: 'Plans', subtitle: 'Configure your pricing plans.' },
  '/dashboard/customers': { title: 'Customers', subtitle: 'View and manage your customer base.' },
  '/dashboard/invoices': { title: 'Invoices', subtitle: 'Create, send, and track invoices.' },
  '/dashboard/settings': { title: 'Settings', subtitle: 'Configure your billing preferences.' },
};

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const meta = pageMeta[location.pathname] || pageMeta['/dashboard'];

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background-light dark:bg-background-dark relative">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="flex-1 overflow-y-auto px-4 sm:px-8 pb-8">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
            <Route path="/plans" element={<PlansPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function ViewerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-background-dark text-slate-100 min-h-screen flex antialiased overflow-hidden">
      <ViewerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 h-screen overflow-y-auto no-scrollbar relative flex flex-col">
        {/* Mobile Header (Visible only on smaller screens) */}
        <div className="lg:hidden flex items-center justify-between p-6 bg-surface-dark border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10"
              style={{
                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDSj5jY7G1SSXYigLN2DoRUoVJbULj6NR7SRc32FYlYwQ5Tw_oHt-TsO0aSj67nFuPQJJ19Pt91axgmwEl647vqCfGwnl7bFuoPUkKmZERUYFWTEyxpVLIkE4l7wSV7uJ6zh4DeJTqUoEx5LZEVsm1R4iG46vKIfHVAaSX_Cx7CDtMaLKKLDo68kifnmxdrWyjnxCIGktXfp4O9zNx8FEg1zLT_Lk6blLGDvH9WNYdR9RhUFaULWk4G-4VSAtGOebGAKZFefqu3i3E")`
              }}
            ></div>
            <span className="font-bold text-white">Alex Morgan</span>
          </div>
          <button className="text-slate-400" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>

        <Routes>
          <Route path="/" element={<ViewerDashboardPage />} />
          <Route path="/plans" element={<ViewerPlansPage />} />
          <Route path="/billing-history" element={<ViewerBillingHistoryPage />} />
          <Route path="/payment-methods" element={<ViewerPaymentMethodsPage />} />
          <Route path="/settings" element={<ViewerSettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/under-development" element={<UnderDevelopmentPage />} />
        <Route path="/dashboard/*" element={<DashboardLayout />} />
        <Route path="/viewer/*" element={<ViewerLayout />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
