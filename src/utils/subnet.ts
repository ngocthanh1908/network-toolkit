type SubnetInfo = {
    ipAddress: string;
    subnetMask: string;
    networkAddress: string;
    broadcastAddress: string;
    firstHost: string;
    lastHost: string;
    totalHosts: number;
    usableHosts: number;
    cidr: number;
    ipClass: string;
    ipType: string;
};

function ipToNumber(ip: string): number {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
}

function numberToIp(num: number): string {
    return [
        (num >>> 24) & 255,
        (num >>> 16) & 255,
        (num >>> 8) & 255,
        num & 255,
    ].join('.');
}

function getIpClass(ip: string): string {
    const first = parseInt(ip.split('.')[0]);
    if (first >= 1 && first <= 126) return 'A';
    if (first >= 128 && first <= 191) return 'B';
    if (first >= 192 && first <= 223) return 'C';
    if (first >= 224 && first <= 239) return 'D (Multicast)';
    return 'E (Reserved)';
}

function getIpType(ip: string): string {
    const parts = ip.split('.').map(Number);
    if (parts[0] === 10) return 'Private';
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return 'Private';
    if (parts[0] === 192 && parts[1] === 168) return 'Private';
    if (parts[0] === 127) return 'Loopback';
    if (parts[0] === 169 && parts[1] === 254) return 'Link-local';
    return 'Public';
}

export function calculateSubnet(cidr: string): SubnetInfo | null {
    const parts = cidr.trim().split('/');
    if (parts.length !== 2) return null;

    const ip = parts[0];
    const prefix = parseInt(parts[1]);

    if (prefix < 0 || prefix > 32) return null;

    const ipParts = ip.split('.').map(Number);
    if (ipParts.length !== 4 || ipParts.some((p) => p < 0 || p > 255)) return null;

    const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
    const ipNum = ipToNumber(ip);
    const networkNum = (ipNum & mask) >>> 0;
    const broadcastNum = (networkNum | ~mask) >>> 0;
    const totalHosts = Math.pow(2, 32 - prefix);
    const usableHosts = prefix >= 31 ? totalHosts : totalHosts - 2;

    return {
        ipAddress: ip,
        subnetMask: numberToIp(mask),
        networkAddress: numberToIp(networkNum),
        broadcastAddress: numberToIp(broadcastNum),
        firstHost: prefix >= 31 ? numberToIp(networkNum) : numberToIp(networkNum + 1),
        lastHost: prefix >= 31 ? numberToIp(broadcastNum) : numberToIp(broadcastNum - 1),
        totalHosts,
        usableHosts: Math.max(0, usableHosts),
        cidr: prefix,
        ipClass: getIpClass(ip),
        ipType: getIpType(ip),
    };
}