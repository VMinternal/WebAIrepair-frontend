export interface AiStatus {
  modelName: string;
  dimensions: number;
  status: string;
  totalSymptoms: number;
  indexedVectors: number;
  unindexedSymptoms: number;
}

export interface MatchResult {
  symptomId: string;
  description: string;
  similarity: number;
}

export interface TestSearchResponse {
  queryText: string;
  resultCount: number;
  matches: MatchResult[];
}

export interface TestSearchDto {
  queryText: string;        
  topK?: number;        // Number of results (1-20)
  minSimilarity?: number;
  threshold?: number;   // Similarity (0.0 - 1.0)
  deviceId?: string;
}

export interface AiActionResponse {
  message: string;
  processed: number;
}