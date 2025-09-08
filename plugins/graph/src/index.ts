/**
 * Copyright 2024 Bloom Labs Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { defineFlow, streamFlow, Flow, FlowAuthPolicy } from '@genkit-ai/flow';
import * as express from 'express';
import * as z from 'zod';

export const StateReturnSchema = <S extends z.ZodTypeAny>(stateSchema: S) => {
  return z.object({
    state: stateSchema,
    nextNode: z.string(),
  });
};

type StateReturnSchema<S extends z.ZodTypeAny> = ReturnType<
  typeof StateReturnSchema<S>
>;

export const FlowOutputSchema = <
  S extends z.ZodTypeAny,
  O extends z.ZodTypeAny,
>(
  stateSchema: S,
  outputSchema: O
) => {
  return z
    .object({
      state: stateSchema,
      nextNode: z.string(),
    })
    .or(outputSchema);
};

type FlowOutputSchema<
  S extends z.ZodTypeAny,
  O extends z.ZodTypeAny,
> = ReturnType<typeof FlowOutputSchema<S, O>>;

export function defineGraph<
  StateSchema extends z.ZodTypeAny = z.ZodTypeAny,
  InputSchema extends z.ZodTypeAny = z.ZodTypeAny,
  OutputSchema extends z.ZodTypeAny = z.ZodTypeAny,
  StreamSchema extends z.ZodTypeAny = z.ZodTypeAny,
>(
  config: {
    name: string;
    stateSchema?: StateSchema;
    inputSchema?: InputSchema;
    streamSchema?: StreamSchema;
    outputSchema?: OutputSchema;
    experimentalDurable?: boolean;
    authPolicy?: FlowAuthPolicy<InputSchema>;
    middleware?: express.RequestHandler[];
  },
  entrypoint: (
    input: z.infer<InputSchema>
  ) =>
    | Promise<z.infer<StateReturnSchema<StateSchema>>>
    | z.infer<StateReturnSchema<StateSchema>>,
  beforeFinish?: (
    state: z.infer<StateSchema>,
    output: z.infer<OutputSchema>
  ) => Promise<void> | void
): {
  executor: Flow<InputSchema, OutputSchema>;
  addNode: (
    flow: Flow<
      StateSchema,
      FlowOutputSchema<StateSchema, OutputSchema>,
      StreamSchema
    >
  ) => void;
  removeNode: (name: string) => void;
} {
  const nodes: Record<
    string,
    Flow<StateSchema, FlowOutputSchema<StateSchema, OutputSchema>, StreamSchema>
  > = {};

  const addNode = (
    flow: Flow<
      StateSchema,
      FlowOutputSchema<StateSchema, OutputSchema>,
      StreamSchema
    >
  ) => {
    if (nodes[flow.name]) {
      throw new Error(`Node ${flow.name} already exists`);
    }

    nodes[flow.name] = flow;
  };

  const removeNode = (name: keyof typeof nodes) => {
    if (nodes[name]) {
      throw new Error(`Node ${name} already exists`);
    }

    delete nodes[name];
  };

  const executor = defineFlow<InputSchema, OutputSchema, StreamSchema>(
    {
      name: config.name,
      inputSchema: config.inputSchema,
      streamSchema: config.streamSchema,
      outputSchema: config.outputSchema,
      authPolicy: config.authPolicy,
      middleware: config.middleware,
    },
    async (input, streamingCallback) => {
      let { state, nextNode } = await entrypoint(input);

      let currentNode: string = nextNode;

      while (true) {
        if (!nodes[currentNode]) {
          throw new Error(`Node ${currentNode} does not exist`);
        }

        const { stream, output } = streamFlow(nodes[currentNode], state);

        if (streamingCallback) {
          for await (const chunk of stream()) {
            streamingCallback(chunk);
          }
        }

        const result = await output();

        let parseResult = StateReturnSchema(
          config.stateSchema ?? z.any()
        ).safeParse(result);

        if (parseResult.success) {
          state = (result as z.infer<StateReturnSchema<StateSchema>>).state;
          currentNode = (result as z.infer<StateReturnSchema<StateSchema>>)
            .nextNode;
          continue;
        }

        parseResult = (config.outputSchema ?? z.any()).safeParse(result);

        if (parseResult.success) {
          await beforeFinish?.(state, result);

          return result;
        } else {
          throw new Error(
            `Invalid output: Output of node ${currentNode} does not satisfy StateSchema or OutputSchema`
          );
        }
      }
    }
  );

  return {
    executor,
    addNode,
    removeNode,
  };
}
