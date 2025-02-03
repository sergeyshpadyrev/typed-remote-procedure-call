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
        expect(ref._path).toEqual('$');
        expect(ref.a._path).toEqual('$.a');
        expect(ref.b._path).toEqual('$.b');
        expect(ref.b.c._path).toEqual('$.b.c');
        expect(ref.b.d._path).toEqual('$.b.d');
    });
    it('should wrap primitive type', async () => {
        const ref = reference<ExamplePrimitive>();
        expect(ref._path).toEqual('$');
    });
});
