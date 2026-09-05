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
import { usePrefs } from "@/components/providers";
import { Button } from "@/components/ui";

function exportFilename(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `ikigai-export-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}.json`;
}

const STR = {
  en: {
    chooseLabel: "Choose an Ikigai export file to import",
    downloadFirst: "Download current data first",
    choose: "Import from file…",
    selected: "Selected:", onlyJson: "Only JSON export files (.json) are accepted.",
    tooLarge: `The file is too large (limit ${(MAX_IMPORT_BYTES / 1024 / 1024).toFixed(0)} MB).`,
    unreadable: "The file could not be read.",
    saveFail: "Import failed while saving. Your previous data may be partially written — export first next time.",
    done: "Import complete. Your data has been replaced with the file’s contents.",
    preview: "Preview import", exported: "Exported",
    replaceWarn: "Replacing will overwrite matching data on this device.",
    answers: "Answers", result: "Result", flow: "Flow entries", plan: "Plan days",
    journal: "Journal entries", circle: "Circle entries", yes: "yes", no: "no",
    restorePrefs: "Also restore appearance & language preferences",
    replace: "Replace current data", cancel: "Cancel",
  },
  ta: {
    chooseLabel: "இறக்குமதிக்கு இகிகை ஏற்றுமதிக் கோப்பைத் தேர்ந்தெடுங்கள்",
    downloadFirst: "முதலில் தற்போதைய தரவைப் பதிவிறக்குக",
    choose: "கோப்பிலிருந்து இறக்குமதி…",
    selected: "தேர்வு:", onlyJson: "JSON ஏற்றுமதிக் கோப்புகள் (.json) மட்டும் ஏற்கப்படும்.",
    tooLarge: `கோப்பு மிகப் பெரியது (வரம்பு ${(MAX_IMPORT_BYTES / 1024 / 1024).toFixed(0)} MB).`,
    unreadable: "கோப்பைப் படிக்க முடியவில்லை.",
    saveFail: "சேமிக்கும்போது இறக்குமதி தோல்வி. முந்தைய தரவு பகுதியாக எழுதப்பட்டிருக்கலாம்.",
    done: "இறக்குமதி நிறைவு. கோப்பின் உள்ளடக்கத்தால் தரவு மாற்றப்பட்டது.",
    preview: "இறக்குமதி முன்னோட்டம்", exported: "ஏற்றுமதி நாள்",
    replaceWarn: "மாற்றுவது இந்தச் சாதனத்தின் பொருந்தும் தரவை மேலெழுதும்.",
    answers: "பதில்கள்", result: "முடிவு", flow: "ஒன்றிப்புப் பதிவுகள்", plan: "திட்ட நாட்கள்",
    journal: "நாட்குறிப்புகள்", circle: "வட்டப் பதிவுகள்", yes: "ஆம்", no: "இல்லை",
    restorePrefs: "தோற்ற & மொழி விருப்பங்களையும் மீட்கவும்",
    replace: "தற்போதைய தரவை மாற்று", cancel: "ரத்து",
  },
};

export function ImportDialog({ onImported }: { onImported: () => void }) {
  const { prefs } = usePrefs();
  const s = prefs.lang === "ta" ? STR.ta : STR.en;
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
    if (!open) {
      triggerRef.current?.focus();
      return;
    }
    const root = dialogRef.current;
    root?.querySelector<HTMLElement>("button, input, select, textarea, a[href]")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
        return;
      }
      if (e.key !== "Tab" || !root) return;
      const items = Array.from(root.querySelectorAll<HTMLElement>("button, input, select, textarea, a[href]")).filter((el) => !el.hasAttribute("disabled"));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
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
      setError(s.onlyJson);
      return;
    }
    if (file.size > MAX_IMPORT_BYTES) {
      setError(s.tooLarge);
      return;
    }
    let text = "";
    try {
      text = await file.text();
    } catch {
      setError(s.unreadable);
      return;
    }
    const res = parseImportFile(text, prefs.lang);
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
      setError(s.saveFail);
      return;
    }
    close();
    setSuccess(s.done);
    onImported();
  }

  return (
    <div>
      <input
        ref={fileRef}
        data-testid="import-file"
        type="file"
        accept="application/json,.json"
        aria-label={s.chooseLabel}
        className="sr-only"
        onChange={(e) => onFile(e.target.files?.[0])}
      />
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => downloadJSON(exportFilename(), collectExport())}>
          {s.downloadFirst}
        </Button>
        <button
          ref={triggerRef}
          data-testid="import-choose"
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold"
          onClick={() => fileRef.current?.click()}
        >
          {s.choose}
        </button>
      </div>
      {fileName && !open && !success && <p className="mt-2 break-all text-sm text-[var(--muted)]" aria-live="polite">{s.selected} {fileName}</p>}
      {error && !open && (
        <p role="alert" className="mt-2 text-sm text-error">{error}</p>
      )}
      {success && (
        <p role="status" className="mt-2 text-sm font-semibold text-success">{success}</p>
      )}

      {open && parsed && preview && (
        <div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-black/50 p-4" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <div
            ref={dialogRef}
            data-testid="import-preview"
            role="dialog"
            aria-modal="true"
            aria-labelledby="import-title"
            className="royal-card my-8 max-h-[90vh] w-full max-w-lg overflow-y-auto p-6"
          >
            <h2 id="import-title" className="break-words text-xl font-bold">{s.preview}</h2>
            <p className="mt-1 break-words text-sm text-[var(--muted)]">
              {s.exported} {preview.exportedAt.slice(0, 10)} · format v{preview.version}. {s.replaceWarn}
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl bg-black/[0.03] p-3 dark:bg-white/[0.05]"><dt className="break-words text-[var(--muted)]">{s.answers}</dt><dd className="font-bold">{preview.counts.assessment}</dd></div>
              <div className="rounded-xl bg-black/[0.03] p-3 dark:bg-white/[0.05]"><dt className="break-words text-[var(--muted)]">{s.result}</dt><dd className="font-bold">{preview.counts.hasResults ? s.yes : s.no}</dd></div>
              <div className="rounded-xl bg-black/[0.03] p-3 dark:bg-white/[0.05]"><dt className="break-words text-[var(--muted)]">{s.flow}</dt><dd className="font-bold">{preview.counts.flow}</dd></div>
              <div className="rounded-xl bg-black/[0.03] p-3 dark:bg-white/[0.05]"><dt className="break-words text-[var(--muted)]">{s.plan}</dt><dd className="font-bold">{preview.counts.plan}</dd></div>
              <div className="rounded-xl bg-black/[0.03] p-3 dark:bg-white/[0.05]"><dt className="break-words text-[var(--muted)]">{s.journal}</dt><dd className="font-bold">{preview.counts.journal}</dd></div>
              <div className="rounded-xl bg-black/[0.03] p-3 dark:bg-white/[0.05]"><dt className="break-words text-[var(--muted)]">{s.circle}</dt><dd className="font-bold">{preview.counts.circle}</dd></div>
            </dl>
            <label className="mt-4 flex items-center gap-2 text-sm">
              <input type="checkbox" className="size-5 shrink-0" checked={restorePrefs} onChange={(e) => setRestorePrefs(e.target.checked)} />
              <span>{s.restorePrefs}</span>
            </label>
            {error && <p role="alert" className="mt-2 text-sm text-error">{error}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              <button data-testid="import-confirm" className="rounded-full bg-midnight px-5 py-2.5 text-sm font-semibold text-champagne dark:bg-imperial dark:text-obsidian" onClick={confirmReplace}>
                {s.replace}
              </button>
              <button data-testid="import-cancel" className="rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-semibold" onClick={close}>
                {s.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
