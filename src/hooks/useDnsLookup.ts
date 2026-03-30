import { useState } from 'react';

type DnsRecord = {
    name: string;
    type: number;
    TTL: number;
    data: string;
};

type DnsResponse = {
    Status: number;
    Answer?: DnsRecord[];
    Authority?: DnsRecord[];
    Question?: { name: string; type: number }[];
};

const DNS_TYPES: Record<number, string> = {
    1: 'A',
    2: 'NS',
    5: 'CNAME',
    15: 'MX',
    16: 'TXT',
    28: 'AAAA',
    33: 'SRV',
};

export function useDnsLookup() {
    const [records, setRecords] = useState<DnsRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function getTypeName(typeNum: number): string {
        return DNS_TYPES[typeNum] ?? String(typeNum);
    }

    async function lookup(domain: string, type: string) {
        setLoading(true);
        setError(null);
        setRecords([]);

        try {
            const url = `https://dns.google/resolve?name=${domain}&type=${type}`;
            const res = await fetch(url);
            const json = await res.json() as DnsResponse;

            if (json.Status !== 0) {
                setError('Domain not found or DNS query failed');
                return;
            }

            const answers = json.Answer ?? json.Authority ?? [];
            if (answers.length === 0) {
                setError(`No ${type} records found for ${domain}`);
                return;
            }

            setRecords(answers);
        } catch {
            setError('Network error — please try again');
        } finally {
            setLoading(false);
        }
    }

    return { records, loading, error, lookup, getTypeName };
}