import {
    ExecutionRequest,
    ExecutionResponse,
    Executor,
    OperationAPI,
    OperationTemplateConfig,
    OperationTemplate,
} from './types';

// export class OperationTemplate<API extends OperationAPI, Input, Output> {
//     constructor(private readonly templateJSON: OperationTemplateJSON) {}

//     compose<T>(template: OperationTemplate<API, Output, T>): OperationTemplate<API, Input, T> {
//         return null as any;
//     }

//     fromResponse(response: ExecutionResponse): OperationState<API, Input, Output> {
//         return null as any;
//     }

//     toRequest(input: Input): ExecutionRequest {
//         return { template: this.templateJSON };
//     }
// }

const createTemplate = <API extends OperationAPI, Input, Output>(config: OperationTemplateConfig<API>) => ({
    compose: <T>(template: OperationTemplate<API, Output, T>) => createTemplate<API, Input, T>([]),
    toRequest: (input: Input): ExecutionRequest => ({ template: config }),
});

export const createExecutor = <API extends OperationAPI>(operations: API): Executor => ({
    execute: async (request: ExecutionRequest): Promise<ExecutionResponse> => {
        try {
            const results: any[] = [];

            const deref = (input: any): any => {
                if (typeof input !== 'object' || input === null) return input;
                if (input.type !== '$ref')
                    return Object.assign({}, ...Object.keys(input).map((key) => ({ [key]: deref(input[key]) })));

                const fullPath = input.value.replace('$', '').split('.');
                const index = parseInt(fullPath[0]);
                const path = fullPath.slice(1).join('.');

                const result = results[index];
                return path.length > 0 ? result[path] : result;
            };

            for (const line of request.template) {
                const input = deref(line.input);
                const result = await operations[line.name as string](input);
                results.push(result);
            }

            return { data: results };
        } catch (error: any) {
            return { error: error.message };
        }
    },
});

// export const createChainer = <T extends OperationsAPI>(): Chainer<T> =>
//     new Proxy(
//         {},
//         {
//             get: (_target, prop) => {
//                 if (typeof prop === 'string') {
//                     return async (input: any) => {
//                         console.log(input);
//                         return null;
//                     };
//                 }
//             },
//         },
//     ) as Chainer<T>;

// export const createExecutor = <T extends OperationsAPI>(operations: T): Executor<T> => ({
//     execute: <Output>(chain: OperationChain<any, Output>): Promise<Output> => {
//         return null as any;
//     },
// });

export type * from './types';
