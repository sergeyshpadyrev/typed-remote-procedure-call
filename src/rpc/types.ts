import { ExecutionRequest, ExecutionResponse } from '../executor';
import { OperationAPI } from '../operation';
import { ReferenceExtractor } from '../reference';
import { OperationTemplateInput } from '../template';

export interface OperationCallerProps {
    process: (request: ExecutionRequest) => Promise<ExecutionResponse>;
}

export type OperationChainEngine<API extends OperationAPI> = {
    [K in keyof API]: (
        input: OperationTemplateInput<Parameters<API[K]>[0]>,
    ) => ReferenceExtractor<Awaited<ReturnType<API[K]>>>;
};
