import { describe, it } from '@jest/globals';
import { createTemplateEngine, templateReferencePrefix } from '.';

export type TestInterface = {
    add: (input: { a: number; b: number }) => Promise<number>;
    createUser: (input: { firstName: string; lastName: string }) => Promise<{ age: number; fullName: string }>;
};
export const operations = createTemplateEngine<TestInterface>();

describe('template', () => {
    it('should be created for one operation', async () => {
        const template = operations.add({ a: 1, b: 2 });
        const json = template.toJSON();
        expect(json).toEqual([{ name: 'add', input: { a: 1, b: 2 } }]);
    });

    it('should be created for composed operations', async () => {
        const template = operations
            .createUser({ firstName: 'John', lastName: 'Smith' })
            .compose((user) => operations.add({ a: user.age, b: 2 }));
        const json = template.toJSON();
        expect(json).toEqual([
            { name: 'createUser', input: { firstName: 'John', lastName: 'Smith' } },
            { name: 'add', input: { a: `${templateReferencePrefix}0.age`, b: 2 } },
        ]);
    });
});
