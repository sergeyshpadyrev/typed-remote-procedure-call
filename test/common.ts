import { createExecutor, createTemplateEngine } from '../src';

export type TestInterface = {
    add: (input: { a: number; b: number }) => Promise<number>;
    addOne: (input: number) => Promise<number>;
};

export const executor = createExecutor<TestInterface>({
    add: async (input) => input.a + input.b,
    addOne: async (input) => input + 1,
});

export const templateEngine = createTemplateEngine<TestInterface>();
