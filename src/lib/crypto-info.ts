/**
 * BINANCE PAY MERCHANT STATUS: Binance Pay merchant integration requires an approved Binance merchant account.
 * This system uses direct crypto wallet donations as the payment method.
 * Wallets are configured via environment variables.
 * Transaction verification is performed by admin review.
 * Never mark a donation as completed without admin verification or blockchain confirmation.
 */

export interface CryptoConfig {
  currency: string;
  symbol: string;
  network: string;
  networkLabel: string;
  walletEnvVar: string;
  explorerBaseUrl: string;
  explorerTxPath: string;
  confirmations: number;
  icon: string;
  color: string;
}

export const CRYPTO_CONFIGS: Record<string, CryptoConfig> = {
  USDT_BEP20: {
    currency: 'USDT',
    symbol: 'USDT',
    network: 'BEP20',
    networkLabel: 'BNB Smart Chain (BEP-20)',
    walletEnvVar: 'NEXT_PUBLIC_USDT_BEP20_WALLET',
    explorerBaseUrl: 'https://bscscan.com',
    explorerTxPath: '/tx/',
    confirmations: 15,
    icon: '💛',
    color: '#F3BA2F',
  },
  USDT_TRC20: {
    currency: 'USDT',
    symbol: 'USDT',
    network: 'TRC20',
    networkLabel: 'Tron (TRC20)',
    walletEnvVar: 'NEXT_PUBLIC_USDT_TRC20_WALLET',
    explorerBaseUrl: 'https://tronscan.org',
    explorerTxPath: '/#/transaction/',
    confirmations: 20,
    icon: '💚',
    color: '#26A17B',
  },
  USDT_ERC20: {
    currency: 'USDT',
    symbol: 'USDT',
    network: 'ERC20',
    networkLabel: 'Ethereum (ERC20)',
    walletEnvVar: 'NEXT_PUBLIC_USDT_ERC20_WALLET',
    explorerBaseUrl: 'https://etherscan.io',
    explorerTxPath: '/tx/',
    confirmations: 12,
    icon: '💜',
    color: '#627EEA',
  },
  BTC: {
    currency: 'BTC',
    symbol: 'BTC',
    network: 'BTC',
    networkLabel: 'Bitcoin',
    walletEnvVar: 'NEXT_PUBLIC_BTC_WALLET',
    explorerBaseUrl: 'https://blockstream.info',
    explorerTxPath: '/tx/',
    confirmations: 3,
    icon: '🟠',
    color: '#F7931A',
  },
  ETH: {
    currency: 'ETH',
    symbol: 'ETH',
    network: 'ERC20',
    networkLabel: 'Ethereum',
    walletEnvVar: 'NEXT_PUBLIC_ETH_WALLET',
    explorerBaseUrl: 'https://etherscan.io',
    explorerTxPath: '/tx/',
    confirmations: 12,
    icon: '💎',
    color: '#627EEA',
  },
  BNB: {
    currency: 'BNB',
    symbol: 'BNB',
    network: 'BSC',
    networkLabel: 'BNB Smart Chain',
    walletEnvVar: 'NEXT_PUBLIC_BNB_WALLET',
    explorerBaseUrl: 'https://bscscan.com',
    explorerTxPath: '/tx/',
    confirmations: 15,
    icon: '🟡',
    color: '#F3BA2F',
  },
};

/**
 * Returns the wallet address for a given currency/network key.
 * Key format: "USDT_TRC20", "BTC", "ETH", etc.
 */
export function getWalletAddress(currencyKey: string): string | null {
  const config = CRYPTO_CONFIGS[currencyKey];
  if (!config) return null;

  const address = process.env[config.walletEnvVar];
  if (!address || address.startsWith('your_')) return null;

  return address;
}

/**
 * Returns the blockchain explorer URL for a transaction hash.
 */
export function getExplorerUrl(currencyKey: string, txHash: string): string | null {
  const config = CRYPTO_CONFIGS[currencyKey];
  if (!config || !txHash) return null;

  return `${config.explorerBaseUrl}${config.explorerTxPath}${txHash}`;
}

/**
 * Returns all configured (non-empty) crypto payment options.
 */
export function getAvailableCryptos(): Array<CryptoConfig & { walletAddress: string; key: string }> {
  return Object.entries(CRYPTO_CONFIGS)
    .filter(([key]) => !!getWalletAddress(key))
    .map(([key, config]) => ({
      ...config,
      key,
      walletAddress: getWalletAddress(key)!,
    }));
}
