import { OperationAPI } from '../operation';
import { OperationTemplate, OperationTemplateEngine, OperationTemplateJSON } from './types';
import { reference, ReferenceExtractor } from '../reference';

const createTemplate = <API extends OperationAPI, Input, Output>(
    json: OperationTemplateJSON<API>,
): OperationTemplate<API, Input, Output> => ({
    then: <T>(
        composition: (output: ReferenceExtractor<Output>) => OperationTemplate<API, Input, T>,
    ): OperationTemplate<API, Input, T> => {
        const ref = reference<Output>(`\$${json.length - 1}`);
        const concatingJSON = composition(ref).toJSON();
        return createTemplate<API, Input, T>([...json, ...concatingJSON]);
    },
    toJSON: () => json,
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
