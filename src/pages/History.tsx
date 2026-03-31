import { useState } from 'react';
import {
    Box, Typography, Button, Table, TableBody,
    TableCell, TableContainer, TableHead,
    TableRow, Paper, Chip, IconButton,
    Alert, Tooltip,
} from '@mui/material';
import Icon from '@mui/material/Icon';
import { getHistory, clearHistory, exportToCsv } from '../utils/history';
import type { HistoryEntry } from '../utils/history';

const TYPE_COLORS = {
    'IP Lookup': 'primary',
    'DNS Lookup': 'info',
    'Subnet': 'success',
    'Port Check': 'warning',
} as const;

export default function History() {
    const [entries, setEntries] = useState<HistoryEntry[]>(() => getHistory());

    function handleClear() {
        if (!confirm('Clear all history?')) return;
        clearHistory();
        setEntries([]);
    }

    function handleExport() {
        exportToCsv(entries);
    }

    function handleRefresh() {
        setEntries(getHistory());
    }

    return (
        <Box sx={{ maxWidth: 900, mx: 'auto' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" fontWeight="bold">
                    📋 History
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Refresh">
                        <IconButton onClick={handleRefresh}>
                            <Icon>refresh</Icon>
                        </IconButton>
                    </Tooltip>
                    <Button
                        variant="outlined"
                        startIcon={<Icon>download</Icon>}
                        onClick={handleExport}
                        disabled={entries.length === 0}
                    >
                        Export CSV
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Icon>delete</Icon>}
                        onClick={handleClear}
                        disabled={entries.length === 0}
                    >
                        Clear All
                    </Button>
                </Box>
            </Box>

            {/* Empty state */}
            {entries.length === 0 && (
                <Alert severity="info">
                    No history yet — go do some lookups first!
                </Alert>
            )}

            {/* Table */}
            {entries.length > 0 && (
                <>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        {entries.length} record(s) stored locally in your browser.
                    </Typography>

                    <TableContainer component={Paper} elevation={2}>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'action.hover' }}>
                                    <TableCell><b>Type</b></TableCell>
                                    <TableCell><b>Input</b></TableCell>
                                    <TableCell><b>Result</b></TableCell>
                                    <TableCell><b>Date</b></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {entries.map((entry) => (
                                    <TableRow key={entry.id} hover>
                                        <TableCell>
                                            <Chip
                                                label={entry.type}
                                                color={TYPE_COLORS[entry.type] ?? 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell sx={{ fontFamily: 'monospace' }}>
                                            {entry.input}
                                        </TableCell>
                                        <TableCell sx={{ color: 'text.secondary' }}>
                                            {entry.result}
                                        </TableCell>
                                        <TableCell sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                                            {new Date(entry.createdAt).toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
        </Box>
    );
}