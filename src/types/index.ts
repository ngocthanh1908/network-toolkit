export type IpInfo = {
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