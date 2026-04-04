"use client";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadImageAction } from "@/app/admin/actions/upload-actions";
import { cn } from "@/lib/utils";

const SENSEI_MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const GALLERY_MAX_SIZE = 10 * 1024 * 1024; // 10 MB

interface ImageUploadProps {
  bucket: "senseis" | "gallery" | "championships";
  value?: string;
  onChange: (url: string) => void;
  className?: string;
  inputId?: string;
}

export function ImageUpload({
  bucket,
  value,
  onChange,
  className,
  inputId,
}: ImageUploadProps) {
  const uploadId = inputId ?? `image-upload-${bucket}`;
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const maxSize = bucket === "senseis" ? SENSEI_MAX_SIZE : GALLERY_MAX_SIZE;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Arquivo deve ser uma imagem (JPG, PNG, WebP, etc.)");
      return;
    }

    if (file.size > maxSize) {
      const maxMB = maxSize / (1024 * 1024);
      setError(`Arquivo deve ter no máximo ${maxMB} MB`);
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const fd = new FormData();
      fd.set("file", file);
      const result = await uploadImageAction(fd, bucket);

      if ("error" in result) {
        setError(result.error);
        return;
      }

      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar imagem");
    } finally {
      setUploading(false);
      setProgress(100);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove() {
    onChange("");
    setError(null);
  }

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="hidden"
        id={uploadId}
      />
      {value ? (
        <div className="relative inline-block">
          <div className="relative h-24 w-24 overflow-hidden rounded-md border border-border">
            <img
              src={value}
              alt="Preview"
              className="h-full w-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon-xs"
              className="absolute top-1 right-1"
              onClick={handleRemove}
              disabled={uploading}
              aria-label="Remover imagem"
            >
              <X className="size-3" />
            </Button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={uploadId}
          className={cn(
            "flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:bg-muted",
            uploading && "pointer-events-none opacity-70"
          )}
        >
          {uploading ? (
            <>
              <div className="h-1 w-16 overflow-hidden rounded-full bg-muted-foreground/20">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">Enviando…</span>
            </>
          ) : (
            <>
              <Upload className="size-6 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Clique para enviar
              </span>
            </>
          )}
        </label>
      )}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
