"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface UploadedFile {
  url: string;
  name: string;
  fileId: string;
  filePath: string;
}

export default function ImageUploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [folder, setFolder] = useState("/farm-commerce/products");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: File[]) => {
    const imageFiles = newFiles.filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...imageFiles]);
    const newPreviews = imageFiles.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setError(null);
    const results: UploadedFile[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("folder", folder);

      const res = await fetch("/api/imagekit", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        results.push(data);
      } else {
        const errData = await res.json();
        setError(errData.error || "Upload failed");
      }
    }

    setUploaded((prev) => [...prev, ...results]);
    setFiles([]);
    setPreviews([]);
    setUploading(false);
  };

  return (
    <div className="px-6 lg:px-12 py-8 flex flex-col gap-8 2xl:max-w-[1700px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#403c39]">Image Upload</h1>
          <p className="text-[#626262] mt-1">Upload product and gallery images via ImageKit</p>
        </div>
        <div className="flex gap-3">
          <Link href="/gallery" className="border-2 border-[#39A116] text-[#39A116] px-4 py-2 rounded-lg font-semibold hover:bg-[#39A116] hover:text-white transition-colors">
            View Gallery
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Area */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Folder Selector */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-[#403c39]">Upload Settings</h2>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#403c39]">Upload Folder</label>
              <select
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-[#39A116] transition-colors bg-white"
              >
                <option value="/farm-commerce/products">Products</option>
                <option value="/farm-commerce/gallery">Gallery</option>
                <option value="/farm-commerce/banners">Banners</option>
                <option value="/farm-commerce/farmers">Farmer Stories</option>
                <option value="/farm-commerce/blogs">Blog Images</option>
              </select>
            </div>
          </div>

          {/* Drop Zone */}
          <div
            className={`border-4 border-dashed rounded-2xl p-12 flex flex-col items-center gap-4 cursor-pointer transition-all duration-300 ${dragOver ? "border-[#39A116] bg-[#f2fae6]" : "border-gray-300 bg-white hover:border-[#39A116] hover:bg-[#f2fae6]"}`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(Array.from(e.target.files || []))}
            />
            <div className="w-16 h-16 bg-[#39A116] rounded-full flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <div className="text-center">
              <p className="text-xl font-semibold text-[#403c39]">Drop images here</p>
              <p className="text-[#626262]">or click to browse files</p>
              <p className="text-sm text-[#949494] mt-2">Supports JPG, PNG, WebP, GIF — Max 10MB per file</p>
            </div>
          </div>

          {/* Preview Grid */}
          {previews.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#403c39]">Selected Files ({files.length})</h2>
                <button
                  onClick={() => { setFiles([]); setPreviews([]); }}
                  className="text-sm text-red-500 hover:text-red-700 font-medium"
                >
                  Clear All
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {previews.map((preview, i) => (
                  <div key={i} className="relative group">
                    <div className="relative h-32 rounded-lg overflow-hidden bg-gray-100">
                      <Image src={preview} alt={`Preview ${i}`} fill className="object-cover" />
                    </div>
                    <button
                      onClick={() => removeFile(i)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                    <p className="text-xs text-[#626262] mt-1 truncate">{files[i]?.name}</p>
                    <p className="text-xs text-[#949494]">{(files[i]?.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ))}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={uploading}
                className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${uploading ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#39A116] text-white hover:bg-[#2d8011] hover:scale-[1.02]"}`}
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Uploading {files.length} file{files.length > 1 ? "s" : ""}...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    Upload {files.length} file{files.length > 1 ? "s" : ""} to ImageKit
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Sidebar: Uploaded Files + Instructions */}
        <div className="flex flex-col gap-6">
          {/* Setup Instructions */}
          <div className="bg-[#f2fae6] border border-[#39A116]/30 rounded-2xl p-6 flex flex-col gap-3">
            <h3 className="text-lg font-semibold text-[#403c39]">Setup Required</h3>
            <p className="text-sm text-[#626262]">Add these environment variables to your <code className="bg-white px-1 rounded">.env.local</code>:</p>
            <div className="bg-[#403c39] text-[#93e362] rounded-lg p-4 text-xs font-mono flex flex-col gap-1">
              <span>IMAGEKIT_PUBLIC_KEY=your_key</span>
              <span>IMAGEKIT_PRIVATE_KEY=your_key</span>
              <span>IMAGEKIT_URL_ENDPOINT=https://...</span>
            </div>
            <a
              href="https://imagekit.io/dashboard/developer/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#39A116] font-semibold hover:underline"
            >
              Get ImageKit API Keys →
            </a>
          </div>

          {/* Uploaded Results */}
          {uploaded.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-[#403c39]">Successfully Uploaded ({uploaded.length})</h3>
              <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto">
                {uploaded.map((file) => (
                  <div key={file.fileId} className="flex flex-col gap-2 border border-gray-100 rounded-lg p-3">
                    <div className="relative h-32 rounded-lg overflow-hidden bg-gray-100">
                      <Image src={file.url} alt={file.name} fill className="object-cover" />
                    </div>
                    <p className="text-sm font-medium text-[#403c39] truncate">{file.name}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigator.clipboard.writeText(file.url)}
                        className="flex-1 text-xs bg-[#39A116] text-white py-1.5 rounded-lg hover:bg-[#2d8011] transition-colors"
                      >
                        Copy URL
                      </button>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-xs border border-[#39A116] text-[#39A116] py-1.5 rounded-lg hover:bg-[#39A116] hover:text-white transition-colors text-center"
                      >
                        Open
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setUploaded([])}
                className="w-full text-sm border border-gray-300 text-[#626262] py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear History
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
