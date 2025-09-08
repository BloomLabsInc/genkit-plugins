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

import { GenkitError } from '@genkit-ai/core';
import { StatusName } from '@genkit-ai/core/lib/statusTypes';

import { PluginOptions } from '../interfaces';

import { ERROR_INVALID_ARGUMENT, ERROR_NO_API_KEY } from '../constants';

export const throwError = (status: StatusName, message: string) => {
  throw new GenkitError({
    status,
    message,
  });
};

export const checkApiKey = (pluginOptions: PluginOptions) => {
  const { apiKey } = pluginOptions;
  if (!apiKey) return throwError(ERROR_INVALID_ARGUMENT, ERROR_NO_API_KEY);
};
