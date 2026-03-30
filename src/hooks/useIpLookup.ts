import { useState } from 'react';

type IpInfo = {
    status: string;
    country: string;
    countryCode: string;
    regionName: string;
    city: string;
    zip: string;
    lat: number;
    lon: number;
    timezone: string;
    isp: string;
    org: string;
    query: string;
    message?: string;
};

export function useIpLookup() {
    const [data, setData] = useState<IpInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function lookup(ip: string) {
        setLoading(true);
        setError(null);
        setData(null);

        try {
            const res = await fetch(`http://ip-api.com/json/${ip}`);
            const json = await res.json() as IpInfo;

            if (json.status === 'fail') {
                setError(json.message ?? 'Invalid IP address');
            } else {
                setData(json);
            }
        } catch {
            setError('Network error — please try again');
        } finally {
            setLoading(false);
        }
    }

    return { data, loading, error, lookup };
}