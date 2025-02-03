export type ExecutionRequest = {
    data: any;
};

export type ExecutionResponse = {
    data?: any[];
    error?: string;
};

export type Executor = {
    execute: (request: ExecutionRequest) => Promise<ExecutionResponse>;
};
