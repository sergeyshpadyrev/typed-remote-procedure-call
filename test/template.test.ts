import { describe, it } from '@jest/globals';
import { templateEngine } from './common';

describe('template engine', () => {
    it('should return template', async () => {
        const template = templateEngine.add({ a: 1, b: 2 });

        const request = template.toRequest();
        expect(request).toEqual({ template: [{ name: 'add', input: { a: 1, b: 2 } }] });
    });

    it('should compose template', async () => {
        const composed = templateEngine
            .add({ a: 1, b: 2 })
            .then((result) => templateEngine.addOne(result.sum.__path()));
        const request = composed.toRequest();

        expect(request).toEqual({
            template: [
                { name: 'add', input: { a: 1, b: 2 } },
                { name: 'addOne', input: { type: '$ref', value: '$0' } },
            ],
        });
    });
});
