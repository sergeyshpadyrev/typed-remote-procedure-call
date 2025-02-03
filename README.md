![workflow](https://github.com/sergeyshpadyrev/typed-remote-procedure-call/actions/workflows/main.yml/badge.svg)
[![npm version](https://badge.fury.io/js/typed-remote-procedure-call.svg)](https://badge.fury.io/js/typed-remote-procedure-call)

# typed-remote-procedure-call

This library provides a convenient way to create transport-agnostic typed RPC senders and receivers. <br/>
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

```ts
import { createCaller, createExecutor, ExecutionRequest, ExecutionResponse } from 'typed-remote-procedure-call';

type Methods = {
    add: (input: { a: number; b: number }) => Promise<number>;
    createUser: (input: { name: string }) => Promise<{ id: string; name: string }>;
};

// Execution side (e.g. server)
const executor = createExecutor<Methods>({
    add: async (input: { a: number; b: number }) => input.a + input.b,
    createUser: async (input: { name: string }) => ({ id: '1', name: input.name }),
});
const handleRequestFromCallerSide = async (request: ExecutionRequest): Promise<ExecutionResponse> =>
    executor.execute(request);

// Caller side (e.x. client)
const caller = createCaller<Methods>({
    handle: async (request: ExecutionRequest) => sendRequestToExecutionSide(request), // Here you can use any transport
});
const user = await caller.createUser('John');
const sum = await sender.sum(1, 2);
```
