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

// retrieveResponseWithVector.test.js
const { HNSWLib } = require('langchain/vectorstores');
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
const { generate } = require('@genkit-ai/ai');
const { retrieveResponseWithVector } = require('./index'); // Adjust the path as necessary

jest.mock('langchain/vectorstores');
jest.mock('@langchain/google-genai');
jest.mock('@genkit-ai/ai');

describe('retrieveResponseWithVector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve a response based on vector similarity search', async () => {
    const mockPrompt = 'test prompt';
    const mockIndexPath = 'index/path';
    const mockApiKey = 'test-api-key';
    const mockFlowOptions = {
      prompt: mockPrompt,
      indexPath: mockIndexPath,
      temperature: 0.2,
      maxOutputTokens: 100,
      topK: 5,
      topP: 0.9,
      stopSequences: ['.'],
    };
    const mockPluginOptions = { apiKey: mockApiKey };
    const mockContext = ['context1', 'context2'];
    const mockHistories = [
      { role: 'user', content: [{ text: 'context1' }] },
      { role: 'model', content: [{ text: 'Understood' }] },
      { role: 'user', content: [{ text: 'context2' }] },
      { role: 'model', content: [{ text: 'Understood' }] },
    ];
    const mockPromptResult = {
      text: jest.fn().mockReturnValue('mock response'),
    };

    const mockStore = {
      similaritySearch: jest
        .fn()
        .mockResolvedValue(mockContext.map((c) => ({ pageContent: c }))),
    };

    HNSWLib.load.mockResolvedValue(mockStore);
    generate.mockResolvedValue(mockPromptResult);

    const result = await retrieveResponseWithVector(
      mockFlowOptions,
      mockPluginOptions
    );

    expect(HNSWLib.load).toHaveBeenCalledWith(
      mockIndexPath,
      expect.any(GoogleGenerativeAIEmbeddings)
    );
    expect(mockStore.similaritySearch).toHaveBeenCalledWith(mockPrompt, 1);
    expect(generate).toHaveBeenCalledWith({
      history: mockHistories,
      prompt: mockPrompt,
      model: expect.anything(), // geminiProModel isn't actually used in the test, so we use anything()
      config: {
        temperature: 0.2,
        maxOutputTokens: 100,
        topK: 5,
        topP: 0.9,
        stopSequences: ['.'],
      },
    });
    expect(result).toBe('mock response');
  });
});
