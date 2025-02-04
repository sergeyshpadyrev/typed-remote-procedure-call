import { createRPC, createExecutor, ExecutionRequest } from '.';
import { describe, it } from '@jest/globals';

export type TestInterface = {
    add: (input: { a: number; b: number }) => Promise<number>;
    createUser: (input: { firstName: string; lastName: string }) => Promise<{ age: number; fullName: string }>;
};

export const executor = createExecutor<TestInterface>({
    add: async (input) => input.a + input.b,
    createUser: async (input: { firstName: string; lastName: string }) => ({
        age: 20,
        fullName: `${input.firstName} ${input.lastName}`,
    }),
});

const rpc = createRPC<TestInterface>({
    process: async (request: ExecutionRequest) => executor.execute(request),
});

describe('Library', () => {
    it('should be able to call operations one by one', async () => {
        const sum = await rpc.call.add({ a: 1, b: 2 });
        expect(sum).toEqual(3);
    });
});
