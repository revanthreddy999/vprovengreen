import { useState, useRef } from "react";
import { Upload, X, Star, Image, RotateCcw } from "lucide-react";
import type { MediaFile } from "../../types/room";

interface SingleUploadProps {
  label?: string;
  value: MediaFile | null;
  onChange: (file: MediaFile | null) => void;
  placeholder?: string;
}

export function SingleImageUpload({ label, value, onChange, placeholder = "Upload image" }: SingleUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const mock: MediaFile = {
      id: `img_${Date.now()}`,
      label: file.name.split(".")[0],
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      uploadedAt: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      url: URL.createObjectURL(file),
    };
    onChange(mock);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      {label && <p className="text-xs font-medium text-slate-600 mb-2">{label}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      {!value ? (
        <button type="button" onClick={() => inputRef.current?.click()}
          className="w-full h-32 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-2 hover:border-blue-300 hover:bg-blue-50/50 transition group">
          <Upload size={20} className="text-slate-300 group-hover:text-blue-400 transition" />
          <span className="text-xs text-slate-400 group-hover:text-blue-500">{placeholder}</span>
        </button>
      ) : (
        <div className="relative rounded-2xl border border-slate-200 overflow-hidden bg-slate-50">
          <img src={value.url} alt={value.label} className="w-full h-32 object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center gap-2">
            <button type="button" onClick={() => inputRef.current?.click()}
              className="p-2 rounded-xl bg-white/90 text-slate-700 hover:bg-white transition" title="Replace">
              <RotateCcw size={14} />
            </button>
            <button type="button" onClick={() => onChange(null)}
              className="p-2 rounded-xl bg-white/90 text-red-600 hover:bg-white transition" title="Remove">
              <X size={14} />
            </button>
          </div>
          <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-600 truncate">{value.fileName}</span>
            <span className="text-xs text-slate-400 shrink-0 ml-2">{value.fileSize}</span>
          </div>
        </div>
      )}
    </div>
  );
}

interface GalleryUploadProps {
  images: MediaFile[];
  onChange: (images: MediaFile[]) => void;
  maxImages?: number;
}

export function GalleryUpload({ images, onChange, maxImages = 10 }: GalleryUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newImgs: MediaFile[] = files.map(file => ({
      id: `img_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      label: file.name.split(".")[0],
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      uploadedAt: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      isPrimary: images.length === 0,
      url: URL.createObjectURL(file),
    }));
    onChange([...images, ...newImgs].slice(0, maxImages));
    if (inputRef.current) inputRef.current.value = "";
  };

  const remove = (id: string) => {
    const next = images.filter(i => i.id !== id);
    // If primary removed, make first remaining primary
    if (next.length > 0 && !next.find(i => i.isPrimary)) next[0].isPrimary = true;
    onChange(next);
  };

  const setPrimary = (id: string) => {
    onChange(images.map(i => ({ ...i, isPrimary: i.id === id })));
  };

  return (
    <div className="space-y-3">
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />

      {images.length === 0 ? (
        <button type="button" onClick={() => inputRef.current?.click()}
          className="w-full h-36 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-2 hover:border-blue-300 hover:bg-blue-50/50 transition group">
          <Image size={24} className="text-slate-300 group-hover:text-blue-400 transition" />
          <span className="text-sm text-slate-400 group-hover:text-blue-500">Add photos</span>
          <span className="text-xs text-slate-300">JPG, PNG up to 10 MB each</span>
        </button>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {images.map(img => (
            <div key={img.id} className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
              <img src={img.url} alt={img.label} className="w-full h-24 object-cover" />
              {img.isPrimary && (
                <div className="absolute top-1.5 left-1.5 bg-amber-400 text-amber-950 text-[10px] font-bold px-1.5 py-0.5 rounded-lg flex items-center gap-0.5">
                  <Star size={9} />Primary
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5">
                {!img.isPrimary && (
                  <button type="button" onClick={() => setPrimary(img.id)}
                    className="p-1.5 rounded-lg bg-white/90 text-amber-600 hover:bg-white transition" title="Set as primary">
                    <Star size={12} />
                  </button>
                )}
                <button type="button" onClick={() => remove(img.id)}
                  className="p-1.5 rounded-lg bg-white/90 text-red-600 hover:bg-white transition" title="Remove">
                  <X size={12} />
                </button>
              </div>
            </div>
          ))}
          {images.length < maxImages && (
            <button type="button" onClick={() => inputRef.current?.click()}
              className="h-24 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-1 hover:border-blue-300 hover:bg-blue-50/50 transition group">
              <Upload size={16} className="text-slate-300 group-hover:text-blue-400 transition" />
              <span className="text-xs text-slate-400">Add</span>
            </button>
          )}
        </div>
      )}

      {images.length > 0 && (
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{images.length} photo{images.length !== 1 ? "s" : ""} · Click ★ to set primary</span>
          <button type="button" onClick={() => inputRef.current?.click()}
            className="text-blue-600 hover:underline">Add more</button>
        </div>
      )}
    </div>
  );
}
