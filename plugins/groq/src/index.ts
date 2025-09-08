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

// Import necessary types and functions for Groq SDK integration.
import Groq from 'groq-sdk';
import {
  groqModel,
  llama3x70b,
  llama3x8b,
  llamaGuard3x8b,
  llama33x70bVersatile,
  llama4Maverick17b,
  llama4MScout17b,
  llama31x8bInstant,
  gemma2x9b,
  mistralSaba,
  qwenqwqx32b,
  allam2x7b,
  deepseekR1DistillLlamax70b,
  SUPPORTED_GROQ_MODELS,
} from './groq_models';
import { Genkit } from 'genkit';
import { genkitPlugin } from 'genkit/plugin';

// Export models for direct access
export {
  llama3x70b,
  llama3x8b,
  llamaGuard3x8b,
  llama33x70bVersatile,
  llama4Maverick17b,
  llama4MScout17b,
  llama31x8bInstant,
  gemma2x9b,
  mistralSaba,
  qwenqwqx32b,
  allam2x7b,
  deepseekR1DistillLlamax70b,
};

// Define the PluginOptions interface for customization of the Groq plugin.
// This configuration provides flexibility and defaults for Groq API connectivity.
export interface PluginOptions {
  /**
   * Defaults to process.env['GROQ_API_KEY'].
   */
  apiKey?: string | undefined;

  /**
   * Override the default base URL for the API, e.g., "https://api.example.com/v2/"
   *
   * Defaults to process.env['GROQ_BASE_URL'].
   */
  baseURL?: string | null | undefined;

  /**
   * The maximum amount of time (in milliseconds) that the client should wait for a response
   * from the server before timing out a single request.
   *
   * Note that request timeouts are retried by default, so in a worst-case scenario you may wait
   * much longer than this timeout before the promise succeeds or fails.
   */
  timeout?: number;

  /**
   * The maximum number of times that the client will retry a request in case of a
   * temporary failure, like a network error or a 5XX error from the server.
   *
   * @default 2
   */
  maxRetries?: number;

  // TODO: add additional options supported by the Groq SDK
}

/**
 * Initializes and returns the Groq plugin with provided or default options.
 *
 * @param options - Optional configuration settings for the plugin.
 * @returns An object containing the models initialized with the Groq client.
 */
export const groq = (options?: PluginOptions) =>
  genkitPlugin('groq', async (ai: Genkit) => {
    const apiKey = options?.apiKey || process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error(
        'Please provide the API key or set the GROQ_API_KEY environment variable'
      );
    }

    // Initialize Groq client
    const client = new Groq({
      baseURL: options?.baseURL || process.env.GROQ_BASE_URL, // Optional base URL with environment variable fallback
      apiKey, // API key retrieved from options or environment
      timeout: options?.timeout, // Optional timeout
      maxRetries: options?.maxRetries, // Optional max retries
    });

    // Register each model with the Genkit instance
    for (const name of Object.keys(SUPPORTED_GROQ_MODELS)) {
      groqModel(ai, name, client);
    }
  });

// Default export for plugin usage
export default groq;
