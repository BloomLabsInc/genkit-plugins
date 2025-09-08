---
id: genkitx-milvus
title: genkitx-milvus
---

<h1 align="center">Firebase Genkit - Milvus Plugin</h1>

<h4 align="center">Milvus Community Plugin for Google Firebase Genkit</h4>

<div align="center">
   <img alt="Github lerna version" src="https://img.shields.io/github/lerna-json/v/BloomLabsInc/genkit-plugins?label=version"/>
   <img alt="NPM Downloads" src="https://img.shields.io/npm/dw/genkitx-groq"/>
   <img alt="GitHub Org's stars" src="https://img.shields.io/github/stars/BloomLabsInc?style=social"/>
   <img alt="GitHub License" src="https://img.shields.io/github/license/BloomLabsInc/genkit-plugins"/>
   <img alt="Static Badge" src="https://img.shields.io/badge/yes-a?label=maintained"/>
</div>

<div align="center">
   <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues/BloomLabsInc/genkit-plugins?color=blue"/>
   <img alt="GitHub Issues or Pull Requests" src="https://img.shields.io/github/issues-pr/BloomLabsInc/genkit-plugins?color=blue"/>
   <img alt="GitHub commit activity" src="https://img.shields.io/github/commit-activity/m/BloomLabsInc/genkit-plugins"/>
</div>

**`genkitx-milvus`** is a community plugin for using [Milvus](https://milvus.io/) Vector Database with
[Firebase Genkit](https://github.com/firebase/genkit). Built by [**Bloom Labs Inc**](https://github.com/BloomLabsInc). 🔥

## Installation

Install the plugin in your project with your favorite package manager:

- `npm install genkitx-milvus`
- `yarn add genkitx-milvus`
- `pnpm add genkitx-milvus`

## Usage

### Initialize

To use this plugin, specify it when you initialize Genkit:

```js
import { genkit } from 'genkit';
import { milvus } from 'genkitx-milvus';

export default genkit({
  plugins: [
    milvus([
      {
        collectionName: 'collection_01',
        embedder: textEmbeddingGecko,
      },
    ]),
  ],
  // ...
});
```

You must specify a Milvus collection and the embedding model you want to use. In
addition, there are three optional parameters:

- `dbName`: Specified database

- `clientParams`: If you're not running your Milvus server on the same machine
  as your Genkit flow, you need to specify auth options, or you're otherwise not
  running a default Milvus server configuration, you can specify Milvus client connection parameters: address and token.

  ```js
  clientParams: {
    address: "",
    token: "",
  }
  ```

- `embedderOptions`: Use this parameter to pass options to the embedder:

  ```js
  embedderOptions: { taskType: 'RETRIEVAL_DOCUMENT' },
  ```

### Basic Examples

Import retriever and indexer references like so:

```js
import { milvusRetrieverRef, milvusIndexerRef } from 'genkitx-milvus';
```

Then, use the references with `ai.retrieve()` and `ai.index()`:

```js
// To use the index you configured when you loaded the plugin:
let docs = await ai.retrieve({ retriever: milvusRetrieverRef, query });

// To specify an index:
export const customRetriever = milvusRetrieverRef({
  collectionName: 'collection_01',
});
docs = await ai.retrieve({ retriever: customRetriever, query });
```

```js
// To use the index you configured when you loaded the plugin:
await ai.index({ indexer: milvusIndexerRef, documents });

// To specify an index:
export const customIndexer = milvusIndexerRef({
  collectionName: 'collection_01',
});
await ai.index({ indexer: customIndexer, documents });
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
