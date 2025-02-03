import { createExecutor, ExecutionRequest } from '.';
import { describe, it, expect } from '@jest/globals';
import { OperationTemplateJSON, templateReferencePrefix } from '../template';

export type TestInterface = {
    add: (input: { a: number; b: number }) => Promise<number>;
};

export const executor = createExecutor<TestInterface>({
    add: async (input) => input.a + input.b,
});

describe('executor', () => {
    it('should execute one operation', async () => {
        const data = [{ name: 'add', input: { a: 1, b: 2 } }] as OperationTemplateJSON<TestInterface>;
        const request = { data } as ExecutionRequest;
        const response = await executor.execute(request);
        expect(response.data).toEqual([3]);
    });

    it('should execute two operations', async () => {
        const data = [
            { name: 'add', input: { a: 1, b: 2 } },
            { name: 'add', input: { a: `${templateReferencePrefix}0`, b: 3 } },
        ] as OperationTemplateJSON<TestInterface>;
        const request = { data } as ExecutionRequest;
        const response = await executor.execute(request);
        expect(response.data).toEqual([3, 6]);
    });
});
