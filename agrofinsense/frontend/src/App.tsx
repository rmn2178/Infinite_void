import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store';
import { AppShell } from './components/AppShell';
import { LoginPage } from './pages/LoginPage';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { SoilUploadPage } from './pages/SoilUploadPage';
import { PriceGraphPage } from './pages/PriceGraphPage';
import { SchemesPage } from './pages/SchemesPage';
import { SchemeStatsPage } from './pages/SchemeStatsPage';
import { GovDashboard } from './pages/GovDashboard';
import { DistrictDetailPage } from './pages/DistrictDetailPage';
import { LiveMarketPage } from './pages/LiveMarketPage';
import { StoreMapPage } from './pages/StoreMapPage';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: ('farmer'|'officer')[] }) {
  const { token, role } = useStore();
  if (!token) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(role)) return <Navigate to={role === 'officer' ? '/gov' : '/farmer'} replace />;
  return <AppShell>{children}</AppShell>;
}

export default function App() {
  const token = useStore(s => s.token);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/farmer" replace /> : <LoginPage />} />
        
        {/* Farmer Routes */}
        <Route path="/farmer" element={<ProtectedRoute allowedRoles={['farmer']}><FarmerDashboard /></ProtectedRoute>} />
        <Route path="/soil-upload" element={<ProtectedRoute allowedRoles={['farmer']}><SoilUploadPage /></ProtectedRoute>} />
        <Route path="/prices" element={<ProtectedRoute allowedRoles={['farmer']}><PriceGraphPage /></ProtectedRoute>} />
        <Route path="/schemes" element={<ProtectedRoute allowedRoles={['farmer']}><SchemesPage /></ProtectedRoute>} />
        <Route path="/stores" element={<ProtectedRoute allowedRoles={['farmer']}><StoreMapPage /></ProtectedRoute>} />
        
        {/* Officer Routes */}
        <Route path="/gov" element={<ProtectedRoute allowedRoles={['officer']}><GovDashboard /></ProtectedRoute>} />
        <Route path="/district/:districtName" element={<ProtectedRoute allowedRoles={['officer']}><DistrictDetailPage /></ProtectedRoute>} />
        <Route path="/scheme-stats" element={<ProtectedRoute allowedRoles={['officer']}><SchemeStatsPage /></ProtectedRoute>} />
        
        {/* Shared Routes */}
        <Route path="/market" element={<ProtectedRoute allowedRoles={['farmer', 'officer']}><LiveMarketPage /></ProtectedRoute>} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
