import { createExecutor, createTemplateEngine, ExecutionRequest } from '.';
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

const operations = createTemplateEngine<TestInterface>();

describe('Library', () => {
    it('should be able to create and execute one operation', async () => {
        const template = operations.add({ a: 1, b: 2 });
        const data = template.toJSON();
        const request = { data } as ExecutionRequest;
        const response = await executor.execute(request);
        expect(response.data).toEqual([3]);
    });

    it('should be able to create and execute two composed operations', async () => {
        const template = operations
            .createUser({ firstName: 'John', lastName: 'Smith' })
            .then((user) => operations.add({ a: user.age, b: 2 }));
        const data = template.toJSON();
        const request = { data } as ExecutionRequest;
        const response = await executor.execute(request);
        expect(response.data).toEqual([{ age: 20, fullName: 'John Smith' }, 22]);
    });
});
