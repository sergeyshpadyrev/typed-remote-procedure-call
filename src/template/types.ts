import { OperationAPI } from '../operation';
import { Reference, ReferenceExtractor } from '../reference';

export type OperationTemplateJSON<API extends OperationAPI> = OperationTemplateJSONLine<API>[];
export type OperationTemplateJSONLine<API extends OperationAPI> = { name: keyof API; input: any };

export interface OperationTemplate<API extends OperationAPI, Input, Output> {
    then: <T>(
        composition: (output: ReferenceExtractor<Output>) => OperationTemplate<API, Input, T>,
    ) => OperationTemplate<API, Input, T>;
    toJSON: () => OperationTemplateJSON<API>;
}

export type OperationTemplateEngine<API extends OperationAPI> = {
    [K in keyof API]: (
        input: Parameters<API[K]>[0] | Reference<Parameters<API[K]>[0]>,
    ) => OperationTemplate<API, Parameters<API[K]>[0], Awaited<ReturnType<API[K]>>>;
};
