export type JsonRpcRequest = {
    id?: string | number | null;
    jsonrpc: '2.0';
    method: string;
    params?: any;
};

export type JsonRpcError = {
    code: number;
    data?: any;
    message: string;
};

export type JsonRpcResponse = {
    error?: JsonRpcError;
    id?: string | number | null;
    jsonrpc: '2.0';
    result?: any;
};

export type RpcInterface = { [key: string]: (...args: any[]) => Promise<any> };
