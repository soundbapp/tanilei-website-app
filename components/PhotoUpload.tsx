"use client";

import { useRef, useState } from "react";
import type { IntakePhoto } from "@/lib/photos";

type Props = {
  label: string;
  required?: boolean;
  value: IntakePhoto | null;
  onChange: (photo: IntakePhoto | null) => void;
  disabled?: boolean;
};

async function fileToIntakePhoto(file: File): Promise<IntakePhoto> {
  const bitmap = await createImageBitmap(file);
  const maxEdge = 1280;
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not read that photo.");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  const blob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Could not compress that photo."))),
      "image/jpeg",
      0.72
    );
  });
  if (blob.size > 850_000) {
    throw new Error("That photo is still too large. Try a closer crop.");
  }
  const data = await blobToBase64(blob);
  return { mime: "image/jpeg", data };
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      const comma = text.indexOf(",");
      resolve(comma >= 0 ? text.slice(comma + 1) : text);
    };
    reader.onerror = () => reject(new Error("Could not read that photo."));
    reader.readAsDataURL(blob);
  });
}

export default function PhotoUpload({
  label,
  required,
  value,
  onChange,
  disabled,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const preview = value ? `data:${value.mime};base64,${value.data}` : null;

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const photo = await fileToIntakePhoto(file);
      onChange(photo);
    } catch (e) {
      onChange(null);
      setError(e instanceof Error ? e.message : "Could not use that photo.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <p className="mb-1.5 block text-[1.05rem] text-[var(--text-light)]">
        {label}
        {required ? <span className="text-[var(--rose-gold)]"> *</span> : null}
      </p>
      <div className="flex items-start gap-3">
        <div className="h-24 w-20 shrink-0 overflow-hidden border border-[var(--rose-light)] bg-white">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center px-1 text-center text-[1rem] text-[var(--text-light)]">
              No photo
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/*"
            capture="environment"
            disabled={disabled || busy}
            className="block w-full text-[1.15rem] text-[var(--text)] file:mr-3 file:border-0 file:bg-[var(--dark)] file:px-3 file:py-2 file:text-[1.05rem] file:font-medium file:text-white"
            onChange={(e) => void onFile(e.target.files?.[0])}
          />
          {busy && (
            <p className="mt-1.5 text-[1.05rem] text-[var(--text-light)]">Preparing photo…</p>
          )}
          {error && (
            <p className="mt-1.5 text-[1.15rem] text-red-600" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
