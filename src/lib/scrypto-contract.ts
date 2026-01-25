/**
 * Scrypto Contract Utilities
 * 
 * Helper functions for contract interactions and UI display.
 * Wallet connection provides identity; escrow logic is handled via the database.
 */

// Match status enum for UI display
export enum MatchStatus {
  Pending = 'pending',
  Accepted = 'accepted',
  Staked = 'staked',
  InSession = 'in_session',
  Completed = 'completed',
  Disputed = 'disputed'
}

// Resolution types for escrow
export type Resolution = 'refunded' | 'treasury';

/**
 * Generate a transaction hash
 */
export function generateTxHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

// Backward compatibility alias
export const generateDemoTxHash = generateTxHash;

/**
 * Simulate network delay for UX feedback
 */
export async function simulateNetworkDelay(ms: number = 1500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Format ETH amount for display
 */
export function formatEthAmount(amount: number): string {
  return amount.toFixed(4);
}

/**
 * Status labels for UI display
 */
export const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'yellow' },
  accepted: { label: 'Accepted', color: 'blue' },
  staked: { label: 'Staked', color: 'purple' },
  in_session: { label: 'In Session', color: 'orange' },
  completed: { label: 'Completed', color: 'green' },
  disputed: { label: 'Disputed', color: 'red' },
  refunded: { label: 'Refunded', color: 'green' },
  treasury: { label: 'To Treasury', color: 'red' },
  locked: { label: 'Locked', color: 'purple' }
};

/**
 * Escrow configuration constants
 */
export const ESCROW_CONFIG = {
  STARTING_BALANCE: 1.0,
  DEFAULT_STAKE_AMOUNT: 0.01,
  MIN_STAKE_AMOUNT: 0.001,
  MAX_STAKE_AMOUNT: 0.5,
};

// Backward compatibility alias
export const DEMO_CONFIG = ESCROW_CONFIG;
