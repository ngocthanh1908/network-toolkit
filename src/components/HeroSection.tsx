import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Chip } from '@mui/material';
import Icon from '@mui/material/Icon';

export default function HeroSection() {
    const navigate = useNavigate();

    return (
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
    );
}
