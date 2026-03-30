import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { ColorModeContext } from './context/ColorMode';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import IpLookup from './pages/IpLookup';
import DnsLookup from './pages/DnsLookup';
import SubnetCalc from './pages/SubnetCalc';
import PortChecker from './pages/PortChecker';
import History from './pages/History';

function App() {
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
        </BrowserRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>
);