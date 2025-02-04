import { OperationAPI } from '../operation';
import { OperationTemplate, templateReferencePrefix } from '../template';
import { reference, Reference, ReferenceExtractor } from '../reference';

export const chainOperation =
    <API extends OperationAPI, LastOutput, FirstInput = unknown>(
        chainer: (
            next: <I, O>(template: OperationTemplate<any, I, O>) => ReferenceExtractor<O>,
            input: FirstInput,
        ) => Reference<LastOutput, any>,
    ) =>
    (input: FirstInput): OperationTemplate<API, FirstInput, LastOutput> => {
        const templates: OperationTemplate<API, any, any>[] = [];
        let referenceIndex = -1;

        chainer((template) => {
            templates.push(template);
            return reference(`${templateReferencePrefix}${++referenceIndex}`);
        }, input);

        if (templates.length === 0) throw new Error('You cannot use chain without any templates');
        return templates.slice(1).reduce((acc, template) => acc.compose((_) => template), templates[0]);
    };

export const chain = <API extends OperationAPI, LastOutput>(
    chainer: (
        next: <I, O>(template: OperationTemplate<any, I, O>) => ReferenceExtractor<O>,
    ) => Reference<LastOutput, any>,
): OperationTemplate<API, unknown, LastOutput> => {
    const operation = chainOperation<API, LastOutput, unknown>(chainer);
    return operation(undefined);
};
