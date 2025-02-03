import { ReferenceExtractor } from './types';

export const reference = <T>(path: string = '$'): ReferenceExtractor<T> =>
    new Proxy(
        { _path: path },
        {
            get(target, prop) {
                if (typeof prop === 'string') {
                    const newPath = `${path}.${prop}`;
                    return reference(newPath);
                }
            },
        },
    ) as ReferenceExtractor<T>;
