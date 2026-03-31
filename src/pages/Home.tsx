import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import Icon from '@mui/material/Icon';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import DevicePreview from '../components/DevicePreview';

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

export default function Home() {
    const navigate = useNavigate();

    return (
        <Box>
            <HeroSection />
            <FeaturesSection features={FEATURES} />
            <DevicePreview features={FEATURES} />

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
