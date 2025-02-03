import { OperationTemplateJSON } from '../template';

export type ExecutionRequest = {
    data: OperationTemplateJSON<any>;
};

export type ExecutionResponse = {
    data?: any[];
    error?: string;
};

export type Executor = {
    execute: (request: ExecutionRequest) => Promise<ExecutionResponse>;
};
