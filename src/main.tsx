import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import Layout from './components/Layout';
import IpLookup from './pages/IpLookup';
import DnsLookup from './pages/DnsLookup';
import SubnetCalc from './pages/SubnetCalc';
import PortChecker from './pages/PortChecker';
import History from './pages/History';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/ip-lookup" replace />} />
            <Route path="ip-lookup" element={<IpLookup />} />
            <Route path="dns-lookup" element={<DnsLookup />} />
            <Route path="subnet-calc" element={<SubnetCalc />} />
            <Route path="port-checker" element={<PortChecker />} />
            <Route path="history" element={<History />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);