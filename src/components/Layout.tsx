import { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
    Box, Drawer, AppBar, Toolbar, Typography,
    List, ListItem, ListItemButton, ListItemIcon,
    ListItemText, IconButton, Tooltip, Divider,
} from '@mui/material';
import Icon from '@mui/material/Icon';
import { useColorMode } from '../context/ColorMode';

const DRAWER_WIDTH = 220;

const NAV_ITEMS = [
    { label: 'Home', path: '/home', icon: 'home' },
    { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { label: 'IP Lookup', path: '/ip-lookup', icon: 'travel_explore' },
    { label: 'DNS Lookup', path: '/dns-lookup', icon: 'dns' },
    { label: 'Subnet Calculator', path: '/subnet-calc', icon: 'calculate' },
    { label: 'Port Checker', path: '/port-checker', icon: 'router' },
    { label: 'History', path: '/history', icon: 'history' },
];

export default function Layout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const { toggleColorMode, mode } = useColorMode();

    const currentPage = NAV_ITEMS.find((i) => i.path === location.pathname)?.label ?? 'Network Toolkit';

    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>

            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: collapsed ? 64 : DRAWER_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: collapsed ? 64 : DRAWER_WIDTH,
                        transition: 'width 0.25s ease',
                        overflowX: 'hidden',
                        bgcolor: mode === 'dark' ? '#0d1117' : '#1e293b',
                        borderRight: 'none',
                        boxShadow: '4px 0 20px rgba(0,0,0,0.3)',
                    },
                }}
            >
                {/* Logo */}
                <Toolbar sx={{
                    justifyContent: collapsed ? 'center' : 'space-between',
                    px: collapsed ? 1 : 2,
                    minHeight: '64px !important',
                }}>
                    {!collapsed && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Icon sx={{ color: '#2196f3', fontSize: 28 }}>hub</Icon>
                            <Typography variant="h6" fontWeight="bold" sx={{
                                background: 'linear-gradient(90deg, #2196f3, #21cbf3)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>
                                NetToolkit
                            </Typography>
                        </Box>
                    )}
                    <IconButton onClick={() => setCollapsed(!collapsed)} sx={{ color: 'grey.400' }}>
                        <Icon>{collapsed ? 'menu' : 'menu_open'}</Icon>
                    </IconButton>
                </Toolbar>

                <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

                {/* Nav Items */}
                <List sx={{ px: 1, pt: 1 }}>
                    {NAV_ITEMS.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                                <Tooltip title={collapsed ? item.label : ''} placement="right">
                                    <ListItemButton
                                        onClick={() => navigate(item.path)}
                                        sx={{
                                            borderRadius: 2,
                                            bgcolor: isActive ? 'rgba(33,150,243,0.15)' : 'transparent',
                                            borderLeft: isActive ? '3px solid #2196f3' : '3px solid transparent',
                                            '&:hover': {
                                                bgcolor: isActive ? 'rgba(33,150,243,0.2)' : 'rgba(255,255,255,0.05)',
                                            },
                                            px: collapsed ? 1.5 : 2,
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        <ListItemIcon sx={{
                                            color: isActive ? '#2196f3' : 'grey.400',
                                            minWidth: collapsed ? 'auto' : 36,
                                            transition: 'color 0.2s',
                                        }}>
                                            <Icon>{item.icon}</Icon>
                                        </ListItemIcon>
                                        {!collapsed && (
                                            <ListItemText
                                                primary={item.label}
                                                sx={{
                                                    '& .MuiTypography-root': {
                                                        color: isActive ? '#fff' : 'grey.400',
                                                        fontWeight: isActive ? 600 : 400,
                                                        fontSize: '0.875rem',
                                                    },
                                                }}
                                            />
                                        )}
                                    </ListItemButton>
                                </Tooltip>
                            </ListItem>
                        );
                    })}
                </List>
            </Drawer>

            {/* Main area */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                {/* Header */}
                <AppBar
                    position="static"
                    elevation={0}
                    sx={{
                        bgcolor: 'background.paper',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        <Typography variant="h6" fontWeight="600" color="text.primary">
                            {currentPage}
                        </Typography>
                        <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
                            <IconButton onClick={toggleColorMode} sx={{ color: 'text.primary' }}>
                                <Icon>{mode === 'dark' ? 'light_mode' : 'dark_mode'}</Icon>
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                </AppBar>

                {/* Page content */}
                <Box sx={{
                    flexGrow: 1,
                    p: 3,
                    overflow: 'auto',
                    bgcolor: 'background.default',
                }}>
                    <Outlet />
                </Box>

            </Box>
        </Box>
    );
}