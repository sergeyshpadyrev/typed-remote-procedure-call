import { createExecutor, ExecutionRequest } from '../executor';
import { describe, it } from '@jest/globals';
import { createCaller } from '.';

export type TestInterface = {
    add: (input: { a: number; b: number }) => Promise<number>;
};

export const executor = createExecutor<TestInterface>({
    add: async (input) => input.a + input.b,
});

export const caller = createCaller<TestInterface>({
    handle: async (request: ExecutionRequest) => executor.execute(request),
});

describe('caller', () => {
    it('should call operation', async () => {
        const result = await caller.add({ a: 1, b: 2 });
        expect(result).toEqual(3);
    });
});
