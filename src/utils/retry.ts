/**
 * Extra action-level retry. Prefer Mobilewright auto-wait and config `retries`
 * first. Use this only for known-flaky non-locator work (API seed, DB, files).
 */
export async function withRetry<T>(
  action: () => Promise<T>,
  options: { attempts?: number; delayMs?: number; onRetry?: (error: unknown, attempt: number) => void } = {},
): Promise<T> {
  const attempts = options.attempts ?? 3;
  const delayMs = options.delayMs ?? 500;
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await action();
    } catch (error) {
      lastError = error;
      options.onRetry?.(error, attempt);
      if (attempt === attempts) break;
      await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
    }
  }

  throw lastError;
}
