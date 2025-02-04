import { ExecutionRequest } from '../executor';
import { OperationAPI } from '../operation';
import { createTemplateEngine } from '../template';
import { OperationCallerProps } from './types';

export const createRPC = <API extends OperationAPI>(props: OperationCallerProps) => {
    const operations = createTemplateEngine<API>();
    const call = new Proxy(
        {},
        {
            get: (_target, prop) => {
                if (typeof prop === 'string') {
                    return async (input: any) => {
                        try {
                            const template = operations[prop](input);
                            const request: ExecutionRequest = { data: template.toJSON() };
                            const response = await props.process(request);

                            if (response.error) throw new Error(response.error);
                            return response.data![response.data!.length - 1];
                        } catch (error) {
                            throw new Error(`Caller error: ${error}`);
                        }
                    };
                }
            },
        },
    ) as API;
    return {
        call,
    };
};
