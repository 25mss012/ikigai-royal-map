export function download(filename: string, content: string, mime = "application/json"): void {
  try {
    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 500);
  } catch { /* ignore */ }
}

export function downloadJSON(filename: string, data: unknown): void {
  download(filename, JSON.stringify(data, null, 2), "application/json");
}
