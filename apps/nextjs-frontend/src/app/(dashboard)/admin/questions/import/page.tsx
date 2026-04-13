"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";
import Image from "next/image"; // Import component Image của Next.js
import { 
  UploadCloud, FileSpreadsheet, Trash2, 
  Image as ImageIcon, CheckCircle2, XCircle, FolderOpen,
  ChevronLeft, ChevronRight, Send, HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils/utils";

// --- INTERFACES (Giao diện dữ liệu) ---
interface RawExcelRow { [key: string]: string | number | undefined; }

interface FormattedAnswer {
  content: string;
  isCorrect: boolean;
  imageName?: string;
  previewUrl?: string | null;
}

interface FormattedQuestion {
  stt: string | number;
  content: string;
  questionImageName?: string;
  questionImagePreview?: string | null;
  chapter: string;
  licenses: string[];
  difficulty: number;
  isCritical: boolean;
  answers: FormattedAnswer[];
}

export default function AdvancedImportPage() {
  const [questions, setQuestions] = useState<FormattedQuestion[]>([]);
  const [assetMap, setAssetMap] = useState<Map<string, { file: File; url: string }>>(new Map());
  const [fileName, setFileName] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; 

  const excelInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Dọn dẹp bộ nhớ khi component bị hủy (Clean up memory)
  useEffect(() => {
    return () => assetMap.forEach((asset) => URL.revokeObjectURL(asset.url));
  }, [assetMap]);

  // 1. XỬ LÝ EXCEL
  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawRows = XLSX.utils.sheet_to_json<RawExcelRow>(sheet, { defval: "" });

        const formatted = rawRows.map((row) => {
          const answers: FormattedAnswer[] = [];
          const correctIdx = Number(row["Đáp án"]);
          
          for (let i = 1; i <= 6; i++) {
            const content = row[`Đáp án ${i}`];
            if (content && String(content).trim() !== "") {
              answers.push({
                content: String(content),
                isCorrect: correctIdx === i,
                imageName: row[`Ảnh ĐA ${i}`] ? String(row[`Ảnh ĐA ${i}`]) : undefined,
              });
            }
          }
          return {
            stt: row["STT"] || 0,
            content: String(row["Nội dung câu hỏi"] || ""),
            questionImageName: row["Ảnh Câu Hỏi"] ? String(row["Ảnh Câu Hỏi"]) : undefined,
            chapter: String(row["Chương"] || ""),
            licenses: String(row["Hạng bằng"] || "").split(",").map(s => s.trim()),
            difficulty: Number(row["Độ khó"]) || 1,
            isCritical: String(row["Điểm liệt"]).toLowerCase() === "có",
            answers,
          };
        });

        setQuestions(formatted);
        setCurrentPage(1); 
      } catch (err) { alert("Lỗi đọc file Excel!"); }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFolderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newMap = new Map();
    Array.from(files).forEach(file => {
      if (file.type.startsWith("image/")) {
        newMap.set(file.name, { file, url: URL.createObjectURL(file) });
      }
    });
    setAssetMap(newMap);
  };

  const allDataWithAssets = useMemo(() => {
    return questions.map(q => ({
      ...q,
      questionImagePreview: q.questionImageName ? assetMap.get(q.questionImageName)?.url : null,
      answers: q.answers.map(ans => ({
        ...ans,
        previewUrl: ans.imageName ? assetMap.get(ans.imageName)?.url : null,
      }))
    }));
  }, [questions, assetMap]);

  const totalItems = allDataWithAssets.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return allDataWithAssets.slice(start, start + itemsPerPage);
  }, [allDataWithAssets, currentPage]);

  const handleFinalImport = () => {
    alert(`Đang tiến hành Import toàn bộ ${allDataWithAssets.length} câu hỏi.`);
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8 bg-slate-50/50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            Import <span className="text-emerald-500 italic">600 Questions</span>
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em] mt-2">
            Trạng thái: Đã nạp {totalItems} câu hỏi
          </p>
        </div>
        {totalItems > 0 && (
          <button 
            onClick={handleFinalImport}
            className="flex items-center gap-3 px-10 py-5 bg-slate-900 hover:bg-emerald-600 text-white rounded-[2rem] font-black transition-all shadow-xl active:scale-95 group"
          >
            <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            XÁC NHẬN IMPORT
          </button>
        )}
      </div>

      {/* UPLOAD CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div onClick={() => excelInputRef.current?.click()} className="group border-2 border-dashed border-slate-200 rounded-[2.5rem] p-8 bg-white hover:border-emerald-500 transition-all cursor-pointer">
          <input type="file" ref={excelInputRef} hidden onChange={handleExcelUpload} accept=".xlsx" />
          <div className="flex items-center gap-6">
            <div className="p-5 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all"><FileSpreadsheet size={32} /></div>
            <div><h3 className="text-xl font-black text-slate-800">File Excel</h3><p className="text-slate-400 text-sm font-medium">{fileName || "Chọn tệp .xlsx"}</p></div>
          </div>
        </div>

        <div onClick={() => folderInputRef.current?.click()} className="group border-2 border-dashed border-slate-200 rounded-[2.5rem] p-8 bg-white hover:border-blue-500 transition-all cursor-pointer">
          <input type="file" ref={folderInputRef} hidden multiple {...({ webkitdirectory: "", directory: "" })} onChange={handleFolderUpload} />
          <div className="flex items-center gap-6">
            <div className="p-5 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all"><FolderOpen size={32} /></div>
            <div><h3 className="text-xl font-black text-slate-800">Thư mục ảnh</h3><p className="text-slate-400 text-sm font-medium">Đã khớp {assetMap.size} ảnh</p></div>
          </div>
        </div>
      </div>

      {/* LIST OF QUESTION CARDS (Cấu trúc mới: Câu hỏi trên, Đáp án dưới) */}
      <div className="space-y-8">
        {currentItems.map((q, i) => (
          <div key={i} className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col group transition-all hover:ring-2 ring-emerald-500/20">
            
            {/* PHẦN CÂU HỎI (Top Section) */}
            <div className="p-8 md:p-10 border-b border-slate-50 bg-slate-50/30">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center justify-center w-12 h-12 bg-slate-900 text-white rounded-2xl font-black text-xl shadow-lg">
                      {q.stt}
                    </span>
                    <div className="flex gap-2">
                      <span className="px-4 py-1 bg-white border border-slate-200 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">{q.chapter}</span>
                      {q.isCritical && <span className="px-4 py-1 bg-rose-500 text-white rounded-full text-[10px] font-black uppercase animate-pulse">Điểm liệt</span>}
                    </div>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
                    {q.content}
                  </h2>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {q.licenses.map(l => <span key={l} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-black">{l}</span>)}
                  </div>
                </div>

                {/* Ảnh câu hỏi - Sử dụng Next.js Image */}
                {q.questionImagePreview ? (
                  <div className="relative w-full md:w-[400px] aspect-video rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl bg-white flex-shrink-0">
                    <Image 
                      src={q.questionImagePreview} 
                      alt={`Question ${q.stt}`}
                      fill
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                ) : q.questionImageName && (
                  <div className="w-full md:w-[400px] h-24 flex items-center justify-center rounded-[2rem] border-2 border-dashed border-rose-200 bg-rose-50 text-rose-500 font-bold text-sm italic gap-2">
                    <XCircle size={18}/> Thiếu ảnh: {q.questionImageName}
                  </div>
                )}
              </div>
            </div>

            {/* PHẦN ĐÁP ÁN (Bottom Section - Grid) */}
            <div className="p-8 md:p-10 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {q.answers.map((ans, idx) => (
                  <div key={idx} className={cn(
                    "relative p-6 rounded-[2rem] border-2 transition-all flex flex-col gap-4",
                    ans.isCorrect 
                      ? "bg-emerald-50/50 border-emerald-200 shadow-sm" 
                      : "bg-slate-50/30 border-slate-100"
                  )}>
                    <div className="flex items-start gap-4">
                      <span className={cn(
                        "w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-black shadow-sm",
                        ans.isCorrect ? "bg-emerald-500 text-white" : "bg-white text-slate-400 border border-slate-200"
                      )}>
                        {idx + 1}
                      </span>
                      <p className={cn("text-base font-bold leading-snug", ans.isCorrect ? "text-emerald-900" : "text-slate-600")}>
                        {ans.content}
                      </p>
                      {ans.isCorrect && <CheckCircle2 className="absolute top-4 right-4 text-emerald-500" size={24} />}
                    </div>

                    {/* Ảnh đáp án - Sử dụng Next.js Image */}
                    {ans.previewUrl && (
                      <div className="relative w-full h-32 rounded-xl overflow-hidden bg-white border border-slate-100">
                        <Image 
                          src={ans.previewUrl} 
                          alt={`Answer ${idx + 1}`}
                          fill
                          unoptimized
                          className="object-contain p-2"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PHÂN TRANG (Pagination) */}
      {totalItems > 0 && (
        <div className="flex justify-between items-center bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 sticky bottom-8">
          <p className="text-sm font-bold text-slate-400 ml-4 italic">
            Trang {currentPage} / {totalPages} ({totalItems} câu)
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => { setCurrentPage(prev => Math.max(1, prev - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              disabled={currentPage === 1}
              className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-30"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2 px-2">
              {[...Array(totalPages)].map((_, idx) => {
                const p = idx + 1;
                if (p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)) {
                  return (
                    <button
                      key={p}
                      onClick={() => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={cn(
                        "w-10 h-10 rounded-xl text-sm font-black transition-all",
                        currentPage === p ? "bg-emerald-500 text-white shadow-lg scale-110" : "bg-slate-50 text-slate-400"
                      )}
                    >
                      {p}
                    </button>
                  );
                }
                if (p === currentPage - 2 || p === currentPage + 2) return <span key={p} className="text-slate-300">...</span>;
                return null;
              })}
            </div>
            <button 
              onClick={() => { setCurrentPage(prev => Math.min(totalPages, prev + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              disabled={currentPage === totalPages}
              className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-30"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}