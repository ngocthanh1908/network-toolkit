import { useState } from 'react';
import {
    Box, TextField, Button, Typography,
    CircularProgress, Alert, MenuItem, Select,
    FormControl, InputLabel, Table, TableBody,
    TableCell, TableContainer, TableHead,
    TableRow, Paper, Chip,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useDnsLookup } from '../hooks/useDnsLookup';

const RECORD_TYPES = ['A', 'AAAA', 'MX', 'CNAME', 'TXT', 'NS'];

const TYPE_COLORS: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'info'> = {
    A: 'primary',
    AAAA: 'info',
    MX: 'success',
    CNAME: 'secondary',
    TXT: 'warning',
    NS: 'info',
};

export default function DnsLookup() {
    const [domain, setDomain] = useState('');
    const [type, setType] = useState('A');
    const { records, loading, error, lookup, getTypeName } = useDnsLookup();

    function handleSubmit() {
        const d = domain.trim();
        if (!d) return;
        lookup(d, type);
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter') handleSubmit();
    }

    function handleTypeChange(e: SelectChangeEvent) {
        setType(e.target.value);
    }

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h5" fontWeight="bold" mb={3}>
                🌐 DNS Lookup
            </Typography>

            {/* Input */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    fullWidth
                    label="Enter domain"
                    placeholder="e.g. google.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                />

                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Type</InputLabel>
                    <Select value={type} label="Type" onChange={handleTypeChange}>
                        {RECORD_TYPES.map((t) => (
                            <MenuItem key={t} value={t}>{t}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading || !domain.trim()}
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

            {/* Results */}
            {records.length > 0 && (
                <TableContainer component={Paper} elevation={2}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'grey.100' }}>
                                <TableCell><b>Name</b></TableCell>
                                <TableCell><b>Type</b></TableCell>
                                <TableCell><b>TTL</b></TableCell>
                                <TableCell><b>Value</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {records.map((record, index) => {
                                const typeName = getTypeName(record.type);
                                return (
                                    <TableRow key={index} hover>
                                        <TableCell sx={{ fontFamily: 'monospace' }}>
                                            {record.name}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={typeName}
                                                color={TYPE_COLORS[typeName] ?? 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{record.TTL}s</TableCell>
                                        <TableCell sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                            {record.data}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}