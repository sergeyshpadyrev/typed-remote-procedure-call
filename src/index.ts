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
        return new Proxy({ __path: () => `${path}.${prop}` }, referProxyHandler(`${path}.${prop}`));
    },
    apply(_: any, __: any, _args: any[]) {
        return path;
    },
});

const refer = <Output>(prefix: string): OperationTemplateReferer<Output> => {
    return {
        __path: () => prefix,
        ...new Proxy(
            {},
            {
                get(_target, prop: string) {
                    console.log(prop);
                    if (typeof prop === 'string') {
                        const path = prefix ? `${prefix}.${prop}` : prop;
                        return { __path: () => path, ...new Proxy({}, referProxyHandler(path)) };
                    }
                },
            },
        ),
    } as OperationTemplateReferer<Output>;
};

const createTemplate = <API extends OperationAPI, Input, Output>(
    config: OperationTemplateConfig<API>,
): OperationTemplate<API, Input, Output> => ({
    then: <T>(
        composition: (output: OperationTemplateReferer<Output>) => OperationTemplate<API, Input, T>,
    ): OperationTemplate<API, Input, T> => {
        const ref = refer<Output>(`\$${config.length - 1}`);
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

export type * from './types';
