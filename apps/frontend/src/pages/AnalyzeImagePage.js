import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { analysisAPI } from "../services/api";
import { Upload, Loader2, X } from "lucide-react";
/**
 * Analyze image page for person verification
 */
export const AnalyzeImagePage = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [personHint, setPersonHint] = useState("");
    const mutation = useMutation({
        mutationFn: () => {
            if (!file)
                throw new Error("No file selected");
            return analysisAPI.analyzeImage({ file, personHint: personHint || undefined });
        },
        onSuccess: (data) => {
            navigate(`/result/${data.id}`);
        },
    });
    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onload = (event) => {
                setPreview(event.target?.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };
    const handleRemoveFile = () => {
        setFile(null);
        setPreview(null);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (file) {
            mutation.mutate();
        }
    };
    return (_jsxs("div", { className: "p-8", children: [_jsx("h1", { className: "text-4xl font-bold text-slate-900 mb-2", children: "Analyze Image" }), _jsx("p", { className: "text-slate-600 mb-8", children: "Verify people in images and extract text via OCR" }), _jsxs("form", { onSubmit: handleSubmit, className: "max-w-2xl", children: [_jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Upload Image" }), !file ? (_jsxs("div", { className: "border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer", onClick: () => document.getElementById("file-input")?.click(), children: [_jsx(Upload, { className: "w-12 h-12 text-slate-400 mx-auto mb-3" }), _jsx("p", { className: "text-slate-600 font-medium", children: "Click to upload or drag and drop" }), _jsx("p", { className: "text-xs text-slate-500 mt-1", children: "PNG, JPG, GIF up to 10MB" }), _jsx("input", { id: "file-input", type: "file", accept: "image/*", onChange: handleFileChange, className: "hidden" })] })) : (_jsxs("div", { className: "relative rounded-lg overflow-hidden border border-slate-200", children: [_jsx("img", { src: preview, alt: "Preview", className: "w-full h-64 object-cover" }), _jsx("button", { type: "button", onClick: handleRemoveFile, className: "absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700", children: _jsx(X, { className: "w-4 h-4" }) }), _jsxs("div", { className: "p-3 bg-slate-50 border-t border-slate-200", children: [_jsx("p", { className: "text-sm text-slate-600 font-medium", children: file.name }), _jsxs("p", { className: "text-xs text-slate-500", children: [(file.size / 1024 / 1024).toFixed(2), " MB"] })] })] }))] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-sm font-medium text-slate-700 mb-2", children: "Person Hint (optional)" }), _jsx("input", { type: "text", value: personHint, onChange: (e) => setPersonHint(e.target.value), placeholder: "e.g., Barack Obama, Bill Gates", className: "w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent", disabled: mutation.isPending || !file }), _jsx("p", { className: "text-xs text-slate-500 mt-2", children: "Help identify who is in the image for better verification" })] }), mutation.isError && (_jsx("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 mb-6", children: _jsx("p", { className: "text-red-700 text-sm", children: mutation.error instanceof Error
                                ? mutation.error.message
                                : "Failed to analyze. Please try again." }) })), _jsx("button", { type: "submit", disabled: !file || mutation.isPending, className: `w-full px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${file && !mutation.isPending
                            ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                            : "bg-slate-300 text-slate-500 cursor-not-allowed"}`, children: mutation.isPending ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-4 h-4 animate-spin" }), "Analyzing..."] })) : ("Analyze Image") })] }), _jsxs("div", { className: "mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6", children: [_jsx("h3", { className: "font-semibold text-blue-900 mb-3", children: "What we do" }), _jsxs("ul", { className: "text-sm text-blue-800 space-y-2", children: [_jsx("li", { children: "\u2713 Extract text from image using OCR (Tesseract.js)" }), _jsx("li", { children: "\u2713 Identify people in image using vision model (LLaVA)" }), _jsx("li", { children: "\u2713 Verify person against official sources" }), _jsx("li", { children: "\u2713 Analyze extracted text for fake news" })] })] })] }));
};
export default AnalyzeImagePage;
