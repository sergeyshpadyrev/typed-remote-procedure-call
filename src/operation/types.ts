export type Operation<Input, Output> = (input: Input) => Promise<Output>;
export interface OperationAPI {
    [id: string]: Operation<any, any>;
}
