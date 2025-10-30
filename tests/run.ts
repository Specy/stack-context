import { StackContext } from "../src";

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
