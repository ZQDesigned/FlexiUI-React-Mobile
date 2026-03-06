function normalizeHex(hexColor: string): string {
  const raw = hexColor.trim().replace("#", "").toUpperCase();

  if (raw.length === 3) {
    return raw
      .split("")
      .map((char) => `${char}${char}`)
      .join("");
  }

  if (raw.length === 8) {
    // CSS 8-digit hex is #RRGGBBAA; only RGB is needed here.
    return raw.slice(0, 6);
  }

  return raw;
}

export function alphaColor(hexColor: string, alpha: number): string {
  const normalized = normalizeHex(hexColor);
  const safeAlpha = Math.max(0, Math.min(alpha, 1));

  if (normalized.length !== 6) {
    return hexColor;
  }

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${safeAlpha})`;
}
