![Firebase Genkit + OpenAI](https://github.com/TheFireCo/genkit-plugins/blob/main/assets/genkit-openai.png?raw=true)

<h1 align="center">
   Firebase Genkit <> OpenAI Plugin
</h1>

<h4 align="center">OpenAI Community Plugin for Google Firebase Genkit</h4>

<div align="center">
   <img alt="Github lerna version" src="https://img.shields.io/github/lerna-json/v/TheFireCo/genkit-plugins?label=version">
   <img alt="NPM Downloads" src="https://img.shields.io/npm/dw/genkitx-openai">
   <img alt="GitHub Org's stars" src="https://img.shields.io/github/stars/TheFireCo?style=social">
   <img alt="GitHub License" src="https://img.shields.io/github/license/TheFireCo/genkit-plugins">
   <img alt="Static Badge" src="https://img.shields.io/badge/yes-a?label=maintained">
</div>

<div align="center">
   <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues/TheFireCo/genkit-plugins?color=blue">
   <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues-pr/TheFireCo/genkit-plugins?color=blue">
   <img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/m/TheFireCo/genkit-plugins">
</div>

</br>

**`genkitx-openai`** is a community plugin for using OpenAI APIs with
[Firebase Genkit](https://github.com/firebase/genkit). Built by [**The Fire Company**](https://github.com/TheFireCo). 🔥

> [!WARNING]  
> **This plugin has been merged into the core Genkit distribution.** Please use the official OpenAI plugins instead:
>
> - **OpenAI Plugin**: `@genkit-ai/compat-oai/openai`
> - **Compatible OpenAI API Plugin**: `@genkit-ai/compat-oai`

This Genkit plugin allows to use OpenAI models through their official APIs.

## Supported models

The plugin supports several OpenAI models:

- **o1**, **o1-preview**, **o1-mini** and **o3-mini** for text generation;
- **GPT-4.5**, **GPT-4o**, **GPT-4** with all its variants (**Turbo**, **Vision**), and **GPT-3.5 Turbo** for text generation;
- **DALL-E 3** for image generation;
- **Text Embedding Small**, **Text Embedding Large**, and **Ada** for text embedding generation;
- **Whisper** for speech recognition;
- **Text-to-speech 1** and **Text-to-speech 1 HD** for speech synthesis.

This plugin also supports custom models and other cloud providers.

## Installation

Install the plugin in your project with your favorite package manager:

- `npm install genkitx-openai`
- `yarn add genkitx-openai`
- `pnpm add genkitx-openai`

## Usage

### Initialize

```typescript
import dotenv from 'dotenv';
import { genkit } from 'genkit';
import openAI, { gpt35Turbo } from 'genkitx-openai';

dotenv.config();

const ai = genkit({
  plugins: [openAI({ apiKey: process.env.OPENAI_API_KEY })],
  // specify a default model if not provided in generate params:
  model: gpt35Turbo,
});
```

### Basic examples

The simplest way to generate text is by using the `generate` method:

```typescript
const response = await ai.generate({
  model: gpt4o
  prompt: 'Tell me a joke.',
});

console.log(response.text);
```

### Multi-modal prompt

```typescript
const response = await ai.generate({
  model: gpt4o,
  prompt: [
    { text: 'What animal is in the photo?' },
    { media: { url: imageUrl } },
  ],
  config: {
    // control of the level of visual detail when processing image embeddings
    // Low detail level also decreases the token usage
    visualDetailLevel: 'low',
  },
});
console.log(response.text);
```

### Text Embeddings

```typescript
import { textEmbeddingAda002 } from 'genkitx-openai';

const embedding = await ai.embed({
  embedder: textEmbeddingAda002,
  content: 'Hello world',
});

console.log(embedding);
```

### Within a flow

```typescript
import { z } from 'genkit';

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
```

### Tool use

```typescript
import { z } from 'genkit';

// ...initialize genkit (as shown above)

const createReminder = ai.defineTool(
  {
    name: 'createReminder',
    description: 'Use this to create reminders for things in the future',
    inputSchema: z.object({
      time: z
        .string()
        .describe('ISO timestamp string, e.g. 2024-04-03T12:23:00Z'),
      reminder: z.string().describe('the content of the reminder'),
    }),
    outputSchema: z.number().describe('the ID of the created reminder'),
  },
  (reminder) => Promise.resolve(3)
);

const result = await ai.generate({
  tools: [createReminder],
  prompt: `
  You are a reminder assistant.
  If you create a reminder, describe in text the reminder you created as a response.

  Query: I have a meeting with Anna at 3 for dinner - can you set a reminder for the time?
  `,
});

console.log(result.text);
```

### Custom models & other Cloud providers

```typescript
import { GenerationCommonConfigSchema, genkit, z } from 'genkit';
import { ModelInfo } from 'genkit/model';
import openAI from 'genkitx-openai';

const modelInfo: ModelInfo = {
  versions: ['claude-3-7-sonnet-20250219'],
  label: 'Claude - Claude 3.7 Sonnet',
  supports: {
    multiturn: true,
    tools: true,
    media: false,
    systemRole: true,
    output: ['json', 'text'],
  },
};
const schema = GenerationCommonConfigSchema.extend({});

const ai = genkit({
  plugins: [
    openAI({
      apiKey: process.env.ANTHROPIC_API_KEY,
      baseURL: 'https://api.anthropic.com/v1/',
      models: [
        { name: 'claude-3-7-sonnet', info: modelInfo, configSchema: schema },
      ],
    }),
  ],
});

export const customModelFlow = ai.defineFlow(
  {
    name: 'customModelFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (subject) => {
    const llmResponse = await ai.generate({
      prompt: `tell me a joke about ${subject}`,
      model: 'openai/claude-3-7-sonnet',
      config: {
        version: 'claude-3-7-sonnet-20250219',
      },
    });
    return llmResponse.text;
  }
);
```

For more detailed examples and the explanation of other functionalities, refer to the examples in the [official Github repo of the plugin](https://github.com/TheFireCo/genkit-plugins/blob/main/examples/README.md) or in the [official Genkit documentation](https://firebase.google.com/docs/genkit/get-started).

## Contributing

Want to contribute to the project? That's awesome! Head over to our [Contribution Guidelines](https://github.com/TheFireCo/genkit-plugins/blob/main/CONTRIBUTING.md).

## Need support?

> [!NOTE]  
> This repository depends on Google's Firebase Genkit. For issues and questions related to Genkit, please refer to instructions available in [Genkit's repository](https://github.com/firebase/genkit).

Reach out by opening a discussion on [Github Discussions](https://github.com/TheFireCo/genkit-plugins/discussions).

## Credits

This plugin is proudly maintained by the team at [**The Fire Company**](https://github.com/TheFireCo). 🔥

## License

This project is licensed under the [Apache 2.0 License](https://github.com/TheFireCo/genkit-plugins/blob/main/LICENSE).

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202%2E0-lightgrey.svg)](https://github.com/TheFireCo/genkit-plugins/blob/main/LICENSE)
