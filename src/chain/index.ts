import { OperationAPI } from '../operation';
import { OperationTemplate, templateReferencePrefix } from '../template';
import { reference, Reference, ReferenceExtractor } from '../reference';

export const chain = <API extends OperationAPI, LastOutput>(
    chainer: (
        next: <I, O>(template: OperationTemplate<any, I, O>) => ReferenceExtractor<O>,
    ) => Reference<LastOutput, any>,
): OperationTemplate<API, any, LastOutput> | undefined => {
    const templates: OperationTemplate<any, any, any>[] = [];
    let referenceIndex = -1;

    chainer(<I, O>(template: OperationTemplate<any, I, O>) => {
        templates.push(template);
        return reference(`${templateReferencePrefix}${++referenceIndex}`);
    });

    return templates.reduce(
        (acc, template) => (acc ? acc.compose((_) => template) : template),
        undefined as OperationTemplate<API, any, any> | undefined,
    );
};
