import { createRpcReceiver, createRpcSender, JsonRpcRequest } from '../src';
import { describe, it, expect } from '@jest/globals';

describe('rpc', () => {
    it('should be called with no params and return number', async () => {
        type TestInterface = { test: () => Promise<number> };
        const receiver = createRpcReceiver<TestInterface>({
            implementation: { test: async () => 1 },
        });

        const sender = createRpcSender<TestInterface>({
            send: async (request: JsonRpcRequest) => receiver.receive(request),
        });

        const result = await sender.test();
        expect(result).toBe(1);
    });

    it('should return number', async () => {
        type TestInterface = { test: (a: number) => Promise<number> };
        const receiver = createRpcReceiver<TestInterface>({
            implementation: { test: async (a: number) => a + 1 },
        });

        const sender = createRpcSender<TestInterface>({
            send: async (request: JsonRpcRequest) => receiver.receive(request),
        });

        const result = await sender.test(1);
        expect(result).toBe(2);
    });
});
