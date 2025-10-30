# Stack context
A library to store data inside of the stack, so you can retrieve it anywhere in the call stack, both in sync and async functions

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