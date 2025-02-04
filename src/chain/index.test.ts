import { chain } from '.';
import { createTemplateEngine } from '../template';
import { createExecutor } from '../executor';
import { describe, it } from '@jest/globals';

export type TestInterface = {
    add: (input: { a: number; b: number }) => Promise<number>;
    createUser: (input: { firstName: string; lastName: string }) => Promise<{ age: number; fullName: string }>;
};

const executor = createExecutor<TestInterface>({
    add: async ({ a, b }) => a + b,
    createUser: async ({ firstName, lastName }) => ({ age: 20, fullName: `${firstName} ${lastName}` }),
});
export const operations = createTemplateEngine<TestInterface>();

describe('chain', () => {
    it('should be able to chain a list of composed template', async () => {
        const template = chain((next) => {
            const user = next(operations.createUser({ firstName: 'John', lastName: 'Smith' }));
            const sum = next(operations.add({ a: user.age, b: 2 }));
            return next(operations.add({ a: sum, b: 3 }));
        });
        expect(template).toBeDefined();

        const data = template!.toJSON();
        const response = await executor.execute({ data });
        const result = response.data!;

        expect(result[0].age).toBe(20);
        expect(result[1]).toBe(22);
        expect(result[2]).toBe(25);
    });

    it('should be able to create a chain operation', async () => {
        const template = chain((next) => {
            const user = next(operations.createUser({ firstName: 'John', lastName: 'Smith' }));
            const sum = next(operations.add({ a: user.age, b: 2 }));
            return next(operations.add({ a: sum, b: 3 }));
        });
        expect(template).toBeDefined();

        const data = template!.toJSON();
        const response = await executor.execute({ data });
        const result = response.data!;

        expect(result[0].age).toBe(20);
        expect(result[1]).toBe(22);
        expect(result[2]).toBe(25);
    });
});
