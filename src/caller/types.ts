import { ExecutionRequest, ExecutionResponse } from '../executor';

export interface OperationCallerProps {
    handle: (request: ExecutionRequest) => Promise<ExecutionResponse>;
}
