import { ExecutionRequest, ExecutionResponse, Executor } from './types';
import { OperationAPI } from '../operation';
import { templateReferencePrefix } from '../template';

export const createExecutor = <API extends OperationAPI>(operations: API): Executor => ({
    execute: async (request: ExecutionRequest): Promise<ExecutionResponse> => {
        try {
            const results: any[] = [];

            const dereference = (input: any): any => {
                if (typeof input === 'string' && input.startsWith(templateReferencePrefix)) {
                    const fullPath = input.replace(templateReferencePrefix, '').split('.');
                    const index = parseInt(fullPath[0]);
                    const path = fullPath.slice(1).join('.');

                    const result = results[index];
                    return path.length > 0 ? result[path] : result;
                }

                if (typeof input !== 'object' || input === null) return input;

                return Object.assign({}, ...Object.keys(input).map((key) => ({ [key]: dereference(input[key]) })));
            };

            for (const line of request.data) {
                const input = dereference(line.input);
                const result = await operations[line.name as string](input);
                results.push(result);
            }

            return { data: results };
        } catch (error: any) {
            return { error: error.message };
        }
    },
});

export type * from './types';
