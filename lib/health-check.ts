/**
 * Checks whether the ACP_SERVICE_HOST is reachable.
 * Returns true if the host responds (any HTTP status), false if unreachable.
 */
export async function isACPServiceReachable(): Promise<boolean> {
  const host = process.env.ACP_SERVICE_HOST;
  if (!host) return false;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(host, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timeout);
    return response.status < 500;
  } catch {
    return false;
  }
}
