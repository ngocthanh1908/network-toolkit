import { useNavigate } from 'react-router-dom';
import {
    Box, Grid, Card, CardContent, Typography,
    Button, Chip,
} from '@mui/material';
import Icon from '@mui/material/Icon';
import { getHistory } from '../utils/history';

const TOOLS = [
    { label: 'IP Lookup', path: '/ip-lookup', icon: 'travel_explore', color: '#2196f3', description: 'Get geolocation & ISP info for any IP address' },
    { label: 'DNS Lookup', path: '/dns-lookup', icon: 'dns', color: '#00bcd4', description: 'Query A, MX, CNAME, TXT records for any domain' },
    { label: 'Subnet Calculator', path: '/subnet-calc', icon: 'calculate', color: '#4caf50', description: 'Calculate network range and hosts from CIDR' },
    { label: 'Port Checker', path: '/port-checker', icon: 'router', color: '#ff9800', description: 'Check if a TCP port is open on a remote host' },
];

export default function Dashboard() {
    const navigate = useNavigate();
    const history = getHistory();
    const recent = history.slice(0, 5);

    const stats = [
        { label: 'Total Lookups', value: history.length, icon: 'query_stats', color: '#2196f3' },
        { label: 'IP Lookups', value: history.filter((h) => h.type === 'IP Lookup').length, icon: 'travel_explore', color: '#00bcd4' },
        { label: 'DNS Lookups', value: history.filter((h) => h.type === 'DNS Lookup').length, icon: 'dns', color: '#4caf50' },
        { label: 'Port Checks', value: history.filter((h) => h.type === 'Port Check').length, icon: 'router', color: '#ff9800' },
    ];

    return (
        <Box>
            {/* Welcome */}
            <Box mb={4}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    👋 Welcome back
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Your personal network toolkit. All tools run in your browser.
                </Typography>
            </Box>

            {/* Stats */}
            <Grid container spacing={2} mb={4}>
                {stats.map((stat) => (
                    <Grid item xs={6} sm={3} key={stat.label}>
                        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{
                                    width: 44, height: 44, borderRadius: 2,
                                    bgcolor: `${stat.color}22`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Icon sx={{ color: stat.color }}>{stat.icon}</Icon>
                                </Box>
                                <Box>
                                    <Typography variant="h5" fontWeight="bold">{stat.value}</Typography>
                                    <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Tools */}
            <Typography variant="h6" fontWeight="bold" mb={2}>🛠️ Tools</Typography>
            <Grid container spacing={2} mb={4}>
                {TOOLS.map((tool) => (
                    <Grid item xs={12} sm={6} key={tool.path}>
                        <Card
                            elevation={0}
                            onClick={() => navigate(tool.path)}
                            sx={{
                                border: '1px solid', borderColor: 'divider',
                                cursor: 'pointer', transition: 'all 0.2s',
                                '&:hover': {
                                    borderColor: tool.color,
                                    transform: 'translateY(-2px)',
                                    boxShadow: `0 4px 20px ${tool.color}33`,
                                },
                            }}
                        >
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{
                                    width: 48, height: 48, borderRadius: 2,
                                    bgcolor: `${tool.color}22`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <Icon sx={{ color: tool.color, fontSize: 28 }}>{tool.icon}</Icon>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="600">{tool.label}</Typography>
                                    <Typography variant="body2" color="text.secondary">{tool.description}</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Recent History */}
            {recent.length > 0 && (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight="bold">🕐 Recent Activity</Typography>
                        <Button size="small" onClick={() => navigate('/history')}>View all</Button>
                    </Box>
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                        {recent.map((entry, index) => (
                            <Box
                                key={entry.id}
                                sx={{
                                    display: 'flex', alignItems: 'center', gap: 2,
                                    px: 2, py: 1.5,
                                    borderBottom: index < recent.length - 1 ? '1px solid' : 'none',
                                    borderColor: 'divider',
                                }}
                            >
                                <Chip label={entry.type} size="small" variant="outlined" />
                                <Typography variant="body2" fontFamily="monospace" sx={{ flexGrow: 1 }}>
                                    {entry.input}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(entry.createdAt).toLocaleTimeString()}
                                </Typography>
                            </Box>
                        ))}
                    </Card>
                </>
            )}
        </Box>
    );
}