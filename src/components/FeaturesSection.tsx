import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Chip } from '@mui/material';
import Icon from '@mui/material/Icon';

type Feature = {
    icon: string;
    color: string;
    label: string;
    path: string;
    description: string;
    tags: string[];
};

export default function FeaturesSection({ features }: { features: Feature[] }) {
    const navigate = useNavigate();

    return (
        <Box sx={{ mb: 8 }}>
            <Typography variant="h5" fontWeight="bold" textAlign="center" mb={4}>
                🛠️ What's inside
            </Typography>
            <Grid container spacing={3}>
                {features.map((f) => (
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
    );
}
