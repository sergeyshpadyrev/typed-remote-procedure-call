import { OperationAPI } from '../operation';
import { OperationTemplate, templateReferencePrefix } from '../template';
import { reference, Reference, ReferenceExtractor } from '../reference';

export const chain = <API extends OperationAPI, LastOutput, FirstInput = unknown>(
    chainer: (
        next: <I, O>(template: OperationTemplate<any, I, O>) => ReferenceExtractor<O>,
    ) => Reference<LastOutput, any>,
): OperationTemplate<API, FirstInput, LastOutput> => {
    const templates: OperationTemplate<API, any, any>[] = [];
    let referenceIndex = -1;

    chainer((template) => {
        templates.push(template);
        return reference(`${templateReferencePrefix}${++referenceIndex}`);
    });

    if (templates.length === 0) throw new Error('You cannot use chain without any templates');
    return templates.slice(1).reduce((acc, template) => acc.compose((_) => template), templates[0]);
};
