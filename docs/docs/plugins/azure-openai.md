---
id: genkitx-azure-openai
title: genkitx-azure-openai
---

<h1 align="center">
   Firebase Genkit - Azure OpenAI Plugin
</h1>

<h4 align="center">Azure OpenAI Community Plugin for Google Firebase Genkit</h4>

<div align="center">
   <img alt="Github lerna version" src="https://img.shields.io/github/lerna-json/v/BloomLabsInc/genkit-plugins?label=version"/>
   <img alt="NPM Downloads" src="https://img.shields.io/npm/dw/genkitx-azure-openai"/>
   <img alt="GitHub Org's stars" src="https://img.shields.io/github/stars/BloomLabsInc?style=social"/>
   <img alt="GitHub License" src="https://img.shields.io/github/license/BloomLabsInc/genkit-plugins"/>
   <img alt="Static Badge" src="https://img.shields.io/badge/yes-a?label=maintained"/>
</div>

<div align="center">
   <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues/BloomLabsInc/genkit-plugins?color=blue"/>
   <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues-pr/BloomLabsInc/genkit-plugins?color=blue"/>
   <img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/m/BloomLabsInc/genkit-plugins"/>
</div>

**`genkitx-azure-openai`** is a community plugin for using Azure OpenAI APIs with
[Firebase Genkit](https://github.com/firebase/genkit). Built by [**Bloom Labs Inc**](https://github.com/BloomLabsInc). 🔥

## Installation

Install the plugin in your project with your favorite package manager:

- `npm install genkitx-azure-openai`
- `yarn add genkitx-azure-openai`
- `pnpm add genkitx-azure-openai`

## Usage

> The interface to the models of this plugin is the same as for the [OpenAI plugin](openai.md).

### Initialize

You'll also need to have an Azure OpenAI instance deployed. You can deploy a version on Azure Portal following [this guide](https://learn.microsoft.com/azure/ai-services/openai/how-to/create-resource?pivots=web-portal).

Once you have your instance running, make sure you have the endpoint and key. You can find them in the Azure Portal, under the "Keys and Endpoint" section of your instance.

You can then define the following environment variables to use the service:

```
AZURE_OPENAI_ENDPOINT=<YOUR_ENDPOINT>
AZURE_OPENAI_API_KEY=<YOUR_KEY>
OPENAI_API_VERSION=<YOUR_API_VERSION>
```

Alternatively, you can pass the values directly to the `azureOpenAI` constructor:

```typescript
import { azureOpenAI, gpt4o } from 'genkitx-azure-openai';
import { genkit } from 'genkit';
const apiVersion = '2024-10-21';

const ai = genkit({
  plugins: [
    azureOpenAI({
      apiKey: '<your_key>',
      endpoint: '<your_endpoint>',
      deployment: '<your_embedding_deployment_name',
      apiVersion,
    }),
    // other plugins
  ],
  model: gpt4o,
});
```

If you're using Azure Managed Identity, you can also pass the credentials directly to the constructor:

```typescript
import { azureOpenAI, gpt4o } from 'genkitx-azure-openai';
import { genkit } from 'genkit';
import {
  DefaultAzureCredential,
  getBearerTokenProvider,
} from '@azure/identity';
const apiVersion = '2024-10-21';

const credential = new DefaultAzureCredential();
const scope = 'https://cognitiveservices.azure.com/.default';
const azureADTokenProvider = getBearerTokenProvider(credential, scope);

const ai = genkit({
  plugins: [
    azureOpenAI({
      azureADTokenProvider,
      endpoint: '<your_endpoint>',
      deployment: '<your_embedding_deployment_name',
      apiVersion,
    }),
    // other plugins
  ],
  model: gpt4o,
});
```

### Basic examples

The simplest way to call the text generation model is by using the helper function `generate`:

```typescript
// Basic usage of an LLM
const response = await ai.generate({
  prompt: 'Tell me a joke.',
});

console.log(await response.text);
```

Using the same interface, you can prompt a multimodal model:

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
console.log(await response.text);
```

For more detailed examples and the explanation of other functionalities, refer to the examples in the [official Github repo of the plugin](https://github.com/BloomLabsInc/genkit-plugins/blob/main/examples/README.md) or in the [official Genkit documentation](https://firebase.google.com/docs/genkit/get-started).

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

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202%2E0-lightgrey.svg)](https://github.com/BloomLabsInc/genkit-plugins/blob/main/LICENSE)
