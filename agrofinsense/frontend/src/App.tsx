import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useStore } from './store';
import { getHealth } from './api';
import LoginPage from './pages/LoginPage';
import FarmerDashboard from './pages/FarmerDashboard';
import PriceGraphPage from './pages/PriceGraphPage';
import SoilUploadPage from './pages/SoilUploadPage';
import StoreMapPage from './pages/StoreMapPage';
import SchemesPage from './pages/SchemesPage';
import GovDashboard from './pages/GovDashboard';
import DistrictDetailPage from './pages/DistrictDetailPage';
import SchemeStatsPage from './pages/SchemeStatsPage';

function App() {
    const { token, role, setOllamaStatus } = useStore();

    useEffect(() => {
        getHealth()
            .then((data) => {
                setOllamaStatus({
                    running: data.ollama?.ollama_running || false,
                    gemma_available: data.ollama?.gemma3_4b_available || false,
                    llama_available: data.ollama?.llama3_2_3b_available || false,
                });
            })
            .catch(() => { });
    }, [setOllamaStatus]);

    return (
        <div className="min-h-screen">
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route
                    path="/dashboard"
                    element={token ? <FarmerDashboard /> : <Navigate to="/" />}
                />
                <Route
                    path="/prices"
                    element={token ? <PriceGraphPage /> : <Navigate to="/" />}
                />
                <Route
                    path="/soil-upload"
                    element={token ? <SoilUploadPage /> : <Navigate to="/" />}
                />
                <Route
                    path="/stores"
                    element={token ? <StoreMapPage /> : <Navigate to="/" />}
                />
                <Route
                    path="/schemes"
                    element={token ? <SchemesPage /> : <Navigate to="/" />}
                />
                <Route
                    path="/gov"
                    element={
                        token && role === 'officer' ? <GovDashboard /> : <Navigate to="/" />
                    }
                />
                <Route
                    path="/district/:districtName"
                    element={
                        token && role === 'officer' ? (
                            <DistrictDetailPage />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
                <Route
                    path="/scheme-stats"
                    element={
                        token && role === 'officer' ? (
                            <SchemeStatsPage />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
            </Routes>
        </div>
    );
}

export default App;
