# Stack context
A library to store data inside of the stack, so you can retrieve it anywhere in the call stack, only in sync code.

It was an experiment to replicate `AsyncLocalStorage`, which works, but only for sync code (could be made much simpler, just wanted to experiment with storing things in the stack)

```ts
import { StackContext } from "@specy/stack-context";

type MyState = {
  a: number;
  b: number;
};

function sum() {
  const state = StackContext.state<MyState>();
  const sum = state.a + state.b;
  console.log(`The sum is: `, sum);
}

StackContext.root(
  () => {
    sum();
  },
  { a: 10, b: 20 },
);
```