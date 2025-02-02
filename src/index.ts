import {
    ExecutionRequest,
    ExecutionResponse,
    Executor,
    OperationAPI,
    OperationTemplateConfig,
    OperationTemplate,
    OperationTemplateEngine,
    OperationTemplateReferer,
} from './types';

const referProxyHandler = (path: string) => ({
    get(_: any, prop: string) {
        return {
            __path: () => `${path}.${prop}`,
            ...new Proxy({}, referProxyHandler(`${path}.${prop}`)),
        };
    },
    apply(_: any, __: any, _args: any[]) {
        return path;
    },
});

const refer = <Output>(prefix: string): OperationTemplateReferer<Output> => {
    return {
        __path: () => prefix,
        ...new Proxy({}, referProxyHandler(prefix)),
    } as OperationTemplateReferer<Output>;
};

const createTemplate = <API extends OperationAPI, Input, Output>(
    config: OperationTemplateConfig<API>,
): OperationTemplate<API, Input, Output> => ({
    then: <T>(
        composition: (output: OperationTemplateReferer<Output>) => OperationTemplate<API, Input, T>,
    ): OperationTemplate<API, Input, T> => {
        const ref = refer<Output>(`\$${config.length - 1}`);
        console.log(ref.__path());
        const concatingConfig = composition(ref).toConfig();
        return createTemplate<API, Input, T>([...config, ...concatingConfig]);
    },
    toConfig: () => config,
    toRequest: (): ExecutionRequest => ({ template: config }),
});

export const createTemplateEngine = <API extends OperationAPI>() =>
    new Proxy(
        {},
        {
            get: (_target, name) => {
                if (typeof name === 'string') {
                    return (input: any) => createTemplate([{ name, input }]);
                }
            },
        },
    ) as OperationTemplateEngine<API>;

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

            for (const line of request.template) {
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

export type * from './types';
