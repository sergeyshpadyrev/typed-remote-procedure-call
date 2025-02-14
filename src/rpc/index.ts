import { chain as chainFn } from '../chain';
import { createTemplateEngine, OperationTemplate, OperationTemplateEngine, OperationTemplateInput } from '../template';
import { ExecutionRequest } from '../executor';
import { OperationAPI } from '../operation';
import { OperationCallerProps, OperationChainEngine } from './types';
import { ReferenceExtractor } from '../reference';

export const createRPC = <API extends OperationAPI>(props: OperationCallerProps) => {
    const operations = createTemplateEngine<API>();

    const execute = async (request: ExecutionRequest) => {
        try {
            const response = await props.send(request);
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

    const chainOperationEngine = (
        next: <I, O>(template: OperationTemplate<API, I, O>) => ReferenceExtractor<O>,
    ): OperationChainEngine<API> =>
        new Proxy(
            {},
            {
                get: (_target, prop) => {
                    if (typeof prop === 'string') {
                        return (input: any) => {
                            const template = operations[prop](input);
                            return next(template);
                        };
                    }
                },
            },
        ) as OperationChainEngine<API>;

    const chain = <LastOutput>(
        chainer: (call: OperationChainEngine<API>) => ReferenceExtractor<LastOutput>,
    ): Promise<LastOutput> => {
        const template = chainFn<API, LastOutput>((next) => chainer(chainOperationEngine(next)));
        return execute({ data: template.toJSON() });
    };

    return {
        call,
        chain,
    };
};
