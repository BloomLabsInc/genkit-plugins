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
import { genkitPlugin } from 'genkit/plugin';
import { CohereClient } from 'cohere-ai';

import {
  cohereEmbedder,
  SUPPORTED_EMBEDDING_MODELS,
  embedMultilingual4,
} from './embedder';
import { commandModel, SUPPORTED_COMMAND_MODELS } from './command';

export {
  command,
  commandLight,
  commandR,
  commandRPlus,
  commandA,
} from './command';
export {
  embedMultilingual4,
  embedEnglish3,
  embedEnglishLight3,
  embedMultilingual3,
  embedMultilingualLight3,
} from './embedder';
export interface PluginOptions {
  apiKey?: string;
}

export const cohere = (options?: PluginOptions) =>
  genkitPlugin('cohere', async (ai: Genkit) => {
    let apiKey = options?.apiKey || process.env.COHERE_API_KEY;
    if (!apiKey)
      throw new Error(
        'Please pass in the API key or set the COHERE_API_KEY environment variable'
      );
    const client = new CohereClient({ token: apiKey });

    for (const name of Object.keys(SUPPORTED_COMMAND_MODELS)) {
      commandModel(ai, name, client);
    }

    for (const name of Object.keys(SUPPORTED_EMBEDDING_MODELS)) {
      cohereEmbedder(ai, name, options);
    }
  });

export default cohere;
