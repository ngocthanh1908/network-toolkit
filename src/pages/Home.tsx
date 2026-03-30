import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Button, Grid, Card,
    CardContent, Chip, ToggleButton,
    ToggleButtonGroup, Paper,
} from '@mui/material';
import Icon from '@mui/material/Icon';

const FEATURES = [
    {
        icon: 'travel_explore',
        color: '#2196f3',
        label: 'IP Lookup',
        path: '/ip-lookup',
        description: 'Get geolocation, ISP, timezone and country info for any IP address instantly.',
        tags: ['Geolocation', 'ISP', 'Timezone'],
    },
    {
        icon: 'dns',
        color: '#00bcd4',
        label: 'DNS Lookup',
        path: '/dns-lookup',
        description: 'Query A, AAAA, MX, CNAME, TXT, NS records for any domain using Google DNS.',
        tags: ['A', 'MX', 'CNAME', 'TXT'],
    },
    {
        icon: 'calculate',
        color: '#4caf50',
        label: 'Subnet Calculator',
        path: '/subnet-calc',
        description: 'Calculate network address, broadcast, host range and usable hosts from CIDR.',
        tags: ['CIDR', 'Network', 'Broadcast'],
    },
    {
        icon: 'router',
        color: '#ff9800',
        label: 'Port Checker',
        path: '/port-checker',
        description: 'Check if a TCP port is open or closed on any remote host or IP address.',
        tags: ['TCP', 'SSH', 'HTTP', 'HTTPS'],
    },
    {
        icon: 'history',
        color: '#9c27b0',
        label: 'History & Export',
        path: '/history',
        description: 'All lookups are saved locally in your browser. Export anytime as CSV.',
        tags: ['LocalStorage', 'CSV Export'],
    },
];

type DeviceType = 'mobile' | 'tablet' | 'desktop';

const DEVICE_CONFIG: Record<DeviceType, { width: number; height: number; icon: string; label: string }> = {
    mobile: { width: 375, height: 580, icon: 'smartphone', label: 'Mobile' },
    tablet: { width: 768, height: 580, icon: 'tablet', label: 'Tablet' },
    desktop: { width: 1100, height: 580, icon: 'desktop_mac', label: 'Desktop' },
};

export default function Home() {
    const navigate = useNavigate();
    const [device, setDevice] = useState<DeviceType>('desktop');
    const config = DEVICE_CONFIG[device];

    return (
        <Box>

            {/* Hero */}
            <Box sx={{ textAlign: 'center', py: 6, px: 2 }}>
                <Chip
                    label="🚀 Browser-only · No login · Free forever"
                    variant="outlined"
                    color="primary"
                    sx={{ mb: 3, fontWeight: 500 }}
                />
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Network Toolkit
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 520, mx: 'auto', mb: 4 }}>
                    A personal network utility app for IT professionals.
                    IP lookup, DNS, subnetting and port checking — all in one place.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<Icon>rocket_launch</Icon>}
                        onClick={() => navigate('/dashboard')}
                        sx={{ borderRadius: 3, px: 4 }}
                    >
                        Get Started
                    </Button>
                    <Button
                        variant="outlined"
                        size="large"
                        startIcon={<Icon>travel_explore</Icon>}
                        onClick={() => navigate('/ip-lookup')}
                        sx={{ borderRadius: 3, px: 4 }}
                    >
                        Try IP Lookup
                    </Button>
                </Box>
            </Box>

            {/* Features */}
            <Box sx={{ mb: 8 }}>
                <Typography variant="h5" fontWeight="bold" textAlign="center" mb={4}>
                    🛠️ What's inside
                </Typography>
                <Grid container spacing={3}>
                    {FEATURES.map((f) => (
                        <Grid item xs={12} sm={6} md={4} key={f.label}>
                            <Card
                                elevation={0}
                                onClick={() => navigate(f.path)}
                                sx={{
                                    height: '100%',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    cursor: 'pointer',
                                    transition: 'all 0.25s',
                                    '&:hover': {
                                        borderColor: f.color,
                                        transform: 'translateY(-4px)',
                                        boxShadow: `0 8px 24px ${f.color}33`,
                                    },
                                }}
                            >
                                <CardContent>
                                    <Box sx={{
                                        width: 52, height: 52, borderRadius: 2.5,
                                        bgcolor: `${f.color}22`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        mb: 2,
                                    }}>
                                        <Icon sx={{ color: f.color, fontSize: 30 }}>{f.icon}</Icon>
                                    </Box>
                                    <Typography variant="subtitle1" fontWeight="700" gutterBottom>
                                        {f.label}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" mb={2}>
                                        {f.description}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                        {f.tags.map((tag) => (
                                            <Chip
                                                key={tag}
                                                label={tag}
                                                size="small"
                                                sx={{
                                                    bgcolor: `${f.color}18`,
                                                    color: f.color,
                                                    fontWeight: 500,
                                                    fontSize: '0.7rem',
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Device Preview */}
            <Box sx={{ mb: 8 }}>
                <Typography variant="h5" fontWeight="bold" textAlign="center" mb={1}>
                    📱 Responsive Design
                </Typography>
                <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
                    Works beautifully on any device
                </Typography>

                {/* Device toggle */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                    <ToggleButtonGroup
                        value={device}
                        exclusive
                        onChange={(_, val) => val && setDevice(val)}
                        sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
                    >
                        {(Object.keys(DEVICE_CONFIG) as DeviceType[]).map((d) => (
                            <ToggleButton key={d} value={d} sx={{ px: 3, gap: 1 }}>
                                <Icon fontSize="small">{DEVICE_CONFIG[d].icon}</Icon>
                                {DEVICE_CONFIG[d].label}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Box>

                {/* Device frame */}
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{
                        transition: 'all 0.4s ease',
                        width: config.width,
                        maxWidth: '100%',
                    }}>
                        {/* Frame */}
                        <Paper
                            elevation={8}
                            sx={{
                                borderRadius: device === 'mobile' ? 4 : 2,
                                overflow: 'hidden',
                                border: '3px solid',
                                borderColor: 'divider',
                                height: config.height,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            {/* Browser bar */}
                            <Box sx={{
                                bgcolor: 'background.paper',
                                borderBottom: '1px solid',
                                borderColor: 'divider',
                                px: 2, py: 1,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                flexShrink: 0,
                            }}>
                                {device === 'desktop' && (
                                    <Box sx={{ display: 'flex', gap: 0.5, mr: 1 }}>
                                        {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
                                            <Box key={c} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c }} />
                                        ))}
                                    </Box>
                                )}
                                <Box sx={{
                                    flexGrow: 1,
                                    bgcolor: 'action.hover',
                                    borderRadius: 1,
                                    px: 2, py: 0.4,
                                    display: 'flex', alignItems: 'center', gap: 1,
                                }}>
                                    <Icon sx={{ fontSize: 14, color: 'text.secondary' }}>lock</Icon>
                                    <Typography variant="caption" color="text.secondary">
                                        network-toolkit.vercel.app
                                    </Typography>
                                </Box>
                            </Box>

                            {/* App preview */}
                            <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>

                                {/* Mini sidebar — hide on mobile */}
                                {device !== 'mobile' && (
                                    <Box sx={{
                                        width: device === 'tablet' ? 48 : 180,
                                        bgcolor: '#0d1117',
                                        flexShrink: 0,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        pt: 1,
                                        gap: 0.5,
                                        px: 0.5,
                                    }}>
                                        {/* Logo */}
                                        <Box sx={{ px: 1, py: 0.5, mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Icon sx={{ color: '#2196f3', fontSize: 16 }}>hub</Icon>
                                            {device === 'desktop' && (
                                                <Typography variant="caption" fontWeight="bold" sx={{
                                                    background: 'linear-gradient(90deg, #2196f3, #21cbf3)',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                }}>
                                                    NetToolkit
                                                </Typography>
                                            )}
                                        </Box>
                                        {FEATURES.slice(0, 5).map((f, i) => (
                                            <Box key={f.label} sx={{
                                                display: 'flex', alignItems: 'center', gap: 1,
                                                px: 1, py: 0.4, borderRadius: 1,
                                                bgcolor: i === 0 ? 'rgba(33,150,243,0.15)' : 'transparent',
                                                borderLeft: i === 0 ? '2px solid #2196f3' : '2px solid transparent',
                                            }}>
                                                <Icon sx={{ fontSize: 14, color: i === 0 ? '#2196f3' : 'grey' }}>{f.icon}</Icon>
                                                {device === 'desktop' && (
                                                    <Typography variant="caption" sx={{ color: i === 0 ? '#fff' : 'grey.500', fontSize: '0.65rem' }}>
                                                        {f.label}
                                                    </Typography>
                                                )}
                                            </Box>
                                        ))}
                                    </Box>
                                )}

                                {/* Main content preview */}
                                <Box sx={{ flexGrow: 1, bgcolor: '#0a0e1a', p: 1.5, overflow: 'hidden' }}>
                                    {/* Header */}
                                    <Box sx={{
                                        display: 'flex', justifyContent: 'space-between',
                                        alignItems: 'center', mb: 1.5,
                                    }}>
                                        {device === 'mobile' && (
                                            <Icon sx={{ color: 'grey.500', fontSize: 16 }}>menu</Icon>
                                        )}
                                        <Typography variant="caption" fontWeight="bold" color="white">
                                            IP Lookup
                                        </Typography>
                                        <Icon sx={{ color: 'grey.500', fontSize: 16 }}>light_mode</Icon>
                                    </Box>

                                    {/* Search bar */}
                                    <Box sx={{
                                        bgcolor: '#111827', borderRadius: 1.5,
                                        px: 1.5, py: 0.8, mb: 1.5,
                                        display: 'flex', alignItems: 'center', gap: 1,
                                        border: '1px solid rgba(255,255,255,0.08)',
                                    }}>
                                        <Typography variant="caption" color="grey.500" sx={{ flexGrow: 1, fontSize: '0.65rem' }}>
                                            Enter IP address...
                                        </Typography>
                                        <Box sx={{
                                            bgcolor: '#2196f3', borderRadius: 1,
                                            px: 1, py: 0.2,
                                        }}>
                                            <Typography variant="caption" color="white" sx={{ fontSize: '0.6rem' }}>
                                                Lookup
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Result card */}
                                    <Box sx={{
                                        bgcolor: '#111827', borderRadius: 1.5, p: 1.5,
                                        border: '1px solid rgba(255,255,255,0.08)',
                                    }}>
                                        <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                                            <Typography variant="caption" fontWeight="bold" color="white" sx={{ fontSize: '0.7rem' }}>
                                                8.8.8.8
                                            </Typography>
                                            <Box sx={{ bgcolor: 'rgba(33,150,243,0.2)', borderRadius: 0.5, px: 0.5 }}>
                                                <Typography variant="caption" sx={{ color: '#2196f3', fontSize: '0.55rem' }}>US</Typography>
                                            </Box>
                                        </Box>
                                        <Grid container spacing={0.5}>
                                            {[
                                                ['Country', 'United States'],
                                                ['City', 'Ashburn'],
                                                ['ISP', 'Google LLC'],
                                                ['Timezone', 'America/NY'],
                                            ].map(([k, v]) => (
                                                <Grid item xs={6} key={k}>
                                                    <Typography sx={{ color: 'grey.600', fontSize: '0.55rem' }}>{k}</Typography>
                                                    <Typography sx={{ color: 'grey.300', fontSize: '0.6rem', fontFamily: 'monospace' }}>{v}</Typography>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                </Box>
                            </Box>
                        </Paper>

                        {/* Device label */}
                        <Box sx={{ textAlign: 'center', mt: 1.5 }}>
                            <Typography variant="caption" color="text.secondary">
                                <Icon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }}>{config.icon}</Icon>
                                {config.label} — {config.width}px
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Footer CTA */}
            <Box sx={{
                textAlign: 'center', py: 6,
                borderTop: '1px solid', borderColor: 'divider',
            }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Ready to get started?
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    All tools are free and run entirely in your browser. No data is sent to any server.
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<Icon>rocket_launch</Icon>}
                    onClick={() => navigate('/dashboard')}
                    sx={{ borderRadius: 3, px: 5 }}
                >
                    Open Dashboard
                </Button>
            </Box>

        </Box>
    );
}