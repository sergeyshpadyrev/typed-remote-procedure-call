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

    it('should be called with one param and return number', async () => {
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

    it('should be called with two params and return number', async () => {
        type TestInterface = { test: (a: number, b: number) => Promise<number> };
        const receiver = createRpcReceiver<TestInterface>({
            implementation: { test: async (a: number, b: number) => a + b },
        });

        const sender = createRpcSender<TestInterface>({
            send: async (request: JsonRpcRequest) => receiver.receive(request),
        });

        const result = await sender.test(1, 2);
        expect(result).toBe(3);
    });

    it('should be called with complex params and return complex result', async () => {
        type TestInterface = {
            test: (a: { b: number; c: string }, d: { e: number; f: string }) => Promise<{ x: number; y: string }>;
        };
        const receiver = createRpcReceiver<TestInterface>({
            implementation: { test: async (a, d) => ({ x: a.b + d.e, y: a.c + d.f }) },
        });

        const sender = createRpcSender<TestInterface>({
            send: async (request: JsonRpcRequest) => receiver.receive(request),
        });

        const result = await sender.test({ b: 1, c: 'a' }, { e: 2, f: 'b' });
        expect(result).toEqual({ x: 3, y: 'ab' });
    });

    it('should be able to handle multiple commands', async () => {
        type TestInterface = {
            test1: (a: number) => Promise<number>;
            test2: (b: number) => Promise<number>;
        };
        const receiver = createRpcReceiver<TestInterface>({
            implementation: {
                test1: async (a: number) => a + 1,
                test2: async (b: number) => b + 2,
            },
        });

        const sender = createRpcSender<TestInterface>({
            send: async (request: JsonRpcRequest) => receiver.receive(request),
        });

        const result1 = await sender.test1(1);
        const result2 = await sender.test2(2);

        expect(result1).toEqual(2);
        expect(result2).toEqual(4);
    });
});
