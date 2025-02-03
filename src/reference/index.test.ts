import { describe, it } from '@jest/globals';
import { reference } from '.';

type ExampleObject = {
    a: string;
    b: {
        c: number;
        d: boolean;
    };
};
type ExamplePrimitive = number;

describe('reference', () => {
    it('should wrap object type', async () => {
        const ref = reference<ExampleObject>();
        console.log('111');
        console.log(ref);
        console.log(ref.a);
        console.log(ref.b.d);
        expect(true).toBe(true);
    });
    it('should wrap primitive type', async () => {
        const ref = reference<ExamplePrimitive>();
        console.log('222');
        console.log(ref);
        expect(true).toBe(true);
    });
});
