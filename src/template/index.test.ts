import { describe, it } from '@jest/globals';
import { createTemplateEngine } from '.';

export type TestInterface = {
    add: (input: { a: number; b: number }) => Promise<number>;
    createUser: (input: { firstName: string; lastName: string }) => Promise<{ age: number; fullName: string }>;
};
export const templateEngine = createTemplateEngine<TestInterface>();

describe('template', () => {
    it('should be created for one operation', async () => {
        const template = templateEngine.add({ a: 1, b: 2 });
        const json = template.toJSON();
        expect(json).toEqual([{ name: 'add', input: { a: 1, b: 2 } }]);
    });

    // it('should be created for composed operations', async () => {
    //     const template = templateEngine.createUser({ firstName: 'John', lastName: 'Smith' });
    // });
});
