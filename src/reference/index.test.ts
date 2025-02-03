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
        const ref = reference<ExampleObject>('$0');
        expect(ref._path).toEqual('$0');
        expect(ref.a._path).toEqual('$0.a');
        expect(ref.b._path).toEqual('$0.b');
        expect(ref.b.c._path).toEqual('$0.b.c');
        expect(ref.b.d._path).toEqual('$0.b.d');
    });
    it('should wrap primitive type', async () => {
        const ref = reference<ExamplePrimitive>('$0');
        expect(ref._path).toEqual('$0');
    });
});
