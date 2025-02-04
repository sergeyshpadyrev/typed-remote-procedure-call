import { createExecutor, ExecutionRequest } from '../executor';
import { describe, it } from '@jest/globals';
import { createRPC } from '.';

export type TestInterface = {
    add: (input: { a: number; b: number }) => Promise<number>;
};

export const executor = createExecutor<TestInterface>({
    add: async (input) => input.a + input.b,
});

export const rpc = createRPC<TestInterface>({
    process: async (request: ExecutionRequest) => executor.execute(request),
});

describe('rpc', () => {
    it('should call operation', async () => {
        const result = await rpc.call.add({ a: 1, b: 2 });
        expect(result).toEqual(3);
    });
});
