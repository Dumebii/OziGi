export const GTAG_ID = 'AW-18111303438';
export const CONVERSION_SEND_TO = 'AW-18111303438/3doeCIOx3qIcEI6ekrxD';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/**
 * Fire a Google Ads purchase conversion event.
 * Call this once after a successful checkout — e.g. when ?checkout=success
 * appears in the URL on the dashboard.
 */
export function fireConversion(transactionId?: string) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', 'conversion', {
    send_to: CONVERSION_SEND_TO,
    transaction_id: transactionId || '',
  });
}
