import { useState, useMemo, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline, CircularProgress, Box } from '@mui/material';
import { ColorModeContext } from './context/ColorMode';
import Layout from './components/Layout';

/* Lazy-loaded pages for code splitting */
const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const IpLookup = lazy(() => import('./pages/IpLookup'));
const DnsLookup = lazy(() => import('./pages/DnsLookup'));
const SubnetCalc = lazy(() => import('./pages/SubnetCalc'));
const PortChecker = lazy(() => import('./pages/PortChecker'));
const History = lazy(() => import('./pages/History'));

function PageLoader() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <CircularProgress />
    </Box>
  );
}

export default function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  const colorMode = useMemo(() => ({
    toggleColorMode: () => setMode((prev) => prev === 'light' ? 'dark' : 'light'),
    mode,
  }), [mode]);

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: '#2196f3' },
      ...(mode === 'dark' ? {
        background: { default: '#0a0e1a', paper: '#111827' },
      } : {
        background: { default: '#f5f7fa', paper: '#ffffff' },
      }),
    },
    shape: { borderRadius: 10 },
    typography: { fontFamily: '"Inter", "Roboto", sans-serif' },
  }), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/home" replace />} />
                <Route path="home" element={<Home />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="ip-lookup" element={<IpLookup />} />
                <Route path="dns-lookup" element={<DnsLookup />} />
                <Route path="subnet-calc" element={<SubnetCalc />} />
                <Route path="port-checker" element={<PortChecker />} />
                <Route path="history" element={<History />} />
                <Route path="*" element={<Navigate to="/home" replace />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
