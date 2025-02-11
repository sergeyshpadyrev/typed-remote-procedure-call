![workflow](https://github.com/sergeyshpadyrev/typed-remote-procedure-call/actions/workflows/main.yml/badge.svg)
[![npm version](https://badge.fury.io/js/typed-remote-procedure-call.svg)](https://badge.fury.io/js/typed-remote-procedure-call)

**If you like this project, please support it with a star on Github** 🌟

# typed-remote-procedure-call

This library provides a convenient way to create transport-agnostic typed RPC <br/>
It consists of two parts - caller and executor. <br/>

Possible use cases:

-   Frontend (caller) - HTTP - Backend (executor)
-   Frontend (caller) - Websocket - Backend (executor)
-   Backend (caller) - Websocket - Frontend (executor)
-   Host web app (caller) - Message bus - Iframe (executor)
-   Iframe (caller) - Message bus - Host web app (executor)

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
    createUser: (input: { name: string }) => Promise<{ age: number; name: string }>;
};
```

### Executor

Executor is an engine that executes operations

```ts
import { createExecutor, ExecutionRequest, ExecutionResponse } from 'typed-remote-procedure-call';

const executor = createExecutor<Methods>({
    add: async (input: { a: number; b: number }) => input.a + input.b,
    createUser: async (input: { name: string }) => ({ age: 20, name: input.name }),
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
const user = await rpc.call.createUser({ name: 'John' });
const sum = await rpc.call.sum({ a: user.age, b: 2 });
```

#### chain

But you can also chain operations and execute them all in one batch

```ts
import { chain } from 'typed-remote-procedure-call';

const sum = await rpc.chain((call) => {
    const user = call.createUser({ name: 'John' });
    return call.add({ a: user.age, b: 2 });
});
```

Here what's returned from `call.operation(input)` is not a promise but a reference to the operation result. <br/>
You can use it to pass it to another operation. <br/>
The returned reference is the final result of the chain of operations.
