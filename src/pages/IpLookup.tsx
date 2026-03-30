import { useState } from 'react';
import {
    Box, TextField, Button, Card, CardContent,
    Typography, CircularProgress, Alert, Grid,
    Chip, Divider,
} from '@mui/material';
import { useIpLookup } from '../hooks/useIpLookup';

export default function IpLookup() {
    const [input, setInput] = useState('');
    const { data, loading, error, lookup } = useIpLookup();

    function handleSubmit() {
        const ip = input.trim();
        if (!ip) return;
        lookup(ip);
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter') handleSubmit();
    }

    return (
        <Box sx={{ maxWidth: 700, mx: 'auto' }}>
            <Typography variant="h5" fontWeight="bold" mb={3}>
                🔍 IP Lookup
            </Typography>

            {/* Input */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    label="Enter IP address"
                    placeholder="e.g. 8.8.8.8"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                />
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading || !input.trim()}
                    sx={{ minWidth: 120 }}
                >
                    {loading ? <CircularProgress size={20} color="inherit" /> : 'Lookup'}
                </Button>
            </Box>

            {/* Error */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Result */}
            {data && (
                <Card elevation={2}>
                    <CardContent>
                        {/* Header */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Typography variant="h6" fontWeight="bold">
                                {data.query}
                            </Typography>
                            <Chip label={data.country} color="primary" size="small" />
                            <Chip label={data.isp} variant="outlined" size="small" />
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        {/* Info Grid */}
                        <Grid container spacing={2}>
                            {[
                                { label: 'Country', value: `${data.country} (${data.countryCode})` },
                                { label: 'Region', value: data.regionName },
                                { label: 'City', value: data.city },
                                { label: 'ZIP', value: data.zip || '—' },
                                { label: 'ISP', value: data.isp },
                                { label: 'Org', value: data.org || '—' },
                                { label: 'Timezone', value: data.timezone },
                                { label: 'Latitude', value: String(data.lat) },
                                { label: 'Longitude', value: String(data.lon) },
                            ].map((item) => (
                                <Grid item xs={12} sm={6} key={item.label}>
                                    <Typography variant="caption" color="text.secondary">
                                        {item.label}
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
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