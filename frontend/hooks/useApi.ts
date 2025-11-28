'use client';

import useSWR from 'swr';
import { api } from '@/lib/api';

export function useFormats() {
  const { data, error, isLoading } = useSWR('/formats', () =>
    api.get('/formats').then((res) => (res.success ? res.data : null))
  );

  return {
    formats: data || [],
    loading: isLoading,
    error,
  };
}

export function useRequests(filters?: { status?: string; format_id?: string }) {
  const queryString = new URLSearchParams(filters || {}).toString();
  const { data, error, isLoading, mutate } = useSWR(
    `/requests?${queryString}`,
    () =>
      api.get('/requests?' + queryString).then((res) =>
        res.success
          ? res.data
          : {
              data: [],
              total: 0,
              limit: 50,
              offset: 0,
            }
      )
  );

  return {
    requests: data?.data || [],
    total: data?.total || 0,
    loading: isLoading,
    error,
    mutate,
  };
}

export function useRequest(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/requests/${id}` : null,
    () => api.get(`/requests/${id}`).then((res) => (res.success ? res.data : null))
  );

  return {
    request: data,
    loading: isLoading,
    error,
    mutate,
  };
}

export function useRequestApprovals(requestId: string | null) {
  const { data, error, isLoading } = useSWR(
    requestId ? `/requests/${requestId}/approvals` : null,
    () =>
      api
        .get(`/requests/${requestId}/approvals`)
        .then((res) => (res.success ? res.data : []))
  );

  return {
    approvals: data || [],
    loading: isLoading,
    error,
  };
}

export function usePendingApprovals() {
  const { data, error, isLoading, mutate } = useSWR('/approvals/pending', () =>
    api.get('/approvals/pending').then((res) => (res.success ? res.data : []))
  );

  return {
    approvals: data || [],
    loading: isLoading,
    error,
    mutate,
  };
}

export function useUserSignature() {
  const { data, error, isLoading } = useSWR('/signatures', () =>
    api.get('/signatures').then((res) => (res.success ? res.data : null))
  );

  return {
    signature: data,
    loading: isLoading,
    error,
  };
}
