export type HistoryEntry = {
    id: string;
    type: 'IP Lookup' | 'DNS Lookup' | 'Subnet' | 'Port Check';
    input: string;
    result: string;
    createdAt: string;
};

const STORAGE_KEY = 'network-toolkit-history';

export function getHistory(): HistoryEntry[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
    } catch {
        return [];
    }
}

export function addHistory(entry: Omit<HistoryEntry, 'id' | 'createdAt'>): void {
    const history = getHistory();
    const newEntry: HistoryEntry = {
        ...entry,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify([newEntry, ...history]));
}

export function clearHistory(): void {
    localStorage.removeItem(STORAGE_KEY);
}

/** Escape a value for safe CSV output — prevents formula injection and quote breakage */
function escapeCsvValue(val: string): string {
    const escaped = val.replace(/"/g, '""');
    // Prefix formula-triggering characters to prevent DDE attacks in Excel
    if (/^[=+\-@\t\r]/.test(escaped)) return `"'${escaped}"`;
    return `"${escaped}"`;
}

export function exportToCsv(entries: HistoryEntry[]): void {
    const header = 'Type,Input,Result,Date\n';
    const rows = entries.map((e) =>
        [
            escapeCsvValue(e.type),
            escapeCsvValue(e.input),
            escapeCsvValue(e.result),
            escapeCsvValue(new Date(e.createdAt).toLocaleString()),
        ].join(',')
    );
    const csv = header + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `network-toolkit-history-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}