import { ExecutionRequest, ExecutionResponse, Executor } from './types';
import { OperationAPI } from '../types';

export const createExecutor = <API extends OperationAPI>(operations: API): Executor => ({
    execute: async (request: ExecutionRequest): Promise<ExecutionResponse> => {
        try {
            const results: any[] = [];

            const derefer = (input: any): any => {
                if (typeof input !== 'object' || input === null) return input;
                if (input.type !== '$ref')
                    return Object.assign({}, ...Object.keys(input).map((key) => ({ [key]: derefer(input[key]) })));

                const fullPath = input.value.replace('$', '').split('.');
                const index = parseInt(fullPath[0]);
                const path = fullPath.slice(1).join('.');

                const result = results[index];
                return path.length > 0 ? result[path] : result;
            };

            for (const line of request.data) {
                const input = derefer(line.input);
                const result = await operations[line.name as string](input);
                results.push(result);
            }

            return { data: results };
        } catch (error: any) {
            return { error: error.message };
        }
    },
});
