import { useState } from 'react';
import { addHistory } from '../utils/history';
import {
    Box, TextField, Button, Typography,
    Alert, Card, CardContent, Grid,
    Divider, Chip,
} from '@mui/material';
import { calculateSubnet } from '../utils/subnet';
import type { SubnetInfo } from '../utils/subnet';

export default function SubnetCalc() {
    const [input, setInput] = useState('');
    const [result, setResult] = useState<SubnetInfo | null>(null);
    const [error, setError] = useState<string | null>(null);

    function handleCalculate() {
        const val = input.trim();
        if (!val) return;

        setError(null);
        setResult(null);

        const info = calculateSubnet(val);
        if (!info) {
            setError('Invalid CIDR format. Example: 192.168.1.0/24');
            return;
        }
        setResult(info);
        addHistory({
            type: 'Subnet',
            input: val,
            result: `Network: ${info.networkAddress}, Usable hosts: ${info.usableHosts.toLocaleString()}`,
        });
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter') handleCalculate();
    }

    return (
        <Box sx={{ maxWidth: 700, mx: 'auto' }}>
            <Typography variant="h5" fontWeight="bold" mb={3}>
                🧮 Subnet Calculator
            </Typography>

            {/* Input */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    label="Enter CIDR notation"
                    placeholder="e.g. 192.168.1.0/24"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Button
                    variant="contained"
                    onClick={handleCalculate}
                    disabled={!input.trim()}
                    sx={{ minWidth: 140 }}
                >
                    Calculate
                </Button>
            </Box>

            {/* Quick examples */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                    Try:
                </Typography>
                {['192.168.1.0/24', '10.0.0.0/8', '172.16.0.0/12', '192.168.1.0/30'].map((ex) => (
                    <Chip
                        key={ex}
                        label={ex}
                        size="small"
                        variant="outlined"
                        onClick={() => setInput(ex)}
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
                        {/* Header */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Typography variant="h6" fontFamily="monospace" fontWeight="bold">
                                {result.ipAddress}/{result.cidr}
                            </Typography>
                            <Chip
                                label={`Class ${result.ipClass}`}
                                color="primary"
                                size="small"
                            />
                            <Chip
                                label={result.ipType}
                                color={result.ipType === 'Private' ? 'success' : 'warning'}
                                size="small"
                            />
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        <Grid container spacing={2}>
                            {[
                                { label: 'IP Address', value: result.ipAddress },
                                { label: 'Subnet Mask', value: result.subnetMask },
                                { label: 'Network Address', value: result.networkAddress },
                                { label: 'Broadcast Address', value: result.broadcastAddress },
                                { label: 'First Host', value: result.firstHost },
                                { label: 'Last Host', value: result.lastHost },
                                { label: 'Total Hosts', value: result.totalHosts.toLocaleString() },
                                { label: 'Usable Hosts', value: result.usableHosts.toLocaleString() },
                            ].map((item) => (
                                <Grid item xs={12} sm={6} key={item.label}>
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