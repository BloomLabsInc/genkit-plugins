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

// __tests__/checkApiKey.test.js
const { GenkitError } = require('@genkit-ai/core');
const { checkApiKey } = require('./index'); // Adjust the path as necessary
import { ERROR_INVALID_ARGUMENT, ERROR_NO_API_KEY } from '../constants';

jest.mock('@genkit-ai/core');

describe('checkApiKey', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if apiKey is not provided', () => {
    const pluginOptions = { apiKey: undefined };

    expect(() => checkApiKey(pluginOptions)).toThrow(GenkitError);
    expect(GenkitError).toHaveBeenCalledWith({
      status: ERROR_INVALID_ARGUMENT,
      message: ERROR_NO_API_KEY,
    });
  });

  it('should not throw an error if apiKey is provided', () => {
    const pluginOptions = { apiKey: 'valid-api-key' };

    expect(() => checkApiKey(pluginOptions)).not.toThrow();
  });
});
