export function timestampToSeconds(ts: string): number {
  const parts = ts.split(":").map(Number);

  if (parts.length === 3) {
    const [h, m, s] = parts;
    return h * 3600 + m * 60 + s;
  }

  if (parts.length === 2) {
    const [m, s] = parts;
    return m * 60 + s;
  }

  return Number(ts) || 0;
}
