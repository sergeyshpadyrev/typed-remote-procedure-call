import { chain as chainFn } from '../chain';
import { createTemplateEngine, OperationTemplate, OperationTemplateEngine } from '../template';
import { ExecutionRequest } from '../executor';
import { OperationAPI } from '../operation';
import { OperationCallerProps } from './types';
import { ReferenceExtractor } from '../reference';

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

    const chain = <LastOutput>(
        chainer: (props: {
            next: <I, O>(template: OperationTemplate<any, I, O>) => ReferenceExtractor<O>;
            operations: OperationTemplateEngine<API>;
        }) => ReferenceExtractor<LastOutput>,
    ): Promise<LastOutput> => {
        const template = chainFn<API, LastOutput>((next) => {
            const reference = chainer({ next, operations });
            return reference;
        });
        return execute({ data: template.toJSON() });
    };

    return {
        call,
        chain,
    };
};
