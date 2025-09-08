![groq_genkit](https://github.com/BloomLabsInc/genkit-plugins/assets/21220927/b56501c2-25c1-48aa-8da9-65486f0e982d)

# Plugin usage examples

This module provides examples of usage of the Genkit plugins in this repository. This includes:

- [OpenAI](../plugins/openai) - [website](https://openai.com/)
- [Anthropic](../plugins/anthropicai) - [website](https://anthropic.com/)
- [Groq](../plugins/groq) - [website](https://groq.com/)
- [Cohere](../plugins/cohere) - [website](https://cohere.com/)
- [Mistral](../plugins/mistral) - [website](https://mistral.ai/)

The beauty of a framework like Genkit is that it provides a standard interface to the models, retrievers, embedders, etc exposed by these plugins. This allows you to easily swap out components while keeping prompts, flows, agents, etc the same.

NOTE: as you will see, you do not need to have a Firebase project to use Genkit and these plugins. You can use it as a standalone library in the same way you'd use Langchain.

## Set up Genkit packages and DevUI

1. Rename .env.local to .env and add your API key to it, or specify it in the environment variable `{PLUGIN_NAME}_API_KEY` (e.g. `OPENAI_API_KEY`).

2. Run `npm run init` to install the dependencies.
3. Run `npm run start:browser` to launch Genkit and the Dev UI.

Genkit is configured from the `index.ts`, where you can import and initialize the plugin and define prompts, flows, models and other tools which could be accessed directly through Gekit Dev UI:

```typescript
imort { configureGenkit } from '@genkit-ai/core';

import { openAI } from 'genkitx-openai';
import { anthropic } from 'genkitx-anthropic';
import { groq } from 'genkitx-groq';
// Here you can import other plugins, depending on your needs

export default configureGenkit({
  plugins: [
    openAI(),
    anthropic(),
    groq(),
    // Initialize other plugins if necessary
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
```

List of all available models as well as their pricing, specification and capabilities could be found in the official documentation for every corresponding API.

## Example usage

### Calling the model

The simplest way to call the text generation model is by using the helper function `generate`:

```typescript
import { generate } from '@genkit-ai/ai';
import { claude3Haiku } from 'genkitx-anthropic';

// Basic usage of an LLM
const response = await generate({
  model: claude3Haiku,
  prompt: 'Tell me a joke.',
});

console.log(await response.text());
```

Using the same interface, you can prompt a multimodal model:

```typescript
import { gpt4Vision } from 'genkitx-openai';

const response = await generate({
  model: gpt4Vision,
  prompt: [
    { text: 'What animal is in the photo?' },
    { media: { url: imageUrl } },
  ],
});
console.log(await response.text());
```

or define a tool in Genkit, test in the dev UI and then use it in the code:

```typescript
import { defineTool } from '@genkit-ai/ai';

// defining the tool
const tool = defineTool(
  {
    name: 'myTool',
    description: 'the tool welcoming the new users',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (input) => `Welcome to the Genkit OpenAI plugin!`
);

// using the tool in code
const response = await generate({
  model: gpt35Turbo,
  prompt: 'Greet the new plugin user',
  tools: [tool],
  config: {
    temperature: 0.5,
  },
});
console.log(await response.text());
```

Genkit doesn't prevent you from using any of the available models from various aforementioned providers. Feel free to play around with different models in any of our prompt examples by conveniently swapping different models in the `model` field!

### Defining the prompts

One of the main benefits of Genkit is the ability to define the prompt as code and register it with Genkit,and for that you can use `definePrompt` function:

```typescript
import { definePrompt } from '@genkit-ai/ai';

const helloPrompt = definePrompt(
  {
    name: 'helloPrompt',
    inputSchema: z.object({ name: z.string() }),
  },
  async (input) => {
    const promptText = `You are a helpful AI assistant named Walt.
    Say hello to ${input.name}.`;

    return {
      messages: [{ role: 'user', content: [{ text: promptText }] }],
      config: { temperature: 0.3 },
    };
  }
);
```

In this way, you can test your prompts independently of the code or specific model in the Genkit Dev UI. This also enables the
definition of input schemas, which enable you to customize each prompt call with a specific set of arguments, or specify the output format, as showcased a bit later below. To use this prompt in your development, you can use the `renderPrompt` function:

```typescript
import { generate, renderPrompt } from '@genkit-ai/ai';
import { gemma_7b } from 'genkitx-groq';

const response = await generate(
  renderPrompt({
    prompt: helloPrompt,
    input: { name: 'Fred' },
    model: gemma_7b,
  })
);
console.log(await response.text());
```

### Dotprompt plugin

Genkit introduced a concept of Dotprompt, which is a plugin that enables you to store prompts in dedicated files, track changes and organize them in a JSON format or as a code. To use it, you must enable the Dotprompt plugin first:

```typescript
import { dotprompt } from '@genkit-ai/dotprompt';
export default configureGenkit({
  plugins: [dotprompt()],
});
```

After that, in the root of your project, create a folder named `prompts`, where you can store your prompts in a `.prompt` files. For this demo, we already provide you with a couple of examples in the aforementioned folder. This is an example of how the Dotprompt `.prompt` file could look like:

```
---
model: openai/gpt-3.5-turbo
input:
  schema:
    assistant_name: string
    guest_name: string
  default:
    assistant_name: John
---

You are the world's most welcoming AI assistant named {{assistant_name}}.

Greet a guest named {{name}}.
```

To register it with Genkit and use it in development, you could use a `prompt` helper function from Dotprompt plugin:

```typescript
import { prompt } from '@genkit-ai/dotprompt';

const greetingPrompt = await prompt('basic');
```

where `basic` represents the name of the file, `/prompts/basic.prompt`, in which the Dotprompt is stored.
This plugin also enables you to write prompts directly as a code:

```typescript
import { defineDotprompt } from '@genkit-ai/dotprompt';

const codeDotPrompt = defineDotprompt(
  {
    name: 'exampleDotPrompt',
    model: gpt4Turbo,
    input: {
      schema: z.object({
        object_name: z.string(),
        image_url: z.string(),
      }),
    },
    output: {
      schema: z.object({
        exist: z.boolean(),
        color: z.string(),
        details: z.string(),
      }),
    },
    config: {
      temperature: 1.0,
      topP: 0.9,
      maxOutputTokens: 100,
      topK: 20,
      stopSequences: ['abc'],
      visualDetailLevel: 'high', // Only for OpenAI models
    },
  },
  `Does the object {{object_name}} exist in the given image {{media url=image_url}}? If it does, what color is it and what are some details about it?`
);
```

Finally, you can use the same `generate` helper function to call the model with the given Dotprompt:

```typescript
const response = await codeDotPrompt.generate({
  input: {
    object_name: 'Ball',
    image_url: 'https://example_url.jpg',
  },
});
```

In this case, to obtain the structured output which we specified in a prompt, we can run:

```typescript
console.log(await response.output());
```

### Flows

Flows are the enhanced version of the standard functions, which are strongly typed, streamable, and locally and remotely callable. They can also be registered and later tested in Genkit Dev UI. To define and run a flow, one can use `defineFlow` and `runFlow` functions:

```typescript
import { defineFlow, runFlow } from '@genkit-ai/flow';
import {llama_3_70b} from 'genkitx-groq';
\\define Flow

export const myFlow = defineFlow(
  {
    name: 'menuSuggestionFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (subject) => {
    const llmResponse = await generate({
      prompt: `Suggest an item for the menu of a ${subject} themed restaurant`,
      model: llama_3_70b,
    });

    return llmResponse.text();
  }
);

// Run the flow
const response = await runFlow(myFlow, 'mexican' );
console.log(await response.text());
```

### Embedders and retrievers

Apart from the text generation models, Genkit also features the access to the text embeddings models and
implements retrievers which can retrieve documents, given a query. To use the text embedding models,
you should utilize the `embed` method:

```typescript
import { textEmbedding3Small } from 'genkitx-openai';
import { embed } from '@genkit-ai/ai/embedder';

const embedding = embed({
  embedder: textEmbedding3Small,
  content: 'Embed this text.',
});
```

Here, the variable `embedding` will be a vector of numbers, which is a latent space representation of the given text, which can find use in many downstream tasks. In this case, we can use the text embeddings in a retriever, to query similar documents from Firestore based on the extracted embeddings:

```typescript
import { embed } from '@genkit-ai/ai/embedder';
import { Document, defineRetriever } from '@genkit-ai/ai/retriever';
import { textEmbedding3Small } from 'genkitx-openai';
import {
  FieldValue,
  VectorQuery,
  VectorQuerySnapshot,
} from '@google-cloud/firestore';
import { Firestore } from 'firebase-admin/firestore';
import * as z from 'zod';

const QueryOptions = z.object({
  k: z.number().optional(),
});

const firestoreArtifactsRetriever = defineRetriever(
  {
    name: 'firestore/artifacts',
    configSchema: QueryOptions,
  },
  async (input, options) => {
    const embedding = await embed({
      embedder: textEmbedding3Small,
      content: input,
    });

    const db = new Firestore();
    const coll = db.collection('vectors' /* your collection name */);

    const vectorQuery: VectorQuery = coll.findNearest(
      'embedding' /* the name of the field that contains the vector */,
      FieldValue.vector(embedding),
      {
        limit: options.k ?? 3,
        distanceMeasure: 'COSINE',
      }
    );

    const vectorQuerySnapshot: VectorQuerySnapshot = await vectorQuery.get();
    return {
      documents: vectorQuerySnapshot.docs.map((doc) =>
        // doc.data() represents the Firestore document. You may process
        // it as needed to generate a Genkit document object, depending on your
        // storage format.
        Document.fromText(doc.data().content.text)
      ),
    };
  }
);
```

In the [official Genkit documentation](https://firebase.google.com/docs/genkit/get-started) you can find many more usage examples as well as detailed specification and full instructions of the usage of the Genkit framework.

## Contributing

If you want to run these examples during development, you can use the following workflow:

1. Update the plugin you're working on.
2. Run `npm run build` on the top level of the repo to build the plugin.
3. Run `ts-node examples/src/index.ts` to run the examples.
