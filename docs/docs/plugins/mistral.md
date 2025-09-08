---
id: genkitx-mistral
title: genkitx-mistral
---

<h1 align="center">Firebase Genkit - Mistral AI Plugin</h1>

<h4 align="center">Mistral AI Community Plugin for Google Firebase Genkit</h4>

<div align="center">
   <img alt="Github lerna version" src="https://img.shields.io/github/lerna-json/v/BloomLabsInc/genkit-plugins?label=version"/>
   <img alt="NPM Downloads" src="https://img.shields.io/npm/dw/genkitx-mistral"/>
   <img alt="GitHub Org's stars" src="https://img.shields.io/github/stars/BloomLabsInc?style=social"/>
   <img alt="GitHub License" src="https://img.shields.io/github/license/BloomLabsInc/genkit-plugins"/>
   <img alt="Static Badge" src="https://img.shields.io/badge/yes-a?label=maintained"/>
</div>

<div align="center">
   <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues/BloomLabsInc/genkit-plugins?color=blue"/>
   <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues-pr/BloomLabsInc/genkit-plugins?color=blue"/>
   <img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/m/BloomLabsInc/genkit-plugins"/>
</div>

**`genkitx-mistral`** is a community plugin for using Mistral AI APIs with
[Firebase Genkit](https://github.com/firebase/genkit). Built by [**Bloom Labs Inc**](https://github.com/BloomLabsInc). 🔥

## Installation

Install the plugin in your project with your favorite package manager:

- `npm install genkitx-mistral`
- `yarn add genkitx-mistral`
- `pnpm add genkitx-mistral`

## Usage

### Initialize

```typescript
import { genkit } from 'genkit';
import mistral, { openMistral7B } from 'genkitx-mistral';

const ai = genkit({
  plugins: [mistral({ apiKey: 'your-api-key' })],
  model: openMistral7B,
});
```

### Basic examples

The simplest way to generate text is by using the `generate` method:

```typescript
const response = await ai.generate({
  model: openMixtral8x22B, // model imported from genkitx-mistral
  prompt: 'Tell me a joke.',
});

console.log(response.text);
```

### Text Embeddings

```typescript
import { mistralembed } from 'genkitx-mistral';

const embedding = await ai.embed({
  embedder: mistralembed,
  content: 'Hello world',
});

console.log(embedding);
```

## Vision

```typescript
import { openPixtral } from 'genkitx-mistral';

const { text } = await ai.generate({
  prompt: [{ media: { url: 'https://my-photo.jpg' } }, { text: input }],
  model: openPixtral,
  config: {
    version: 'pixtral-12b-2409',
  },
});

return JSON.stringify(text);
```

## OCR

```typescript
import { ocr } from 'genkitx-mistral';

export const ocrFlow = ai.defineFlow(
  {
    name: 'ocrFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (input) => {
    const { text } = await ai.generate({
      model: ocr,
      prompt: 'parse the document',
      config: {
        document: {
          documentUrl: input,
          type: 'document_url',
        },
      },
    });

    return JSON.stringify(text);
  }
);
```

### Adding a model

To add a new model, you can import it from `genkitx-mistral` and use it in the `generate` method:

```typescript
import { GenerationCommonConfigSchema, genkit } from 'genkit';
import { modelRef } from 'genkit/model';
import mistral from 'genkitx-mistral';

export const customLarge2411 = modelRef({
  name: 'mistral/mistral-large-2411',
  info: {
    versions: ['mistral-large-2411'],
    label: 'Mistral - Mistral Large 2411',
    supports: {
      multiturn: true,
      tools: true,
      media: false,
      systemRole: true,
      output: ['text', 'json'],
    },
  },
  configSchema: GenerationCommonConfigSchema,
});
const ai = genkit({
  plugins: [
    mistral({
      apiKey: process.env.CLIENT_ID as string,
      serverURL: process.env.MISTRAL_ENDPOINT as string,
      customModels: {
        'mistral-large-2411': customLarge2411,
      },
    }),
  ],
  model: customLarge2411,
});

const response = await ai.generate({
  prompt: 'Tell me a joke.',
});

console.log(response.text);
```

### Within a flow

```typescript
import { z } from 'genkit';

// ...initialize genkit as above...

export const jokeFlow = ai.defineFlow(
  {
    name: 'jokeFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (subject) => {
    const llmResponse = await ai.generate({
      prompt: `tell me a joke about ${subject}`,
    });
    return llmResponse.text;
  }
);

// Run the flow using the CLI:
// genkit flow:run jokeFlow "chicken"
```

## Contributing

Want to contribute to the project? That's awesome! Head over to our [Contribution Guidelines](https://github.com/BloomLabsInc/genkit-plugins/blob/main/CONTRIBUTING.md).

## Need support?

:::info

> This repository depends on Google's Firebase Genkit. For issues and questions related to Genkit, please refer to instructions available in [Genkit's repository](https://github.com/firebase/genkit).
> :::

Reach out by opening a discussion on [Github Discussions](https://github.com/BloomLabsInc/genkit-plugins/discussions).

## Credits

This plugin is proudly maintained by the team at [**Bloom Labs Inc**](https://github.com/BloomLabsInc). 🔥

## License

This project is licensed under the [Apache 2.0 License](https://github.com/BloomLabsInc/genkit-plugins/blob/main/LICENSE).
