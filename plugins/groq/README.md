![Firebase Genkit + Groq](https://github.com/BloomLabsInc/genkit-plugins/blob/main/assets/genkit-groq.png?raw=true)

<h1 align="center">Firebase Genkit <> Groq Plugin</h1>

<h4 align="center">Groq Community Plugin for Google Firebase Genkit</h4>

<div align="center">
   <img alt="Github lerna version" src="https://img.shields.io/github/lerna-json/v/BloomLabsInc/genkit-plugins?label=version">
   <img alt="NPM Downloads" src="https://img.shields.io/npm/dw/genkitx-groq">
   <img alt="GitHub Org's stars" src="https://img.shields.io/github/stars/BloomLabsInc?style=social">
   <img alt="GitHub License" src="https://img.shields.io/github/license/BloomLabsInc/genkit-plugins">
   <img alt="Static Badge" src="https://img.shields.io/badge/yes-a?label=maintained">
</div>

<div align="center">
   <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues/BloomLabsInc/genkit-plugins?color=blue">
   <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues-pr/BloomLabsInc/genkit-plugins?color=blue">
   <img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/m/BloomLabsInc/genkit-plugins">
</div>

**`genkitx-groq`** is a community plugin for using Groq APIs with
[Firebase Genkit](https://github.com/firebase/genkit). Built by [**Bloom Labs Inc**](https://github.com/BloomLabsInc). 🔥

![Genit + Groq example](https://github.com/BloomLabsInc/genkit-plugins/assets/21220927/b56501c2-25c1-48aa-8da9-65486f0e982d)

## Installation

Install the plugin in your project with your favorite package manager:

- `npm install genkitx-groq`
- `yarn add genkitx-groq`
- `pnpm add genkitx-groq`

## Usage

### Initialize

```typescript
import dotenv from 'dotenv';
import { genkit } from 'genkit';
import { groq, gemma2x9b } from 'genkitx-groq';

dotenv.config();

const ai = genkit({
  plugins: [groq({ apiKey: process.env.GROQ_API_KEY })],
  // optional: default model for generate calls
  model: gemma2x9b,
});
```

### Basic examples

The simplest way to generate text is by using the `generate` method:

```typescript
const response = await ai.generate({
  model: llama3x70b, // model imported from genkitx-groq
  prompt: 'Tell me a joke.',
});

console.log(response.text);
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

// Run the flow using the CLI:
// genkit flow:run jokeFlow "chicken"
```

### Tool use

```typescript
import { z } from 'genkit';

// ...initialise genkit as described above...

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

## Contributing

Want to contribute to the project? That's awesome! Head over to our [Contribution Guidelines](https://github.com/BloomLabsInc/genkit-plugins/blob/main/CONTRIBUTING.md).

## Need support?

> \[!NOTE\]\
> This repository depends on Google's Firebase Genkit. For issues and questions related to Genkit, please refer to instructions available in [Genkit's repository](https://github.com/firebase/genkit).

Reach out by opening a discussion on [Github Discussions](https://github.com/BloomLabsInc/genkit-plugins/discussions).

## Credits

This plugin is proudly maintained by the team at [**Bloom Labs Inc**](https://github.com/BloomLabsInc). 🔥

## License

This project is licensed under the [Apache 2.0 License](https://github.com/BloomLabsInc/genkit-plugins/blob/main/LICENSE).
