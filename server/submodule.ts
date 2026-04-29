
import { createModule } from "meteor-rpc";
import { z } from "zod";

export const exampleSubmodule = createModule("example")
  .addPublication("examplePublication", z.string(), (input) => {
    return `You sent ${input}`;
  })
  .addMethod("exampleMethod", z.string(), async (input) => {
    return `You sent ${input}`;
  })
  .buildSubmodule();