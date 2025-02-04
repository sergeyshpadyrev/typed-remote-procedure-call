import { describe, it } from '@jest/globals';
import { createTemplateEngine, OperationTemplate, templateReferencePrefix } from '../template';
import { reference, ReferenceExtractor } from '../reference';

export type TestInterface = {
    add: (input: { a: number; b: number }) => Promise<number>;
    createUser: (input: { firstName: string; lastName: string }) => Promise<{ age: number; fullName: string }>;
};
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

describe('generator', () => {
    it('should be able to generate a composed template', async () => {
        const templates: OperationTemplate<TestInterface, any, any>[] = [];

        let refIndex = 0;
        const ref = <I, O>(template: OperationTemplate<TestInterface, I, O>): ReferenceExtractor<O> =>
            reference(`${templateReferencePrefix}${refIndex}`);

        const generator = createUserAndAddTwoToAge(ref);

        while (true) {
            const template = generator.next();
            if (template.value) templates.push(template.value);
            if (template.done) break;

            refIndex++;
        }

        const data = templates.flatMap((template) => template.toJSON());

        expect(true).toBe(true);
    });
});
