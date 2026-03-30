import { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
    Box, Drawer, AppBar, Toolbar, Typography,
    List, ListItem, ListItemButton, ListItemIcon,
    ListItemText, IconButton, Tooltip,
} from '@mui/material';
import Icon from '@mui/material/Icon';
import NAV_ITEMS from '../constants/nav';

const DRAWER_WIDTH = 240;

export default function Layout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

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
                        transition: 'width 0.2s',
                        overflowX: 'hidden',
                        bgcolor: 'grey.900',
                        color: 'white',
                    },
                }}
            >
                {/* Logo */}
                <Toolbar sx={{ justifyContent: collapsed ? 'center' : 'space-between' }}>
                    {!collapsed && (
                        <Typography variant="h6" fontWeight="bold" color="primary">
                            NetToolkit
                        </Typography>
                    )}
                    <IconButton onClick={() => setCollapsed(!collapsed)} sx={{ color: 'white' }}>
                        <Icon>{collapsed ? 'menu' : 'menu_open'}</Icon>
                    </IconButton>
                </Toolbar>

                {/* Nav Items */}
                <List>
                    {NAV_ITEMS.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <ListItem key={item.path} disablePadding>
                                <Tooltip title={collapsed ? item.label : ''} placement="right">
                                    <ListItemButton
                                        onClick={() => navigate(item.path)}
                                        sx={{
                                            bgcolor: isActive ? 'primary.main' : 'transparent',
                                            '&:hover': { bgcolor: isActive ? 'primary.dark' : 'grey.800' },
                                            borderRadius: 1,
                                            mx: 0.5,
                                            my: 0.25,
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: 'white', minWidth: 36 }}>
                                            <Icon>{item.icon}</Icon>
                                        </ListItemIcon>
                                        {!collapsed && (
                                            <ListItemText primary={item.label} sx={{ color: 'white' }} />
                                        )}
                                    </ListItemButton>
                                </Tooltip>
                            </ListItem>
                        );
                    })}
                </List>
            </Drawer>

            {/* Main area */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>

                {/* Header */}
                <AppBar position="static" color="default" elevation={1}>
                    <Toolbar>
                        <Typography variant="h6" color="text.primary">
                            Network Toolkit
                        </Typography>
                    </Toolbar>
                </AppBar>

                {/* Page content */}
                <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto', bgcolor: 'grey.50' }}>
                    <Outlet />
                </Box>

            </Box>
        </Box>
    );
}