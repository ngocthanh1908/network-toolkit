import { useState } from 'react';
import {
    Box, Typography, ToggleButton,
    ToggleButtonGroup, Paper, Grid,
} from '@mui/material';
import Icon from '@mui/material/Icon';

type DeviceType = 'mobile' | 'tablet' | 'desktop';

type Feature = {
    icon: string;
    color: string;
    label: string;
};

const DEVICE_CONFIG: Record<DeviceType, { width: number; height: number; icon: string; label: string }> = {
    mobile: { width: 375, height: 580, icon: 'smartphone', label: 'Mobile' },
    tablet: { width: 768, height: 580, icon: 'tablet', label: 'Tablet' },
    desktop: { width: 1100, height: 580, icon: 'desktop_mac', label: 'Desktop' },
};

export default function DevicePreview({ features }: { features: Feature[] }) {
    const [device, setDevice] = useState<DeviceType>('desktop');
    const config = DEVICE_CONFIG[device];

    return (
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
                                    {features.slice(0, 5).map((f, i) => (
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
    );
}
