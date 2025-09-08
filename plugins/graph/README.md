<h1 align="center">Firebase Genkit <> Graph Workflows Plugin</h1>

<h4 align="center">Graph Workflows Community Plugin for Google Firebase Genkit</h4>

<div align="center">
   <img alt="Github lerna version" src="https://img.shields.io/github/lerna-json/v/BloomLabsInc/genkit-plugins?label=version">
   <img alt="NPM Downloads" src="https://img.shields.io/npm/dw/genkitx-graph">
   <img alt="GitHub Org's stars" src="https://img.shields.io/github/stars/BloomLabsInc?style=social">
   <img alt="GitHub License" src="https://img.shields.io/github/license/BloomLabsInc/genkit-plugins">
   <img alt="Static Badge" src="https://img.shields.io/badge/yes-a?label=maintained">
</div>

<div align="center">
   <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues/BloomLabsInc/genkit-plugins?color=blue">
   <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues-pr/BloomLabsInc/genkit-plugins?color=blue">
   <img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/m/BloomLabsInc/genkit-plugins">
</div>

**`genkitx-graph`** is a community plugin for creating graph-based workflows with
[Firebase Genkit](https://github.com/firebase/genkit). Built by [**Bloom Labs Inc**](https://github.com/BloomLabsInc). 🔥

## Installation

Install the plugin in your project with your favorite package manager:

- `npm install genkitx-graph`
- `yarn add genkitx-graph`
- `pnpm add genkitx-graph`

## Introduction

genkitx-graph is a TypeScript plugin for Firebase Genkit that enables developers to easily build graph-based workflows for AI agents. This plugin provides a powerful and flexible way to create complex, multi-step processes with branching logic and state management.

## Key Concepts

- **Graph**: A collection of nodes connected by edges, representing a workflow.
- **Node**: A single step in the workflow, which can process input, modify state, and determine the next step.
- **State**: Current state of the workflow. Data that persists between nodes in the graph.
- **Input**: The initial data provided to start the graph execution.
- **Output**: The final result produced by the graph.
- **Stream**: Intermediate data that can be sent during graph execution.

## Usage

### Import the necessary functions

```typescript
import { defineGraph } from 'genkitx-graph';
import { defineFlow, streamFlow, runFlow } from '@genkit-ai/flow';
import { z } from 'zod';
```

### Define your graph

Use the `defineGraph` function to create a new graph:

```typescript
const graph = defineGraph(
  {
    name: 'MyGraph',
    stateSchema: z.object({
      // Define your state schema here
    }),
    inputSchema: z.object({
      // Define your input schema here
    }),
    outputSchema: z.object({
      // Define your output schema here
    }),
    streamSchema: z.object({
      // Define your stream schema here (optional)
    }),
  },
  async (input) => {
    // Define your entrypoint logic here
    return {
      state: {
        /* initial state */
      },
      nextNode: 'firstNode',
    };
  }
);
```

`defineGraph` has a simillar signature to `defineFlow` (because it builds an executor flow under the hood) with 2 important changes:

1. `stateSchema`: `stateSchema` defines the Schema for the state object which will be passed to every node.

2. `entrypoint`: `entrypoint`, as the name suggests, is the entrypoint of your graph. The endpoint must take in the `input` and provide the initial state along with the name of the nextNode.

### Adding nodes to your graph

Use the `addNode` function to add nodes to your graph:

```typescript
graph.addNode(
  defineFlow(
    {
      name: 'firstNode',
      // Define input/output schemas if needed
    },
    async (state) => {
      // Node logic here
      return {
        state: {
          /* updated state */
        },
        nextNode: 'secondNode',
      };
    }
  )
);

graph.addNode(
  defineFlow(
    {
      name: 'secondNode',
    },
    async (state) => {
      // Node logic here
      return {
        /* final output */
      };
    }
  )
);
```

`Node`s are the core construct of `genkitx-graph`.

Each `Node` is a `Flow` with a specific signature. Each `Node` **must** have the `inputSchema` of `stateSchema` defined in the graph and **must** return either an object with two properties: `state` which is the modified state and `nextNode` which is the name of the next node , or an object with the same schema as the `Graph`'s `outputSchema`. If you are using typecript you don't need to add them to each `Node` seperately.

Each `Node` takes the current state of the workflow as an input, uses it, modifies it and returns either the updated state with next node or a final output.

This approach rather than the traditional approach of defined nodes and edges provides a high degree of flexibility to build complex Agentic workflows. We can use LLMs and traditional logic to decide which node should be next and return an output from any node.

### Executing the graph

To execute the graph, use the `runFlow` function with your flow and input:

```typescript
const result = await runFlow(flow, {
  /* input data */
});
```

**If any node returns an object conforming to the `Graph`'s `outputSchema` then that value is returned as the `Graph`'s output and the execution finishes**

### Cleanup before finish

We can execute any arbitrary function before the graph exution finishes using the `beforeFinish` callback in `defineGraph`:

```typescript
const graph = defineGraph(
  {
    name: 'MyGraph',
    stateSchema: z.object({
      // Define your state schema here
    }),
    inputSchema: z.object({
      // Define your input schema here
    }),
    outputSchema: z.object({
      // Define your output schema here
    }),
    streamSchema: z.object({
      // Define your stream schema here (optional)
    }),
  },
  async (input) => {
    // Define your entrypoint logic here
    return {
      state: {
        /* initial state */
      },
      nextNode: 'firstNode',
    };
  }
  async (state, output) => {
    // Do anything with graph state and output
  }
);
```

The most common usage of `beforeFinish` is storing the graph state and output in a database.

Together with `entrypoint` callback this enables graphs to have memory like a chat history.

### Basic example

```typescript
// ...configure Genkit (as shown above)...

const graph = defineGraph(
  {
    name: 'MultiStepGraph',
    inputSchema: z.object({ text: z.string(), iterations: z.number() }),
    outputSchema: z.string(),
  },
  async (input) => {
    return {
      state: { text: input.text, iterations: input.iterations, count: 0 },
      nextNode: 'processText',
    };
  }
);

graph.addNode(
  defineFlow(
    {
      name: 'processText',
    },
    async (state) => {
      state.text = state.text.toUpperCase();
      state.count++;

      return {
        state,
        nextNode:
          state.count < state.iterations ? 'processText' : 'finalizeOutput',
      };
    }
  )
);

graph.addNode(
  defineFlow(
    {
      name: 'finalizeOutput',
    },
    async (state) => {
      return `Processed ${state.count} times: ${state.text}`;
    }
  )
);

// Run the graph
const result = await runFlow(graph.executor, {
  text: 'hello world',
  iterations: 3,
});
console.log(result); // Outputs: "Processed 3 times: HELLO WORLD"
```

## Advanced Features

### Streaming

You can use the `streamingCallback` function to handle streaming data from nodes:

```typescript
const graph = defineGraph(
  {
    name: 'StreamingGraph',
    inputSchema: z.string(),
    streamingSchema: z.string(),
  },
  async (input) => {
    return {
      state: input,
      nextNode: 'streamingNode',
    };
  }
);

graph.addNode(
  defineFlow(
    {
      name: 'streamingNode',
    },
    async (state, streamingCallback) => {
      // ...
      const result = await generate({
        model: //any model
        prompt: `tell me a joke about ${input}`,
        streamingCallback
      });

      // ...
    }
  )
);
```

Use streaming for long-running processes or when you need to provide real-time updates.

> [!NOTE]
> Steaming does not stop the execution of the graph

## Contributing

Want to contribute to the project? That's awesome! Head over to our [Contribution Guidelines](https://github.com/BloomLabsInc/genkit-plugins/blob/main/CONTRIBUTING.md).

## Need support?

> [!NOTE]
> This repository depends on Google's Firebase Genkit. For issues and questions related to Genkit, please refer to instructions available in [Genkit's repository](https://github.com/firebase/genkit).

Reach out by opening a discussion on [Github Discussions](https://github.com/BloomLabsInc/genkit-plugins/discussions).

## Credits

This plugin is proudly maintained by the team at [**Bloom Labs Inc**](https://github.com/BloomLabsInc). 🔥

## License

This project is licensed under the [Apache 2.0 License](https://github.com/BloomLabsInc/genkit-plugins/blob/main/LICENSE).
