// src/pages/client/UploadDocuments.jsx
// Client uploads tax documents — drag & drop or click to browse
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useApi } from "../../hooks/useApi";
import { Card, CardHeader, StatusBadge, PageHeader, Spinner } from "../../components/common/UI";
import { Upload, FileText, X, Download, Trash2 } from "lucide-react";

const CATEGORIES = ["GST", "ITR", "TDS", "Business Registration", "Other"];
const PERIODS    = ["April 2025", "March 2025", "February 2025", "January 2025", "FY 2024-25", "Q4 FY25", "Q3 FY25"];

const UploadDocuments = () => {
  const [files,    setFiles]    = useState([]);   // Files staged for upload
  const [category, setCategory] = useState("GST");
  const [period,   setPeriod]   = useState("April 2025");
  const [notes,    setNotes]    = useState("");
  const [uploading, setUploading] = useState(false);

  // Fetch previously uploaded documents
  const { data, loading, refetch } = useApi("/documents");
  const uploaded = data?.documents || [];

  // ─── Dropzone setup ────────────────────────────────────────────────────────
  const onDrop = useCallback((accepted) => {
    // Append new files to the staging list (avoid duplicates by name)
    const newFiles = accepted.filter(
      f => !files.find(existing => existing.name === f.name)
    );
    setFiles(prev => [...prev, ...newFiles]);
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*":         [".jpg", ".jpeg", ".png"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel":    [".xls"],
      "application/msword":          [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxSize: 25 * 1024 * 1024, // 25 MB
  });

  const removeFile = (name) => setFiles(prev => prev.filter(f => f.name !== name));

  // ─── Upload handler ────────────────────────────────────────────────────────
  const handleUpload = async () => {
    if (files.length === 0) { toast.error("Please select at least one file"); return; }

    // Build multipart/form-data payload
    const formData = new FormData();
    files.forEach(f => formData.append("files", f));
    formData.append("category", category);
    formData.append("period",   period);
    formData.append("notes",    notes);

    setUploading(true);
    try {
      await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(`${files.length} document(s) uploaded successfully!`);
      setFiles([]);
      setNotes("");
      refetch(); // Refresh the list below
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ─── Delete a document ─────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document?")) return;
    try {
      await api.delete(`/documents/${id}`);
      toast.success("Document deleted");
      refetch();
    } catch {
      toast.error("Could not delete document");
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title="Upload Documents" subtitle="Upload files for your CA to process your filings" />

      {/* ── Upload Form ────────────────────────────────────────────── */}
      <Card className="p-6">
        <h3 className="font-bold text-slate-900 mb-5">New Upload</h3>

        {/* Category + Period selectors */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:border-indigo-500 outline-none">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Month / Period</label>
            <select value={period} onChange={e => setPeriod(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:border-indigo-500 outline-none">
              {PERIODS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Drag-and-drop zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all
            ${isDragActive ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-indigo-400 hover:bg-slate-50"}`}
        >
          <input {...getInputProps()} />
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Upload size={24} className="text-indigo-600" />
          </div>
          <p className="font-semibold text-slate-700 mb-1">
            {isDragActive ? "Drop files here..." : "Drop files here or click to browse"}
          </p>
          <p className="text-sm text-slate-400">PDF, Excel, Word, Images — up to 25 MB each</p>
        </div>

        {/* Staged files list */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map(f => (
              <div key={f.name} className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <FileText size={14} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{f.name}</p>
                    <p className="text-xs text-slate-400">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button onClick={() => removeFile(f.name)} className="text-slate-400 hover:text-red-500 transition-colors">
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Notes textarea */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes for your CA (optional)</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
            placeholder="Any context or instructions for your chartered accountant..."
            className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm resize-none focus:border-indigo-500 outline-none transition-all" />
        </div>

        {/* Upload button */}
        <button
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
          className="mt-4 w-full py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-60 text-sm flex items-center justify-center gap-2"
        >
          {uploading ? <><Spinner size={16} className="border-t-white" /> Uploading...</> : <><Upload size={16} /> Upload {files.length > 0 ? `${files.length} File${files.length > 1 ? "s" : ""}` : "Documents"}</>}
        </button>
      </Card>

      {/* ── Previously Uploaded Documents ──────────────────────────── */}
      <Card>
        <CardHeader title="Previously Uploaded" />
        {loading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : uploaded.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-8">No documents uploaded yet.</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {uploaded.map(doc => (
              <div key={doc._id} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                    <FileText size={14} className="text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{doc.name}</p>
                    <p className="text-xs text-slate-400">{doc.category} • {doc.period} • {doc.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={doc.status} />
                  <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors">
                    <Download size={14} />
                  </a>
                  <button onClick={() => handleDelete(doc._id)} className="text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default UploadDocuments;
