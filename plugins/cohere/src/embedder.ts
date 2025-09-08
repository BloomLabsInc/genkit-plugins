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

import type { Genkit } from 'genkit';
import { z } from 'genkit';
import { embedderRef } from 'genkit/embedder';
import { CohereClient } from 'cohere-ai';

import type { PluginOptions } from '.';

export const TextEmbeddingConfigSchema = z.object({
  // Its difficult with the schema to make this an array therefore its only a single string for now
  // embeddingTypes: z.array(
  //   z.enum(['float', 'int8', 'uint8', 'binary', 'ubinary'])
  // ).optional(),
  embeddingTypes: z
    .union([
      z.literal('float'),
      z.literal('int8'),
      z.literal('uint8'),
      z.literal('binary'),
      z.literal('ubinary'),
    ])
    .optional(),
  inputType: z
    .union([
      z.literal('search_document'),
      z.literal('search_query'),
      z.literal('classification'),
      z.literal('clustering'),
    ])
    .optional(),
});

export type TextEmbeddingGeckoConfig = z.infer<
  typeof TextEmbeddingConfigSchema
>;

export const TextEmbeddingInputSchema = z.string();

export const embedMultilingual4 = embedderRef({
  name: 'cohere/embed-v4.0',
  configSchema: TextEmbeddingConfigSchema,
  info: {
    dimensions: 1024,
    label: 'Cohere - Embed Multilingual v4.0',
    supports: {
      input: ['text'],
    },
  },
});

export const embedEnglish3 = embedderRef({
  name: 'cohere/embed-english-v3.0',
  configSchema: TextEmbeddingConfigSchema,
  info: {
    dimensions: 1024,
    label: 'Cohere - Embed English v3.0',
    supports: {
      input: ['text'],
    },
  },
});

export const embedMultilingual3 = embedderRef({
  name: 'cohere/embed-multilingual-v3.0',
  configSchema: TextEmbeddingConfigSchema,
  info: {
    dimensions: 1024,
    label: 'Cohere - Embed Multilingual v3.0',
    supports: {
      input: ['text'],
    },
  },
});

export const embedEnglishLight3 = embedderRef({
  name: 'cohere/embed-english-light-v3.0',
  configSchema: TextEmbeddingConfigSchema,
  info: {
    dimensions: 384,
    label: 'Cohere - Embed English Light v3.0',
    supports: {
      input: ['text', 'text'],
    },
  },
});

export const embedMultilingualLight3 = embedderRef({
  name: 'cohere/embed-multilingual-light-v3.0',
  configSchema: TextEmbeddingConfigSchema,
  info: {
    dimensions: 384,
    label: 'Cohere - Embed Multilingual Light v3.0',
    supports: {
      input: ['text'],
    },
  },
});

export const SUPPORTED_EMBEDDING_MODELS = {
  'embed-v4.0': embedMultilingual4,
  'embed-english-v3.0': embedEnglish3,
  'embed-multilingual-v3.0': embedMultilingual3,
  'embed-english-light-v3.0': embedEnglishLight3,
  'embed-multilingual-light-v3.0': embedMultilingualLight3,
};

export function cohereEmbedder(
  ai: Genkit,
  name: string,
  options?: PluginOptions
) {
  let apiKey = options?.apiKey || process.env.COHERE_API_KEY;
  if (!apiKey)
    throw new Error(
      'please pass in the API key or set the COHERE_API_KEY environment variable'
    );
  const model = SUPPORTED_EMBEDDING_MODELS[name];
  if (!model) throw new Error(`Unsupported model: ${name}`);
  const client = new CohereClient({ token: apiKey });
  return ai.defineEmbedder(
    {
      info: model.info!,
      configSchema: TextEmbeddingConfigSchema,
      name: model.name,
    },
    async (input, options) => {
      const embeddings = await client.embed({
        model: name,
        texts: input.map((d) => {
          return d.text;
        }),
        inputType: options?.inputType ? options.inputType : 'search_document',
        embeddingTypes: options?.embeddingTypes
          ? [options.embeddingTypes]
          : undefined,
      });
      try {
        return {
          embeddings: (embeddings.embeddings as number[][]).map((e) => ({
            embedding: e,
          })),
        };
      } catch (e) {
        for (const property in embeddings.embeddings) {
          if (
            Object.prototype.hasOwnProperty.call(
              embeddings.embeddings,
              property
            )
          ) {
            return {
              embeddings: (embeddings.embeddings[property] as number[][]).map(
                (e) => ({ embedding: e })
              ),
            };
          }
        }
      }
      return {
        embeddings: (embeddings.embeddings as number[][]).map((e) => ({
          embedding: e,
        })),
      };
    }
  );
}
