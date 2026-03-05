/**
 * eBay Listing API Client — Echo Prime Technologies
 * Worker: echo-ebay.bmcii1976.workers.dev
 */

const EBAY_API_URL = 'https://echo-ebay.bmcii1976.workers.dev';
const ECHO_API_KEY = 'echo-omega-prime-forge-x-2026';

async function ebayFetch<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Echo-API-Key': ECHO_API_KEY,
    ...(options.headers as Record<string, string> || {}),
  };
  const res = await fetch(`${EBAY_API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`eBay API ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

// ─── Types ───

export interface EbayListing {
  id: number;
  ebay_listing_id: string | null;
  ebay_offer_id: string | null;
  ebay_sku: string;
  cortex_uid: string | null;
  title: string;
  issue_number: string | null;
  publisher: string | null;
  price: number;
  status: string;
  listing_type: string;
  condition_id: number | null;
  category_id: string | null;
  ebay_url: string | null;
  error_message: string | null;
  batch_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface EbayListingResult {
  success: boolean;
  sku?: string;
  offerId?: string;
  listingId?: string;
  ebayUrl?: string;
  error?: string;
}

export interface EbayBulkResult {
  batchId: string;
  total: number;
  completed: number;
  failed: number;
  results: EbayListingResult[];
}

export interface EbayStats {
  active: number;
  ended: number;
  errored: number;
  total: number;
  totalActiveValue: number;
  recentListings: Array<{
    id: number;
    title: string;
    issue_number: string | null;
    price: number;
    status: string;
    ebay_url: string | null;
    created_at: string;
  }>;
}

export interface EbayAuthStatus {
  connected: boolean;
  tokenValid: boolean;
  environment: string;
}

export interface EbayFeeEstimate {
  fees: Array<{ feeType: string; amount: number }>;
}

export interface EbayCategory {
  categoryId: string;
  categoryName: string;
}

export interface ListingInput {
  cortexUid?: string;
  title: string;
  issue?: string;
  publisher?: string;
  year?: number;
  grade?: number | null;
  gradeLabel?: string;
  confidence?: number;
  defects?: string[];
  era?: string;
  keyIssue?: boolean;
  keyIssueReason?: string;
  writer?: string;
  coverArtist?: string;
  frontR2Key?: string;
  backR2Key?: string;
  collectibleType?: string;
  price: number;
  categoryId?: string;
  listingType?: 'fixed_price' | 'auction';
}

// ─── Auth ───

export async function checkEbayConnection(): Promise<EbayAuthStatus> {
  return ebayFetch('/auth/status');
}

export function getEbayAuthUrl(): string {
  return `${EBAY_API_URL}/auth/login`;
}

export async function disconnectEbay(): Promise<{ success: boolean }> {
  return ebayFetch('/auth/disconnect', { method: 'POST' });
}

// ─── Listings ───

export async function listOnEbay(item: ListingInput): Promise<EbayListingResult> {
  return ebayFetch('/listings/create', {
    method: 'POST',
    body: JSON.stringify(item),
  });
}

export async function bulkListOnEbay(items: ListingInput[], options?: {
  priceStrategy?: 'consensus' | 'markup' | 'fixed';
  markupPercent?: number;
  fixedPrice?: number;
}): Promise<EbayBulkResult> {
  return ebayFetch('/listings/bulk', {
    method: 'POST',
    body: JSON.stringify({ items, ...options }),
  });
}

export async function getListings(status?: string, limit = 100): Promise<{ listings: EbayListing[]; total: number }> {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  params.set('limit', String(limit));
  return ebayFetch(`/listings?${params}`);
}

export async function getListing(id: string | number): Promise<{ listing: EbayListing }> {
  return ebayFetch(`/listings/${id}`);
}

export async function endListing(id: number): Promise<{ success: boolean; error?: string }> {
  return ebayFetch(`/listings/${id}/end`, { method: 'POST' });
}

export async function reviseListing(id: number, updates: { price?: number; description?: string }): Promise<{ success: boolean; error?: string }> {
  return ebayFetch(`/listings/${id}/revise`, {
    method: 'POST',
    body: JSON.stringify(updates),
  });
}

// ─── Categories & Estimates ───

export async function suggestCategories(query: string): Promise<{ categories: EbayCategory[] }> {
  return ebayFetch(`/categories/suggest?q=${encodeURIComponent(query)}`);
}

export async function estimateFees(price: number, categoryId?: string): Promise<EbayFeeEstimate> {
  return ebayFetch('/listings/estimate', {
    method: 'POST',
    body: JSON.stringify({ price, categoryId }),
  });
}

// ─── Stats ───

export async function getEbayStats(): Promise<EbayStats> {
  return ebayFetch('/stats');
}
