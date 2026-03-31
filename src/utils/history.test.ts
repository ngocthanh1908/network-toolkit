import { describe, it, expect, beforeEach } from 'vitest';
import { getHistory, addHistory, clearHistory } from './history';

beforeEach(() => {
    localStorage.clear();
});

describe('history utils', () => {
    it('returns empty array when no history', () => {
        expect(getHistory()).toEqual([]);
    });

    it('adds and retrieves history entries', () => {
        addHistory({ type: 'IP Lookup', input: '8.8.8.8', result: 'Google' });
        const entries = getHistory();
        expect(entries).toHaveLength(1);
        expect(entries[0].type).toBe('IP Lookup');
        expect(entries[0].input).toBe('8.8.8.8');
        expect(entries[0].id).toBeDefined();
        expect(entries[0].createdAt).toBeDefined();
    });

    it('prepends new entries (newest first)', () => {
        addHistory({ type: 'IP Lookup', input: '1.1.1.1', result: 'first' });
        addHistory({ type: 'DNS Lookup', input: 'google.com (A)', result: 'second' });
        const entries = getHistory();
        expect(entries).toHaveLength(2);
        expect(entries[0].type).toBe('DNS Lookup');
        expect(entries[1].type).toBe('IP Lookup');
    });

    it('clears all history', () => {
        addHistory({ type: 'IP Lookup', input: '8.8.8.8', result: 'test' });
        clearHistory();
        expect(getHistory()).toEqual([]);
    });
});
