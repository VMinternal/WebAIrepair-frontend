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

  // Playground Test State
  const [queryText, setQueryText] = useState<string>('');
  const [topK, setTopK] = useState<number>(5);
  const [minSimilarity, setMinSimilarity] = useState<number>(0.5);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<TestSearchResponse | null>(null);

  // Auto-dismiss success notification after 4 seconds
  const showSuccessMessage = (text: string) => {
    setActionMessage({ type: 'success', text });
    setTimeout(() => {
      setActionMessage((prev) => (prev?.type === 'success' ? null : prev));
    }, 4000);
  };

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
          'Unable to connect to the AI Server service.',
      });
    } finally {
      setLoadingStatus(false);
    }
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  // Synchronize missing vectors
  const handleSync = async () => {
    try {
      setIsSyncing(true);
      setActionMessage(null);
      const res = await aiService.syncMissing();
      showSuccessMessage(res.message || 'Vector data synchronized successfully!');
      await loadStatus();
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text:
          err.response?.data?.message || err.message || 'Error during Vector synchronization.',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Re-index all data
  const handleReindex = async () => {
    if (
      !confirm(
        'WARNING: This action will DELETE ALL existing Vector indices and recreate them from scratch. Are you sure you want to proceed?'
      )
    ) {
      return;
    }
    try {
      setIsReindexing(true);
      setActionMessage(null);
      const res = await aiService.reindexAll();
      showSuccessMessage(res.message || 'Successfully re-indexed all data!');
      await loadStatus();
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text:
          err.response?.data?.message || err.message || 'Error during data re-indexing.',
      });
    } finally {
      setIsReindexing(false);
    }
  };

  // Run diagnostic test search
  const handleTestSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryText.trim()) return;

    try {
      setIsSearching(true);
      setSearchResults(null);
      setActionMessage(null);

      const simValue = Number(minSimilarity);
      const normalizedSimilarity = simValue > 1 ? simValue / 100 : simValue;

      const res = await aiService.testSearch({
        queryText: queryText,
        topK: Number(topK),
        minSimilarity: normalizedSimilarity,
      });

      setSearchResults(res);
    } catch (err: any) {
      setActionMessage({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Error sending AI diagnostic request.',
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Normalize search result data list
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