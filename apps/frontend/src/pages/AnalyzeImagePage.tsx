import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { analysisAPI } from "../services/api";
import { Upload, Loader2, X } from "lucide-react";

/**
 * Analyze image page for person verification
 */
export const AnalyzeImagePage: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [personHint, setPersonHint] = useState("");

  const mutation = useMutation({
    mutationFn: () => {
      if (!file) throw new Error("No file selected");
      return analysisAPI.analyzeImage({ file, personHint: personHint || undefined });
    },
    onSuccess: (data) => {
      navigate(`/result/${data.id}`);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      mutation.mutate();
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-slate-900 mb-2">Analyze Image</h1>
      <p className="text-slate-600 mb-8">
        Verify people in images and extract text via OCR
      </p>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        {/* File Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Upload Image
          </label>

          {!file ? (
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-slate-500 mt-1">
                PNG, JPG, GIF up to 10MB
              </p>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative rounded-lg overflow-hidden border border-slate-200">
              <img
                src={preview!}
                alt="Preview"
                className="w-full h-64 object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveFile}
                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="p-3 bg-slate-50 border-t border-slate-200">
                <p className="text-sm text-slate-600 font-medium">{file.name}</p>
                <p className="text-xs text-slate-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Person Hint */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Person Hint (optional)
          </label>
          <input
            type="text"
            value={personHint}
            onChange={(e) => setPersonHint(e.target.value)}
            placeholder="e.g., Barack Obama, Bill Gates"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={mutation.isPending || !file}
          />
          <p className="text-xs text-slate-500 mt-2">
            Help identify who is in the image for better verification
          </p>
        </div>

        {/* Error */}
        {mutation.isError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm">
              {mutation.error instanceof Error
                ? mutation.error.message
                : "Failed to analyze. Please try again."}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!file || mutation.isPending}
          className={`w-full px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            file && !mutation.isPending
              ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              : "bg-slate-300 text-slate-500 cursor-not-allowed"
          }`}
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze Image"
          )}
        </button>
      </form>

      {/* Info */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">What we do</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>✓ Extract text from image using OCR (Tesseract.js)</li>
          <li>✓ Identify people in image using vision model (LLaVA)</li>
          <li>✓ Verify person against official sources</li>
          <li>✓ Analyze extracted text for fake news</li>
        </ul>
      </div>
    </div>
  );
};

export default AnalyzeImagePage;
