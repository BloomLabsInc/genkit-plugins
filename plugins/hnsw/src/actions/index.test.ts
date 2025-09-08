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

const { saveVectorIndexer } = require('../indexer');

jest.mock('../indexer', () => ({
  saveVectorIndexer: jest.fn(),
}));

describe('checkApiKey on HNSW Indexer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should successfully save vector indexer data when provided valid options', async () => {
    const mockFlowOptions = {
      dataPath: 'valid/path',
      indexOutputPath: 'output/path',
    };
    const mockPluginOptions = { apiKey: 'valid-api-key' };
    saveVectorIndexer.mockResolvedValue('Indexing completed');
    const { hnswIndexerAction } = require('./index');
    const result = await hnswIndexerAction(mockFlowOptions, mockPluginOptions);
    expect(saveVectorIndexer).toHaveBeenCalledWith(
      mockFlowOptions,
      mockPluginOptions
    );
    expect(result).toEqual('Indexing completed');
  });

  it('should handle errors when dataPath is missing or invalid', async () => {
    const mockFlowOptions = { dataPath: '', indexOutputPath: 'output/path' };
    const mockPluginOptions = { apiKey: 'valid-api-key' };
    const error = new Error('Invalid data path');
    saveVectorIndexer.mockRejectedValue(error);
    const { hnswIndexerAction } = require('./index');
    const result = await hnswIndexerAction(mockFlowOptions, mockPluginOptions);
    expect(saveVectorIndexer).toHaveBeenCalledWith(
      mockFlowOptions,
      mockPluginOptions
    );
    expect(result).toEqual(`Vector index saving error, ${error}`);
  });
});
