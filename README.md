![workflow](https://github.com/sergeyshpadyrev/typed-remote-procedure-call/actions/workflows/main.yml/badge.svg)
[![npm version](https://badge.fury.io/js/typed-remote-procedure-call.svg)](https://badge.fury.io/js/typed-remote-procedure-call)

# typed-remote-procedure-call

This library provides a convenient way to create transport-agnostic typed RPC <br/>

It can be used for:

-   Client-server communication
-   Iframe-host communication
-   Host-iframe communication
-   Websocket communication
-   Any other channel

## Installation

```sh
npm install --save typed-remote-procedure-call
# or
yarn add typed-remote-procedure-call
```

## Usage

The fundamental entity in this library is Operation

```ts
type Operation = <Input, Output>(input: Input) => Promise<Output>;
```

First you need to declare your operations API

```ts
type Methods = {
    add: (input: { a: number; b: number }) => Promise<number>;
    createUser: (input: { name: string }) => Promise<{ id: string; name: string }>;
};
```

### Executor

Executor is an engine that executes operations

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

RPC is a wrapper that provides a convenient way to call operations

```ts
import { createRPC, ExecutionRequest } from 'typed-remote-procedure-call';

const rpc = createRPC<Methods>({
    process: async (request: ExecutionRequest) => sendRequestToExecutionSide(request), // Here you can use any transport
});
```

#### call

You can just call operations one by one

```ts
const user = await rpc.call.createUser('John');
const sum = await rpc.call.sum(user.age, 2);
```

#### chain

But you can also chain operations and execute them all in once

```ts
import { chain } from 'typed-remote-procedure-call';

const sum = await rpc.chain(({ next, operations }) => {
    const user = next(operations.createUser({ firstName: 'John', lastName: 'Doe' }));
    return next(operations.add({ a: user.age, b: 2 }));
});
```
