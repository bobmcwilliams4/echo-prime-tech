'use client';

import { useState, useCallback } from 'react';
import {
  queryDoctrines,
  queryMultiDomain,
  type QueryResponse,
} from '../engine-runtime-api';

export function useEngineQuery() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QueryResponse | null>(null);

  const query = useCallback(async (q: string, domain?: string, limit = 5) => {
    if (!q.trim()) return null;
    setLoading(true);
    setError(null);
    try {
      const data = await queryDoctrines(q, domain, limit);
      setResult(data);
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Query failed';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const queryMulti = useCallback(async (q: string, domains: string[], limit = 3) => {
    if (!q.trim()) return null;
    setLoading(true);
    setError(null);
    try {
      const data = await queryMultiDomain(q, domains, limit);
      setResult(data);
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Query failed';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { query, queryMulti, result, loading, error, clear };
}
