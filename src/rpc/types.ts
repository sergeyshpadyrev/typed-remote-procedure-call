import { ExecutionRequest, ExecutionResponse } from '../executor';

export interface OperationCallerProps {
    process: (request: ExecutionRequest) => Promise<ExecutionResponse>;
}
