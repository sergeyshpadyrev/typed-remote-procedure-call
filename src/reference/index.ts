import { ReferenceExtractor } from './types';

export const reference = <T>(path: string): ReferenceExtractor<T> =>
    new Proxy(
        {},
        {
            get(target, prop) {
                if (typeof prop !== 'string') throw new Error("Can't access proxy value");
                if (prop === '_path') return path;

                const newPath = `${path}.${prop}`;
                return reference(newPath);
            },
        },
    ) as ReferenceExtractor<T>;

export type * from './types';
