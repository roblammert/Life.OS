export function createId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function downloadContent(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

