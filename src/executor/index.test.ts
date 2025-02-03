import { createExecutor } from '.';
import { describe, it, expect } from '@jest/globals';
import { ExecutionRequest } from './types';

export type TestInterface = {
    add: (input: { a: number; b: number }) => Promise<number>;
    addOne: (input: number) => Promise<number>;
};

export const executor = createExecutor<TestInterface>({
    add: async (input) => input.a + input.b,
    addOne: async (input) => input + 1,
});

describe('executor', () => {
    it('should execute one operation', async () => {
        const data = [{ name: 'add', input: { a: 1, b: 2 } }];
        const request = { data } as ExecutionRequest;
        const response = await executor.execute(request);
        expect(response.data).toEqual([3]);
    });

    it('should execute two operations', async () => {
        const data = [
            { name: 'add', input: { a: 1, b: 2 } },
            { name: 'add', input: { a: { type: '$ref', value: '$0' }, b: 3 } },
        ];
        const request = { data } as ExecutionRequest;
        const response = await executor.execute(request);
        expect(response.data).toEqual([3, 6]);
    });
});
