![workflow](https://github.com/sergeyshpadyrev/typed-remote-procedure-call/actions/workflows/main.yml/badge.svg)
[![npm version](https://badge.fury.io/js/typed-remote-procedure-call.svg)](https://badge.fury.io/js/typed-remote-procedure-call)

# typed-remote-procedure-call

This library provides a convenient way to create transport-agnostic typed RPC. <br/>
It's based on JSON RPC protocol.

It can be used for:

-   Client-server communication
-   Iframe-host communication
-   Host-iframe communication

## Installation

```bash
npm install --save typed-remote-procedure-call
# or
yarn add typed-remote-procedure-call
```

## Usage

The fundamental entity in this library is Operation:

```ts
type Operation = <Input, Output>(input: Input) => Promise<Output>;
```

First you need to create your operations API:

```
type Methods = {
    add: (input: { a: number; b: number }) => Promise<number>;
    createUser: (input: { name: string }) => Promise<{ id: string; name: string }>;
};
```

### Executor

Executor is an engine that executes operations:

```ts
import { createExecutor, ExecutionRequest, ExecutionResponse } from 'typed-remote-procedure-call';

const executor = createExecutor<Methods>({
    add: async (input: { a: number; b: number }) => input.a + input.b,
    createUser: async (input: { name: string }) => ({ id: '1', name: input.name }),
});
export const handleRequestFromCallerSide = async (request: ExecutionRequest): Promise<ExecutionResponse> =>
    executor.execute(request);
```

### RPC

Just to call operations one by one you can use a simple caller:

```ts
import { createRPC, ExecutionRequest, ExecutionResponse } from 'typed-remote-procedure-call';

const rpc = createRPC<Methods>({
    process: async (request: ExecutionRequest) => sendRequestToExecutionSide(request), // Here you can use any transport
});
const user = await rpc.createUser('John');
const sum = await rpc.sum(1, 2);
```

### Chain

But you can also chain operations and execute them in one call:

```ts
import { chain } from 'typed-remote-procedure-call';

const addFive = chain((next, input) => {
    const x = next(operations.add({ a: input, b: 2 }));
    const y = next(operations.add({ a: x, b: 3 }));
    return y;
});
```
