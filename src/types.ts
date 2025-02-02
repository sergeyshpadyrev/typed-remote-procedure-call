// -------------------------------
// OPERATIONS TYPES (BEGINNING)
// -------------------------------

export type Operation<Input, Output> = (input: Input) => Promise<Output>;
export interface OperationAPI {
    [id: string]: Operation<any, any>;
}

export interface OperationTemplate<API extends OperationAPI, Input, Output> {
    then: <T>(
        composition: (output: OperationTemplateReferer<Output>) => OperationTemplate<API, Input, T>,
    ) => OperationTemplate<API, Input, T>;
    toConfig: () => OperationTemplateConfig<API>;
    toRequest: () => ExecutionRequest;
}
export type OperationTemplateEngine<API extends OperationAPI> = {
    [K in keyof API]: (
        input: OperationTemplateInput<Parameters<API[K]>[0]>,
    ) => OperationTemplate<API, Parameters<API[K]>[0], Awaited<ReturnType<API[K]>>>;
};

export type OperationTemplateRef<T> = string | T;
export type OperationTemplateReferer<T, P extends string = ''> = T extends object
    ? { __path: () => P } & {
          [K in keyof T]: OperationTemplateReferer<
              T[K],
              P extends '' ? Extract<K, string> : `${P}.${Extract<K, string>}`
          >;
      }
    : { __path: () => P };

// export type OperationTemplateReferer<T> = {
//     __path: () => OperationTemplateRef<T>;
// } & (T extends object ? { [K in keyof T]: OperationTemplateReferer<T[K]> } : {});

export type OperationTemplateInput<T> = T extends object
    ? {
          [K in keyof T]: T[K] extends object ? OperationTemplateInput<T[K]> : T[K] | OperationTemplateRef<T[K]>;
      }
    : T | OperationTemplateRef<T>;

export type OperationTemplateConfig<API extends OperationAPI> = OperationTemplateConfigLine<API>[];
export type OperationTemplateConfigLine<API extends OperationAPI> = {
    name: keyof API;
    input: OperationTemplateConfigRef | any;
};
export type OperationTemplateConfigRef = { type: '$ref'; value: string };

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
