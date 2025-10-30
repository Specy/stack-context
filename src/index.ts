export type StackContextReturn<T> = {
  value: T;
  dispose: () => void;
};

export class StackContext {
  private static id = 1;
  private static _state: Record<number, {
    value: unknown
  }> = {};

  public static root<T>(
    callback: () => T,
    state?: unknown,
    alias?: string, 
  ): StackContextReturn<T> {
    const id = StackContext.id++;
    StackContext._state[id] = {
      value: state,
    };
    const fn = function () {
      return callback();
    };
    Object.defineProperty(fn, "name", {
      value: `__stack_context-${id}`,
      configurable: true,
    });
    const val = fn();
    
    return {
      value: val,
      dispose: () => {
        if (
          val instanceof Promise ||
          //@ts-ignore
          (val && "then" in val && typeof val.then === "function")
        ) {
          //@ts-ignore
          val.then(() => {
            delete StackContext._state[id];
          });
        } else {
          delete StackContext._state[id];
        }
      },
    };
  }

  public static state<T>(): T {
    const id = StackContext.getStackId();
    return StackContext._state[id].value as T
  }

  public static setState<T>(val: T) {
    const id = StackContext.getStackId();
    StackContext._state[id] = {
      value: val,
    }
  }
  
  public static deleteState(id: number){
    delete StackContext._state[id]
  }

  private static getStackId() {
    const trace = getStackTrace();
    const stackContextName = /__stack_context-\d+/.exec(trace ?? "");
    if (!stackContextName) {
      throw new Error(
        "Unable to find context from this stack, did you wrap it in a StackContext.root?",
      );
    }
    const id = Number(stackContextName[0].split("-")[1]);
    if (!id) {
      throw new Error(
        "Unable to find context from this stack, did you wrap it in a StackContext.root?",
      );
    }
    return id;
  }
  
  public static rootThenDispose<T>(callback: () => T, state?: unknown): T {
    const id = StackContext.id++;
    StackContext._state[id] = {
      value: state,
    }
    const fn = function () {
      return callback();
    };
    Object.defineProperty(fn, "name", {
      value: `__stack_context-${id}`,
      configurable: true,
    });
    const val = fn();
    
    if (
      val instanceof Promise ||
      //@ts-ignore
      (val && "then" in val && typeof val.then === "function")
    ) {
      //@ts-ignore
      val.then(() => {
        delete StackContext._state[id];
      });
    } else {
      delete StackContext._state[id];
    }
    
    return val;
  }
}

function getStackTrace() {
  try {
    // Throwing and catching is one way, but just creating a new Error
    // is often enough and less disruptive.
    throw new Error("StackContext");
  } catch (error) {
    // The 'stack' property contains the stack trace as a string.
    return (error as Error).stack;
  }
}
