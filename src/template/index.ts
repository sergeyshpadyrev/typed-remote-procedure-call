import { OperationAPI } from '../operation';
import { OperationTemplate, OperationTemplateEngine, OperationTemplateJSON } from './types';
import { reference, ReferenceExtractor } from '../reference';

export const templateReferencePrefix = '$$_ref$$_';

const createTemplate = <API extends OperationAPI, Input, Output>(
    json: OperationTemplateJSON<API>,
): OperationTemplate<API, Input, Output> => ({
    then: <T>(
        composition: (output: ReferenceExtractor<Output>) => OperationTemplate<API, Input, T>,
    ): OperationTemplate<API, Input, T> => {
        const ref = reference<Output>(`${templateReferencePrefix}${json.length - 1}`);
        const concatingJSON = composition(ref).toJSON();
        return createTemplate<API, Input, T>([...json, ...concatingJSON]);
    },
    toJSON: () => json,
});

const processReferences = <T>(input: T): any => {
    if (typeof input !== 'object' || input === null) return input;

    const path = (input as any)._path;
    if (path) return path;

    return Object.assign(
        {},
        ...Object.keys(input).map((key) => ({ [key]: processReferences(input[key as keyof typeof input]) })),
    );
};

export const createTemplateEngine = <API extends OperationAPI>() =>
    new Proxy(
        {},
        {
            get: (_target, name) => {
                if (typeof name === 'string') {
                    return (input: any) => createTemplate([{ name, input: processReferences(input) }]);
                }
            },
        },
    ) as OperationTemplateEngine<API>;

export type * from './types';
