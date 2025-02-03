export type Reference<T, P extends string = ''> = { _path: P } | T;

export type ReferenceExtractor<T, P extends string = ''> = Reference<T, P> & T extends object
    ? {
          [K in keyof T]: ReferenceExtractor<T[K], P extends '' ? Extract<K, string> : `${P}.${Extract<K, string>}`>;
      }
    : {};
