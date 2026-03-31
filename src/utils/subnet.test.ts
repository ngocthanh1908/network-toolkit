import { describe, it, expect } from 'vitest';
import { calculateSubnet } from './subnet';

describe('calculateSubnet', () => {
    it('returns null for invalid input', () => {
        expect(calculateSubnet('')).toBeNull();
        expect(calculateSubnet('not-a-cidr')).toBeNull();
        expect(calculateSubnet('192.168.1.0')).toBeNull();
        expect(calculateSubnet('192.168.1.0/33')).toBeNull();
        expect(calculateSubnet('999.999.999.999/24')).toBeNull();
    });

    it('calculates /24 subnet correctly', () => {
        const result = calculateSubnet('192.168.1.0/24');
        expect(result).not.toBeNull();
        expect(result!.networkAddress).toBe('192.168.1.0');
        expect(result!.broadcastAddress).toBe('192.168.1.255');
        expect(result!.subnetMask).toBe('255.255.255.0');
        expect(result!.firstHost).toBe('192.168.1.1');
        expect(result!.lastHost).toBe('192.168.1.254');
        expect(result!.totalHosts).toBe(256);
        expect(result!.usableHosts).toBe(254);
        expect(result!.cidr).toBe(24);
    });

    it('calculates /8 subnet correctly', () => {
        const result = calculateSubnet('10.0.0.0/8');
        expect(result).not.toBeNull();
        expect(result!.networkAddress).toBe('10.0.0.0');
        expect(result!.subnetMask).toBe('255.0.0.0');
        expect(result!.totalHosts).toBe(16777216);
        expect(result!.ipType).toBe('Private');
        expect(result!.ipClass).toBe('A');
    });

    it('handles /32 single host', () => {
        const result = calculateSubnet('192.168.1.1/32');
        expect(result).not.toBeNull();
        expect(result!.totalHosts).toBe(1);
        expect(result!.usableHosts).toBe(1);
    });

    it('handles /31 point-to-point', () => {
        const result = calculateSubnet('192.168.1.0/31');
        expect(result).not.toBeNull();
        expect(result!.totalHosts).toBe(2);
        expect(result!.usableHosts).toBe(2);
    });

    it('identifies private vs public IPs', () => {
        expect(calculateSubnet('10.0.0.0/8')!.ipType).toBe('Private');
        expect(calculateSubnet('172.16.0.0/12')!.ipType).toBe('Private');
        expect(calculateSubnet('192.168.0.0/16')!.ipType).toBe('Private');
        expect(calculateSubnet('8.8.8.0/24')!.ipType).toBe('Public');
        expect(calculateSubnet('127.0.0.0/8')!.ipType).toBe('Loopback');
    });
});
