import { describe, it } from '@jest/globals';
import { createTemplateEngine, OperationTemplate, templateReferencePrefix } from '../template';
import { reference, ReferenceExtractor } from '../reference';
import { createExecutor } from '../executor';

export type TestInterface = {
    add: (input: { a: number; b: number }) => Promise<number>;
    createUser: (input: { firstName: string; lastName: string }) => Promise<{ age: number; fullName: string }>;
};

const executor = createExecutor<TestInterface>({
    add: async ({ a, b }) => a + b,
    createUser: async ({ firstName, lastName }) => ({ age: 20, fullName: `${firstName} ${lastName}` }),
});
export const operations = createTemplateEngine<TestInterface>();

function* createUserAndAddTwoToAge(
    ref: <I, O>(template: OperationTemplate<TestInterface, I, O>) => ReferenceExtractor<O>,
) {
    const user = operations.createUser({ firstName: 'John', lastName: 'Smith' });
    yield user;

    const sum = operations.add({ a: ref(user).age, b: 2 });
    yield sum;

    const sum2 = operations.add({ a: ref(sum), b: 3 });
    yield sum2;
}

const pipe = (
    generatorFunction: (
        ref: <I, O>(template: OperationTemplate<TestInterface, I, O>) => ReferenceExtractor<O>,
    ) => Generator<OperationTemplate<TestInterface, any, any>>,
) => {
    const templates: OperationTemplate<TestInterface, any, any>[] = [];

    let refIndex = -1;
    const ref = <I, O>(template: OperationTemplate<TestInterface, I, O>): ReferenceExtractor<O> =>
        reference(`${templateReferencePrefix}${refIndex}`);

    const generator = generatorFunction(ref);

    while (true) {
        const template = generator.next();
        if (template.value) templates.push(template.value);
        if (template.done) break;

        refIndex++;
    }

    return templates.flatMap((template) => template.toJSON());
};

describe('generator', () => {
    it('should be able to generate a composed template', async () => {
        const data = pipe(createUserAndAddTwoToAge);
        const result = await executor.execute({ data });

        expect(result.data![0].age).toBe(20);
        expect(result.data![1]).toBe(22);
        expect(result.data![2]).toBe(25);
    });
});
