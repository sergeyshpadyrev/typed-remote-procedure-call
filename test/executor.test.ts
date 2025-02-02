import { describe, it, expect } from '@jest/globals';
import { executor, TestInterface } from './common';
import { ExecutionRequest, OperationTemplateConfig } from '../src';

describe('executor', () => {
    it('should execute one operation', async () => {
        const template = [{ name: 'add', input: { a: 1, b: 2 } }] as OperationTemplateConfig<TestInterface>;
        const request = { template } as ExecutionRequest;
        const response = await executor.execute(request);
        expect(response.data).toEqual([3]);
    });

    it('should execute two operations', async () => {
        const template = [
            { name: 'add', input: { a: 1, b: 2 } },
            { name: 'add', input: { a: { type: '$ref', value: '$0' }, b: 3 } },
        ] as OperationTemplateConfig<TestInterface>;
        const request = { template } as ExecutionRequest;
        const response = await executor.execute(request);
        expect(response.data).toEqual([3, 6]);
    });
});
