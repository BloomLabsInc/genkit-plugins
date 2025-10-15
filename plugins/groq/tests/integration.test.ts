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
import { genkit, Genkit, z } from 'genkit';
import { groq, PluginOptions } from '../src/index';
import { type ChatCompletion } from 'groq-sdk/resources/chat/index.mjs';

const mockCreate = jest.fn();

jest.mock('groq-sdk', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  })),
}));

describe('with a genkit instance', () => {
  const MODEL_NAME = 'llama-guard-3-8b';
  const AI_MESSAGE = 'Hello from mock Groq!';
  const USER_PROMPT = 'Hello';

  let ai: Genkit;

  beforeEach(() => {
    mockCreate.mockClear();
    ai = genkit({
      plugins: [groq({ apiKey: 'test-api-key' })],
    });
  });

  const createMockChatCompletion = (content: string): ChatCompletion => ({
    id: 'chatcmpl-test-123',
    object: 'chat.completion',
    created: 1234567890,
    model: MODEL_NAME,
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant',
          content,
        },
        finish_reason: 'stop',
        logprobs: null,
      },
    ],
    usage: {
      prompt_tokens: 10,
      completion_tokens: 5,
      total_tokens: 15,
    },
    system_fingerprint: 'mock-fingerprint',
  });

  it('should handle basic response request when passing in a model string', async () => {
    mockCreate.mockResolvedValue(createMockChatCompletion(AI_MESSAGE));

    const result = await ai.generate({
      model: `groq/${MODEL_NAME}`,
      prompt: USER_PROMPT,
    });

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith({
      messages: [{ role: 'user', content: USER_PROMPT }],
      model: MODEL_NAME,
      response_format: { type: 'text' },
    });

    expect(result.text).toBe(AI_MESSAGE);
  });

  it('should handle basic chat request when passing in modelRef e.g llamaGuard3x8b', () => {
    // TODO: mocks might need changing up for this test
    // mockCreate.mockResolvedValue(createMockChatCompletion(AI_MESSAGE));
    // TODO: import llamaGuard3x8b model reference and use in test
    // const result = await ai.generate({
    //   model: llamaGuard3x8b,
    //   prompt: USER_PROMPT,
    // });
    // expect(mockCreate).toHaveBeenCalledTimes(1);
    // expect(mockCreate).toHaveBeenCalledWith({
    //   messages: [{ role: 'user', content: USER_PROMPT }],
    //   model: MODEL_NAME,
    //   response_format: { type: 'text' },
    // });
    // expect(result.text).toBe(AI_MESSAGE);
  });
});

describe('calling the standalone plugin', () => {
  it('should be able to call groq().model("some model name")', () => {
    // TODO: look at the migration doc for a reference for how this should work
  });
});
