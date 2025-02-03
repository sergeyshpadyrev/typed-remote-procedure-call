import { OperationAPI } from '../operation';
import { Primitive, Reference, ReferenceExtractor } from '../reference';

export type OperationTemplateJSON<API extends OperationAPI> = OperationTemplateJSONLine<API>[];
export type OperationTemplateJSONLine<API extends OperationAPI> = { name: keyof API; input: any };

export interface OperationTemplate<API extends OperationAPI, Input, Output> {
    then: <T>(
        composition: (output: ReferenceExtractor<Output>) => OperationTemplate<API, Input, T>,
    ) => OperationTemplate<API, Input, T>;
    toJSON: () => OperationTemplateJSON<API>;
}
export type OperationTemplateInput<T> = T extends Primitive
    ? Reference<T, any> | T
    : {
          [K in keyof T]: OperationTemplateInput<T[K]>;
      };

export type OperationTemplateEngine<API extends OperationAPI> = {
    [K in keyof API]: (
        input: OperationTemplateInput<Parameters<API[K]>[0]>,
    ) => OperationTemplate<API, Parameters<API[K]>[0], Awaited<ReturnType<API[K]>>>;
};
