import { ConfigProvider, theme } from 'antd';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemo } from 'react';
import { AuthProvider } from './auth/AuthContext';
import { PrivateRoute } from './auth/PrivateRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { RequestsPage } from './pages/RequestsPage';
import { RequestFormPage } from './pages/RequestFormPage';
import { AppLayout } from './components/AppLayout';

const queryClient = new QueryClient();

function App() {
  const appTheme = useMemo(() => ({
    algorithm: theme.darkAlgorithm,
    token: {
      colorPrimary: '#38bdf8',
      colorBgBase: '#0f172a',
      colorBgContainer: '#111827',
      colorText: '#e2e8f0',
      borderRadius: 14,
    },
    components: {
      Layout: {
        headerBg: '#0f172a',
        bodyBg: 'transparent',
        siderBg: '#0f172a',
      },
      Menu: {
        darkItemBg: 'transparent',
        darkItemHoverBg: 'rgba(56,189,248,0.12)',
        darkItemSelectedBg: 'rgba(56,189,248,0.24)',
      },
      Card: {
        colorBgContainer: 'rgba(17,24,39,0.85)',
        boxShadow: '0 20px 45px rgba(15, 23, 42, 0.35)',
      },
      Button: {
        controlHeight: 42,
      },
      Table: {
        headerBg: 'rgba(30,41,59,0.6)',
        rowHoverBg: 'rgba(148,163,184,0.08)',
      },
    },
  }), []);

  return (
    <ConfigProvider theme={appTheme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/"
                element={(
                  <PrivateRoute>
                    <AppLayout>
                      <DashboardPage />
                    </AppLayout>
                  </PrivateRoute>
                )}
              />
              <Route
                path="/requests"
                element={(
                  <PrivateRoute>
                    <AppLayout>
                      <RequestsPage />
                    </AppLayout>
                  </PrivateRoute>
                )}
              />
              <Route
                path="/requests/new"
                element={(
                  <PrivateRoute>
                    <AppLayout>
                      <RequestFormPage />
                    </AppLayout>
                  </PrivateRoute>
                )}
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
}

export default App;

