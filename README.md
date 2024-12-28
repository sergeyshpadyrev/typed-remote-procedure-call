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
import { createRpcSender, createRpcReceiver } from 'typed-remote-procedure-call';

type Methods = {
    createUser: (name: string) => Promise<{ id: string; name: string }>;
    sum: (a: number, b: number) => Promise<number>;
};

// Receiver-side
const receiver = createRpcReceiver<Methods>({
    implementation: {
        createUser: async (name: string) => ({ id: '1', name }),
        sum: async (a: number, b: number) => a + b,
    },
});
const handleRequestFromSenderSide = async (request: JsonRpcRequest): Promise<JsonRpcResponse> =>
    receiver.receive(request);

// Sender-side
const sender = createRpcSender<Methods>({
    // Here you can use any transport
    send: async (request: JsonRpcRequest) => sendRequestToReceiverSide(request),
});
const user = await sender.createUser('John');
const sum = await sender.sum(1, 2);
```
