/**
 * Verify a Google reCAPTCHA v3 token against the siteverify endpoint.
 *
 * In development, if RECAPTCHA_SECRET_KEY is unset we skip verification so
 * the form still works locally. In production the secret must be set — the
 * bootstrap check in src/index.ts enforces this.
 */
interface VerifyResult {
  success: boolean;
  score?: number;
  action?: string;
  reason?: string;
}

export async function verifyRecaptcha(
  token: string | undefined,
  expectedAction?: string
): Promise<VerifyResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const minScore = parseFloat(process.env.RECAPTCHA_MIN_SCORE ?? '0.5');

  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      return { success: false, reason: 'recaptcha-not-configured' };
    }
    return { success: true, reason: 'dev-bypass' };
  }

  if (!token) return { success: false, reason: 'missing-token' };

  const body = new URLSearchParams({ secret, response: token });

  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const json = (await res.json()) as {
      success: boolean;
      score?: number;
      action?: string;
      'error-codes'?: string[];
    };

    if (!json.success) {
      return { success: false, reason: (json['error-codes'] || []).join(',') };
    }
    if (typeof json.score === 'number' && json.score < minScore) {
      return { success: false, score: json.score, reason: 'low-score' };
    }
    if (expectedAction && json.action && json.action !== expectedAction) {
      return { success: false, action: json.action, reason: 'action-mismatch' };
    }
    return { success: true, score: json.score, action: json.action };
  } catch (err) {
    return { success: false, reason: 'verify-failed' };
  }
}
