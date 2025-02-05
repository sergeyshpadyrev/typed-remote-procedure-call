import { createExecutor, ExecutionRequest } from '../executor';
import { createRPC } from '.';
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

describe('RPC', () => {
    it('should be able to call operations one by one', async () => {
        const user = await rpc.call.createUser({ firstName: 'John', lastName: 'Doe' });
        expect(user).toEqual({ age: 20, fullName: 'John Doe' });

        const sum = await rpc.call.add({ a: user.age, b: 2 });
        expect(sum).toEqual(22);
    });

    it('should be able to call operations in chain', async () => {
        const sum = await rpc.chain((call) => {
            const user = call.createUser({ firstName: 'John', lastName: 'Doe' });
            return call.add({ a: user.age, b: 2 });
        });
        expect(sum).toEqual(22);
    });
});
