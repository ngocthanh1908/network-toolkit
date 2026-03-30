import { useState } from 'react';
import {
    Box, TextField, Button, Typography,
    CircularProgress, Alert, Card, CardContent,
    Chip, Divider, Grid,
} from '@mui/material';
import { usePortChecker } from '../hooks/usePortChecker';

const COMMON_PORTS = [
    { port: 22, label: 'SSH' },
    { port: 80, label: 'HTTP' },
    { port: 443, label: 'HTTPS' },
    { port: 3306, label: 'MySQL' },
    { port: 5432, label: 'PostgreSQL' },
    { port: 6379, label: 'Redis' },
];

export default function PortChecker() {
    const [host, setHost] = useState('');
    const [port, setPort] = useState('');
    const { result, loading, error, checkPort } = usePortChecker();

    function handleSubmit() {
        const h = host.trim();
        const p = parseInt(port.trim());
        if (!h || isNaN(p) || p < 1 || p > 65535) return;
        checkPort(h, p);
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter') handleSubmit();
    }

    function handleQuickCheck(p: number) {
        setPort(String(p));
        if (host.trim()) checkPort(host.trim(), p);
    }

    const statusColor = {
        open: 'success',
        closed: 'error',
        timeout: 'warning',
    } as const;

    const statusIcon = {
        open: '✅',
        closed: '❌',
        timeout: '⏱️',
    };

    return (
        <Box sx={{ maxWidth: 700, mx: 'auto' }}>
            <Typography variant="h5" fontWeight="bold" mb={1}>
                📡 Port Checker
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
                Check if a TCP port is open on a remote host.
            </Typography>

            {/* Input */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                    fullWidth
                    label="Host / IP"
                    placeholder="e.g. 192.168.1.1 or google.com"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                />
                <TextField
                    label="Port"
                    placeholder="e.g. 80"
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    sx={{ minWidth: 100 }}
                    type="number"
                />
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading || !host.trim() || !port.trim()}
                    sx={{ minWidth: 120 }}
                >
                    {loading ? <CircularProgress size={20} color="inherit" /> : 'Check'}
                </Button>
            </Box>

            {/* Quick ports */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                    Common:
                </Typography>
                {COMMON_PORTS.map((p) => (
                    <Chip
                        key={p.port}
                        label={`${p.port} ${p.label}`}
                        size="small"
                        variant="outlined"
                        onClick={() => handleQuickCheck(p.port)}
                        sx={{ cursor: 'pointer', fontFamily: 'monospace' }}
                    />
                ))}
            </Box>

            {/* Error */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Result */}
            {result && (
                <Card elevation={2}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Typography variant="h6" fontFamily="monospace" fontWeight="bold">
                                {result.host}:{result.port}
                            </Typography>
                            <Chip
                                label={`${statusIcon[result.status]} ${result.status.toUpperCase()}`}
                                color={statusColor[result.status]}
                                size="small"
                            />
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        <Grid container spacing={2}>
                            {[
                                { label: 'Host', value: result.host },
                                { label: 'Port', value: String(result.port) },
                                { label: 'Status', value: result.status.toUpperCase() },
                            ].map((item) => (
                                <Grid item xs={12} sm={4} key={item.label}>
                                    <Typography variant="caption" color="text.secondary">
                                        {item.label}
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium" fontFamily="monospace">
                                        {item.value}
                                    </Typography>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            )}
        </Box>
    );
}