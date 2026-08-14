'use client';

import { useState, useEffect, useCallback } from 'react';
import { AiStatus, TestSearchResponse } from '@/types/ai';
import { aiService } from '@/services/ai.service';

export function useAiManagement() {
  // AI Status & Operation Management
  const [status, setStatus] = useState<AiStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isReindexing, setIsReindexing] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // State Playground Test
  const [queryText, setQueryText] = useState<string>('');
  const [topK, setTopK] = useState<number>(5);
  const [minSimilarity, setMinSimilarity] = useState<number>(0.5);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<TestSearchResponse | null>(null);

  // Load Model & Vector DB state
  const loadStatus = useCallback(async () => {
    try {
      setLoadingStatus(true);
      const data = await aiService.getStatus();
      setStatus(data);
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text:
          err.response?.data?.message ||
          err.message ||
          'Unable to connect to the AI API.',
      });
    } finally {
      setLoadingStatus(false);
    }
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  // Vector sync not available yet
  const handleSync = async () => {
    try {
      setIsSyncing(true);
      setActionMessage(null);
      const res = await aiService.syncMissing();
      setActionMessage({
        type: 'success',
        text: res.message || 'Successfully synchronized!',
      });
      await loadStatus();
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text:
          err.response?.data?.message || err.message || 'Vector synchronization error',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Re-index all
  const handleReindex = async () => {
    if (
      !confirm(
        'WARNING: This action will delete all existing vectors and recreate them from scratch. Are you sure?'
      )
    ) {
      return;
    }
    try {
      setIsReindexing(true);
      setActionMessage(null);
      const res = await aiService.reindexAll();
      setActionMessage({
        type: 'success',
        text: res.message || 'Re-indexing successful!',
      });
      await loadStatus();
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text:
          err.response?.data?.message || err.message || 'Vector re-indexing error',
      });
    } finally {
      setIsReindexing(false);
    }
  };

  // Run Test Playground
  const handleTestSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryText.trim()) return;

    try {
      setIsSearching(true);
      setSearchResults(null);

      const res = await aiService.testSearch({
        query: queryText,
        topK: Number(topK),
        threshold: Number(minSimilarity),
      });

      setSearchResults(res);
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text: err.response?.data?.message || err.message || 'AI diagnostic error',
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Automatically normalize search result data
  const matchesList = Array.isArray(searchResults)
    ? searchResults
    : searchResults?.matches || [];

  return {
    status,
    loadingStatus,
    isSyncing,
    isReindexing,
    actionMessage,
    setActionMessage,
    queryText,
    setQueryText,
    topK,
    setTopK,
    minSimilarity,
    setMinSimilarity,
    isSearching,
    searchResults,
    matchesList,
    loadStatus,
    handleSync,
    handleReindex,
    handleTestSearch,
  };
}