// -------------------------------
// OPERATIONS TYPES (BEGINNING)
// -------------------------------

export type Operation<Input, Output> = (input: Input) => Promise<Output>;
export interface OperationAPI {
    [id: string]: Operation<any, any>;
}

export interface OperationTemplate<API extends OperationAPI, Input, Output> {
    compose<T>(template: OperationTemplate<API, Output, T>): OperationTemplate<API, Input, T>;
}

export type OperationTemplateConfig<API extends OperationAPI> = OperationTemplateConfigLine<API>[];
export type OperationTemplateConfigLine<API extends OperationAPI> = {
    name: keyof API;
    input: OperationTemplateConfigRef | any;
};
export type OperationTemplateConfigRef = { type: '$ref'; value: string };

// export type OperationState<OperationAPI, Input, Output> = {
//     input: Input;
//     name: keyof OperationAPI;
//     output: Output;
// };

// -------------------------------
// OPERATIONS TYPES (END)
// -------------------------------

export type ExecutionRequest = {
    template: OperationTemplateConfig<any>;
};

export type ExecutionResponse = {
    data?: any[];
    error?: string;
};

export type Executor = {
    execute: (request: ExecutionRequest) => Promise<ExecutionResponse>;
};
