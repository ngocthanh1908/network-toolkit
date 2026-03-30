import { useState } from 'react';
import { addHistory } from '../utils/history';

type PortResult = {
    host: string;
    port: number;
    status: 'open' | 'closed' | 'timeout';
};

export function usePortChecker() {
    const [result, setResult] = useState<PortResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function checkPort(host: string, port: number) {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const params = new URLSearchParams({ host, port: String(port) });
            const res = await fetch(
                `http://localhost:3001/api/port-check?${params}`
            );
            const json = await res.json() as PortResult;

            if ('error' in json) {
                setError(String((json as { error: string }).error));
                return;
            }

            setResult(json);
            addHistory({
                type: 'Port Check',
                input: `${host}:${port}`,
                result: json.status.toUpperCase(),
            });
        } catch {
            setError('Cannot connect to backend server — make sure it is running');
        } finally {
            setLoading(false);
        }
    }

    return { result, loading, error, checkPort };
}