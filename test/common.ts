import { createExecutor } from '../src';

export type TestInterface = {
    add: (input: { a: number; b: number }) => Promise<number>;
    subtract: (input: { a: number; b: number }) => Promise<number>;
    multiply: (input: { a: number; b: number }) => Promise<number>;
    divide: (input: { a: number; b: number }) => Promise<number>;
};

export const executor = createExecutor<TestInterface>({
    add: async (input) => input.a + input.b,
    subtract: async (input) => input.a - input.b,
    multiply: async (input) => input.a * input.b,
    divide: async (input) => input.a / input.b,
});
