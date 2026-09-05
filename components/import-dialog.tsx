"use client";
import { useEffect, useRef, useState } from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import { setJSON } from "@/lib/storage";
import {
  MAX_IMPORT_BYTES,
  collectExport,
  parseImportFile,
  previewOf,
  type ImportPreview,
  type ValidImport,
} from "@/lib/portability";
import { downloadJSON } from "@/lib/export-data";
import { Button } from "@/components/ui";

function exportFilename(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `ikigai-export-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}.json`;
}

export function ImportDialog({ onImported }: { onImported: () => void }) {
  const [open, setOpen] = useState(false);
  const [parsed, setParsed] = useState<ValidImport | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fileName, setFileName] = useState("");
  const [restorePrefs, setRestorePrefs] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      dialogRef.current?.querySelector<HTMLElement>("button")?.focus();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") close();
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }
    triggerRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open ]);

  function close() {
    setOpen(false);
    setParsed(null);
    setPreview(null);
    setError("");
    setFileName("");
    if (fileRef.current) fileRef.current.value = "";
  }

  async function onFile(file: File | undefined) {
    setError("");
    setSuccess("");
    setParsed(null);
    setPreview(null);
    if (!file) return;
    setFileName(file.name);
    if (!/json$/i.test(file.type) && !/\.json$/i.test(file.name)) {
      setError("Only JSON export files (.json) are accepted.");
      return;
    }
    if (file.size > MAX_IMPORT_BYTES) {
      setError(`The file is too large (limit ${(MAX_IMPORT_BYTES / 1024 / 1024).toFixed(0)} MB).`);
      return;
    }
    let text = "";
    try {
      text = await file.text();
    } catch {
      setError("The file could not be read.");
      return;
    }
    const res = parseImportFile(text);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setParsed(res.value);
    setPreview(previewOf(res.value));
    setOpen(true);
  }

  function confirmReplace() {
    if (!parsed) return;
    try {
      const d = parsed.data;
      setJSON(STORAGE_KEYS.answers, d.assessment ?? {});
      if (d.results === null) {
        try { window.localStorage?.removeItem(STORAGE_KEYS.result); } catch { /* ignore */ }
      } else {
        setJSON(STORAGE_KEYS.result, d.results);
      }
      setJSON(STORAGE_KEYS.flow, d.flow ?? []);
      if (d.plan === null) {
        try { window.localStorage?.removeItem(STORAGE_KEYS.plan); } catch { /* ignore */ }
      } else {
        setJSON(STORAGE_KEYS.plan, d.plan);
      }
      setJSON(STORAGE_KEYS.journal, d.journal ?? []);
      setJSON(STORAGE_KEYS.circle, d.circle ?? []);
      if (restorePrefs && d.preferences && Object.keys(d.preferences).length > 0) {
        const current = (() => {
          try { return JSON.parse(window.localStorage?.getItem(STORAGE_KEYS.prefs) ?? "{}"); } catch { return {}; }
        })();
        setJSON(STORAGE_KEYS.prefs, { ...current, ...d.preferences });
      }
    } catch {
      setError("Import failed while saving. Your previous data may be partially written — export first next time.");
      return;
    }
    close();
    setSuccess("Import complete. Your data has been replaced with the file’s contents.");
    onImported();
  }

  return (
    <div>
      <input
        ref={fileRef}
        data-testid="import-file"
        type="file"
        accept="application/json,.json"
        aria-label="Choose an Ikigai export file to import"
        className="sr-only"
        onChange={(e) => onFile(e.target.files?.[0])}
      />
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => downloadJSON(exportFilename(), collectExport())}>
          Download current data first
        </Button>
        <button
          ref={triggerRef}
          data-testid="import-choose"
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold"
          onClick={() => fileRef.current?.click()}
        >
          Import from file…
        </button>
      </div>
      {fileName && !open && !success && <p className="mt-2 text-sm text-[var(--muted)]" aria-live="polite">Selected: {fileName}</p>}
      {error && !open && (
        <p role="alert" className="mt-2 text-sm text-error">{error}</p>
      )}
      {success && (
        <p role="status" className="mt-2 text-sm font-semibold text-success">{success}</p>
      )}

      {open && parsed && preview && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-black/50 p-4" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <div
            ref={dialogRef}
            data-testid="import-preview"
            role="dialog"
            aria-modal="true"
            aria-labelledby="import-title"
            className="royal-card w-full max-w-lg p-6"
          >
            <h2 id="import-title" className="text-xl font-bold">Preview import</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Exported {preview.exportedAt.slice(0, 10)} · format v{preview.version}. Replacing will overwrite matching data on this device.
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl bg-black/[0.03] p-3 dark:bg-white/[0.05]"><dt className="text-[var(--muted)]">Answers</dt><dd className="font-bold">{preview.counts.assessment}</dd></div>
              <div className="rounded-xl bg-black/[0.03] p-3 dark:bg-white/[0.05]"><dt className="text-[var(--muted)]">Result</dt><dd className="font-bold">{preview.counts.hasResults ? "yes" : "no"}</dd></div>
              <div className="rounded-xl bg-black/[0.03] p-3 dark:bg-white/[0.05]"><dt className="text-[var(--muted)]">Flow entries</dt><dd className="font-bold">{preview.counts.flow}</dd></div>
              <div className="rounded-xl bg-black/[0.03] p-3 dark:bg-white/[0.05]"><dt className="text-[var(--muted)]">Plan days</dt><dd className="font-bold">{preview.counts.plan}</dd></div>
              <div className="rounded-xl bg-black/[0.03] p-3 dark:bg-white/[0.05]"><dt className="text-[var(--muted)]">Journal entries</dt><dd className="font-bold">{preview.counts.journal}</dd></div>
              <div className="rounded-xl bg-black/[0.03] p-3 dark:bg-white/[0.05]"><dt className="text-[var(--muted)]">Circle entries</dt><dd className="font-bold">{preview.counts.circle}</dd></div>
            </dl>
            <label className="mt-4 flex items-center gap-2 text-sm">
              <input type="checkbox" className="size-5" checked={restorePrefs} onChange={(e) => setRestorePrefs(e.target.checked)} />
              Also restore appearance & language preferences
            </label>
            {error && <p role="alert" className="mt-2 text-sm text-error">{error}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              <button data-testid="import-confirm" className="rounded-full bg-midnight px-5 py-2.5 text-sm font-semibold text-champagne dark:bg-imperial dark:text-obsidian" onClick={confirmReplace}>
                Replace current data
              </button>
              <button data-testid="import-cancel" className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold" onClick={close}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
