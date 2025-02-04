import { chain as chainFn } from '../chain';
import { ExecutionRequest } from '../executor';
import { OperationAPI } from '../operation';
import { createTemplateEngine, OperationTemplateEngine } from '../template';
import { OperationCallerProps } from './types';

export const createRPC = <API extends OperationAPI>(props: OperationCallerProps) => {
    const operations = createTemplateEngine<API>();

    const execute = async (request: ExecutionRequest) => {
        try {
            const response = await props.process(request);
            if (response.error) throw new Error(response.error);
            return response.data![response.data!.length - 1];
        } catch (error) {
            throw new Error(`RPC error: ${error}`);
        }
    };

    const call = new Proxy(
        {},
        {
            get: (_target, prop) => {
                if (typeof prop === 'string') {
                    return async (input: any) => {
                        const template = operations[prop](input);
                        return execute({ data: template.toJSON() });
                    };
                }
            },
        },
    ) as API;

    const chain = <LastOutput>(props: {
        next: Parameters<typeof chainFn<API, LastOutput>>[0];
        operations: OperationTemplateEngine<API>;
    }): Promise<LastOutput> => {
        const template = chainFn<API, LastOutput>(props.next);
        return execute({ data: template.toJSON() });
    };

    return {
        call,
        chain,
    };
};
