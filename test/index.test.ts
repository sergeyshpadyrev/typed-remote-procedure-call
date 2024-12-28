import { createCaller } from '../src';
import { describe, it, expect } from '@jest/globals';

describe('test', () => {
    it('test', () => {
        const caller = createCaller();

        expect(1).toBe(1);
    });
});
