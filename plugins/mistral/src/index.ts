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

import {
  type GenerationCommonConfigSchema,
  Genkit,
  type ModelReference,
} from 'genkit';
import { genkitPlugin } from 'genkit/plugin';
import { Mistral, SDKOptions } from '@mistralai/mistralai';
import { mistralEmbedder, SUPPORTED_EMBEDDING_MODELS } from './embedders';
import { SUPPORTED_MISTRAL_MODELS, mistralModel } from './mistral_llms';
import { OCRModel } from './ocr';

export {
  openMistral7B,
  openMistral8x7B,
  openMixtral8x22B,
  openMinistral3B,
  openMinistral8B,
  openMistralSmall,
  openMistralMedium,
  openMistralLarge,
  openMistralNemo,
  openCodestralMambda,
  openCodestral,
  openMistralSaba,
  openPixtralLarge,
  openPixtral,
} from './mistral_llms';

export { ocr } from './ocr';

export { mistralembed } from './embedders';

export interface PluginOptions extends SDKOptions {
  /**
   * Additional models references that the user wants to add to the plugin.
   * These models should be created with the `modelRef` function and then passed in here.
   * @example
   * ```ts
   * const customModel = modelRef({
   *   name: 'mistral/custom-model',
   *   info: {
   *     versions: ['custom-model'],
   *     label: 'Custom Model',
   *     supports: {
   *       multiturn: true,
   *       tools: false,
   *       media: false,
   *       systemRole: true,
   *       output: ['text', 'json'],
   *     },
   *   },
   *   configSchema: GenerationCommonConfigSchema,
   * });
   *
   * const ai = genkit({
   *  plugins: [
   *   mistral({
   *     apiKey: process.env.MISTRAL_API_KEY,
   *     serverURL: process.env.MISTRAL_ENDPOINT,
   *     customModels: {
   *      'custom-model': customModel,
   *     },
   *   }),
   *  ],
   * });
   * ```
   *
   */
  customModels?: Record<
    string,
    ModelReference<typeof GenerationCommonConfigSchema>
  >;
}

export const mistral = (options?: PluginOptions) =>
  genkitPlugin('mistral', async (ai: Genkit) => {
    let apiKey = options?.apiKey || process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      throw new Error(
        'Please pass in the API key or set the MISTRAL_API_KEY environment variable'
      );
    }

    // If we have custom models, add them to the SUPPORTED_MISTRAL_MODELS
    let customModels = options?.customModels || {};
    if (Object.keys(customModels).length > 0) {
      for (const [name, model] of Object.entries(customModels)) {
        if (model) {
          SUPPORTED_MISTRAL_MODELS[name] = model;
        }
      }
    }

    const client = new Mistral(options);

    for (const name of Object.keys(SUPPORTED_MISTRAL_MODELS)) {
      mistralModel(ai, name, client);
    }

    for (const name of Object.keys(SUPPORTED_EMBEDDING_MODELS)) {
      mistralEmbedder(ai, name, client);
    }

    OCRModel(ai, client);
  });

export default mistral;
