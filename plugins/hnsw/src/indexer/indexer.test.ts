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

export {};
// saveVectorIndexer.test.js
const fs = require('fs');
const { glob } = require('glob');
const { CharacterTextSplitter } = require('langchain/text_splitter');
const { HNSWLib } = require('langchain/vectorstores');
const { GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai');

const { saveVectorIndexer } = require('./index'); // Adjust the path as necessary

jest.mock('fs');
jest.mock('glob');
jest.mock('langchain/text_splitter');
jest.mock('langchain/vectorstores');
jest.mock('@langchain/google-genai');

describe('saveVectorIndexer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should process files and save the vector store', async () => {
    const mockFiles = ['file1.txt', 'file2.txt'];
    const mockFileData = ['content of file1', 'content of file2'];
    const mockChunks = ['chunk1', 'chunk2', 'chunk3', 'chunk4'];
    const mockApiKey = 'test-api-key';
    const mockOutputPath = 'output/path';
    const mockFlowOptions = {
      dataPath: './*',
      indexOutputPath: mockOutputPath,
      chunkSize: 1024,
      separator: '\n',
    };
    const mockPluginOptions = { apiKey: mockApiKey };

    glob.mockImplementation(() => mockFiles);

    fs.readFileSync.mockImplementation((path: string) => {
      return mockFileData[mockFiles.indexOf(path)];
    });

    CharacterTextSplitter.mockImplementation(() => {
      return {
        splitText: jest.fn().mockImplementation((text) => {
          return [text]; // Simple mock, return the text as single chunk
        }),
      };
    });

    HNSWLib.fromTexts = jest.fn().mockResolvedValue({
      save: jest.fn(),
    });

    const result = await saveVectorIndexer(mockFlowOptions, mockPluginOptions);
    const options = { ignore: 'node_modules/**' };

    expect(glob).toHaveBeenCalledWith(mockFlowOptions.dataPath, options);
    expect(fs.readFileSync).toHaveBeenCalledTimes(mockFiles.length);
    expect(CharacterTextSplitter).toHaveBeenCalledWith({
      chunkSize: mockFlowOptions.chunkSize,
      separator: mockFlowOptions.separator,
    });
    expect(HNSWLib.fromTexts).toHaveBeenCalledWith(
      expect.arrayContaining(mockFileData),
      expect.arrayContaining(mockFileData.map((_, i) => ({ id: i }))),
      expect.any(GoogleGenerativeAIEmbeddings)
    );
    expect(result).toBe(`VectorStore saved to ${mockOutputPath}`);
  });
});
