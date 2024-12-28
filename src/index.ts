import { JsonRpcRequest, JsonRpcResponse, RpcInterface } from './types';

export const createRpcSender = <T extends RpcInterface>(props: {
    send: (request: JsonRpcRequest) => Promise<JsonRpcResponse>;
}): T =>
    new Proxy(
        {},
        {
            get: (_target, prop) => {
                if (typeof prop === 'string') {
                    return async (...args: any[]) => {
                        const request: JsonRpcRequest = { jsonrpc: '2.0', method: prop, params: args };
                        const response = await props.send(request);

                        if (response.error) throw new Error(response.error.message);
                        return response.result;
                    };
                }
            },
        },
    ) as T;

export const createRpcReceiver = <T extends RpcInterface>(props: { implementation: T }) => ({
    receive: async (request: JsonRpcRequest): Promise<JsonRpcResponse> => {
        const method = props.implementation[request.method];
        if (!method) return { jsonrpc: '2.0', error: { code: 1, message: 'Method not found' } };

        try {
            const result = await method(...request.params);
            return { jsonrpc: '2.0', result };
        } catch (error: any) {
            return { jsonrpc: '2.0', error: { code: error.code ?? 2, message: 'Internal error' } };
        }
    },
});

export * from './types';
