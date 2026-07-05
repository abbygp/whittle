export const COFFEE_URL = 'https://buymeacoffee.com/abbygprince'

export const SUPPORT_EMAIL =
  import.meta.env.VITE_SUPPORT_EMAIL ?? 'support@whittledaily.com'

export function getSupportMailtoUrl(
  subject = 'Whittle Unlimited — need help',
): string {
  const body = [
    'Hi,',
    '',
    'I need help with Whittle Unlimited / Archive:',
    '',
    '- ',
    '',
    `Page: ${typeof window !== 'undefined' ? window.location.href : ''}`,
  ].join('\n')

  return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

/**
 * Stripe Payment Link for Whittle Unlimited + Archive.
 * Set success URL to either:
 * - https://whittledaily.com/?mode=unlimited&session_id={CHECKOUT_SESSION_ID}
 * - https://whittledaily.com/?mode=archive&session_id={CHECKOUT_SESSION_ID}
 */
export const STRIPE_PAYMENT_LINK =
  import.meta.env.VITE_STRIPE_PAYMENT_LINK ??
  'https://buy.stripe.com/eVqfZi4OKfl67O90e8eIw00'

/** @deprecated Use STRIPE_PAYMENT_LINK */
export const UNLIMITED_PRODUCT_URL = STRIPE_PAYMENT_LINK

export const UNLIMITED_PRICE_LABEL = '$1'
