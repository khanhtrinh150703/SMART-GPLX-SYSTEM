// src/features/question/pages/advanced-import-page.tsx
"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";
import Image from "next/image";
import {
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { useImportQuestions } from "@/components/features/question/hooks/use-import-questions";
import { Alert } from "@/components/ui/Alert";
import axios from "axios";
import { ErrorReport } from "@/components/features/question/components/import-error-list";
import {
  IApiImportError,
  IImportError,
} from "@/components/features/question/types/import.types";

// Import Custom Hook và Component UI (Dịch: Nhập Hook tùy chỉnh và Giao diện thành phần)

// --- INTERFACES (Định nghĩa kiểu dữ liệu khắt khe) ---
interface RawExcelRow {
  [key: string]: string | number | undefined;
}

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

// Kiểu dữ liệu cho thông báo trạng thái (Dịch: Status message type)
type AlertMessage = {
  intent: "success" | "error" | "warning" | "info";
  text: string | React.ReactNode;
} | null;

export default function AdvancedImportPage() {
  // --- STATES ---
  const [questions, setQuestions] = useState<FormattedQuestion[]>([]);
  const [assetMap, setAssetMap] = useState<
    Map<string, { file: File; url: string }>
  >(new Map());
  const [fileName, setFileName] = useState<string | null>(null);

  // FIX 1: Thêm State để lưu trữ file Excel gốc (Add State for original Excel file)
  const [excelFile, setExcelFile] = useState<File | null>(null);

  // FIX 2: Thêm State cho tiến trình và thông báo (Add States for progress and alert message)
  const [message, setMessage] = useState<AlertMessage>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const excelInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Khởi tạo Mutation Hook (Dịch: Initialize Mutation Hook)
  const { mutation, uploadProgress } = useImportQuestions();
  const isLoading = mutation.isPending;
  // Dọn dẹp bộ nhớ khi component bị hủy (Clean up memory to prevent memory leaks)
  useEffect(() => {
    return () => assetMap.forEach((asset) => URL.revokeObjectURL(asset.url));
  }, [assetMap]);

  // 1. XỬ LÝ EXCEL
  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setExcelFile(file); // Lưu file thực tế để đẩy lên BE (Save actual file to send to BE)

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawRows = XLSX.utils.sheet_to_json<RawExcelRow>(sheet, {
          defval: "",
        });

        const formatted = rawRows.map((row) => {
          const answers: FormattedAnswer[] = [];
          const correctIdx = Number(row["Đáp án"]);

          for (let i = 1; i <= 6; i++) {
            const content = row[`Đáp án ${i}`];
            if (content && String(content).trim() !== "") {
              answers.push({
                content: String(content),
                isCorrect: correctIdx === i,
                imageName: row[`Ảnh ĐA ${i}`]
                  ? String(row[`Ảnh ĐA ${i}`])
                  : undefined,
              });
            }
          }
          return {
            stt: row["STT"] || 0,
            content: String(row["Nội dung câu hỏi"] || ""),
            questionImageName: row["Ảnh Câu Hỏi"]
              ? String(row["Ảnh Câu Hỏi"])
              : undefined,
            chapter: String(row["Chương"] || ""),
            licenses: String(row["Hạng bằng"] || "")
              .split(",")
              .map((s) => s.trim()),
            difficulty: Number(row["Độ khó"]) || 1,
            isCritical: String(row["Điểm liệt"]).toLowerCase() === "có",
            answers,
          };
        });

        setQuestions(formatted);
        setCurrentPage(1);
        setMessage({ intent: "success", text: "Đọc file Excel thành công!" });
      } catch (err) {
        setMessage({
          intent: "error",
          text: "Lỗi định dạng file Excel. Vui lòng kiểm tra lại!",
        });
        throw err;
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // 2. XỬ LÝ FOLDER ẢNH
  const handleFolderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newMap = new Map();
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        newMap.set(file.name, { file, url: URL.createObjectURL(file) });
      }
    });
    setAssetMap(newMap);
    setMessage({ intent: "info", text: `Đã tải lên ${newMap.size} hình ảnh.` });
  };

  // --- LOGIC PHÂN TRANG & MAPPING ---
  const allDataWithAssets = useMemo(() => {
    return questions.map((q) => ({
      ...q,
      questionImagePreview: q.questionImageName
        ? assetMap.get(q.questionImageName)?.url
        : null,
      answers: q.answers.map((ans) => ({
        ...ans,
        previewUrl: ans.imageName ? assetMap.get(ans.imageName)?.url : null,
      })),
    }));
  }, [questions, assetMap]);

  const totalItems = allDataWithAssets.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return allDataWithAssets.slice(start, start + itemsPerPage);
  }, [allDataWithAssets, currentPage]);

  const resetImportState = () => {
    // 1. Giải phóng bộ nhớ từ các URL preview (Memory Management)
    // Tránh rò rỉ bộ nhớ (Memory Leak) vì URL.createObjectURL không tự biến mất
    assetMap.forEach((asset) => URL.revokeObjectURL(asset.url));

    // 2. Xóa sạch các State liên quan đến dữ liệu (Clear Data States)
    setQuestions([]);
    setAssetMap(new Map());
    setExcelFile(null);
    setFileName(null);
    setCurrentPage(1);

    // 3. Reset input file (về mặt vật lý) để người dùng có thể chọn lại chính file đó nếu muốn
    if (excelInputRef.current) excelInputRef.current.value = "";
    if (folderInputRef.current) folderInputRef.current.value = "";
  };

  // FIX 3: HOÀN THIỆN HÀM IMPORT
  /**
   * @description Final import handler with full try-catch and JSX error rendering
   * (Hàm xử lý import cuối cùng với đầy đủ try-catch và hiển thị lỗi bằng JSX)
   */
  const handleFinalImport = async () => {
    // 1. Kiểm tra an toàn dữ liệu đầu vào (Dịch: Input Data Early Return)
    if (!excelFile) {
      setMessage({
        intent: "warning",
        text: "Vui lòng tải lên file Excel trước khi import!",
      });
      return;
    }

    try {
      // 2. Thông báo trạng thái đang tải (Dịch: Loading state notification)
      setMessage({
        intent: "info",
        text: "Hệ thống đang xử lý dữ liệu, vui lòng đợi trong giây lát...",
      });

      // 3. Thực thi gọi API thông qua Mutation (Dịch: Execute API call via Mutation)
      const result = await mutation.mutateAsync({ excelFile, assetMap });

      // 4. Phân rã dữ liệu metadata trả về từ Worker (Dịch: Destructure metadata from Worker)
      const { successCount, errorCount, totalRows } = result.metadata;
      const detailErrors: IImportError[] = (result.errors || []).map(
        (err: IApiImportError) => ({
          row: err.row,
          column: err.column || "N/A", // Nếu BE không trả về column, gán mặc định là "N/A"
          message: err.message,
          timestamp: err.timestamp || new Date().toISOString(), // Fallback timestamp nếu thiếu
        }),
      );

      // 5. Xử lý trạng thái thành công một phần hoặc toàn bộ (Dịch: Handle partial or full success)
      if (errorCount > 0) {
        // TRUYỀN JSX VÀO TRONG MESSAGE TEXT (Dịch: Passing JSX into message text)
        setMessage({
          intent: "warning",
          text: (
            <div className="flex w-full min-w-[400px] flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-800">
                  Nhập dữ liệu hoàn tất một phần!
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-700">
                Thành công:{" "}
                <span className="font-bold text-emerald-600">
                  {successCount}
                </span>{" "}
                | Lỗi:{" "}
                <span className="font-bold text-rose-600">{errorCount}</span> /
                Tổng: <span className="font-semibold">{totalRows}</span> câu.
              </p>

              {/* IN DANH SÁCH LỖI VÀO ĐÂY (Dịch: Print error list component here) */}
              <ErrorReport errors={detailErrors} />
            </div>
          ),
        });
      } else {
        // Hoàn thành 100% (Dịch: 100% Completed)
        setMessage({
          intent: "success",
          text: `Thành công! Đã nhập toàn bộ ${successCount}/${totalRows} câu hỏi vào hệ thống.`,
        });
      }
    } catch (error: unknown) {
      // 6. XỬ LÝ LỖI TẬP TRUNG TẠI UI (Dịch: Centralized UI Error Handling)
      // Thiết lập câu báo lỗi mặc định (Dịch: Set default error message)
      let errorMessage =
        "Hệ thống gặp sự cố khi xử lý file. Vui lòng thử lại sau.";

      // Trích xuất thông báo lỗi an toàn theo chuẩn Type-Safe (Dịch: Safely extract error message)
      if (axios.isAxiosError(error)) {
        // Lấy message từ Backend trả về (nếu có), nếu không lấy message lỗi HTTP của Axios
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        // Bắt các lỗi runtime thông thường của Javascript (Dịch: Catch standard JS runtime errors)
        errorMessage = error.message;
      }

      // Hiển thị lỗi ra Alert (Dịch: Display error in Alert)
      setMessage({
        intent: "error",
        text: errorMessage,
      });
    }
    resetImportState();
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8 bg-slate-50/50 min-h-screen relative">
      {/* COMPONENT THÔNG BÁO (Alert Overlay) */}
      {message && (
        <Alert
          intent={message.intent}
          message={message.text}
          onClose={() => setMessage(null)}
          duration={60000}
        />
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            Import <span className="text-emerald-500 italic">Questions</span>
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.3em] mt-2">
            Trạng thái: Đã nạp {totalItems} câu hỏi
          </p>
        </div>
        {totalItems > 0 && (
          <button
            onClick={handleFinalImport}
            disabled={isLoading}
            className={cn(
              "flex items-center gap-3 px-10 py-5 text-white rounded-[2rem] font-black transition-all shadow-xl group",
              isLoading
                ? "bg-slate-300 text-slate-500 cursor-not-allowed" // Trạng thái Loading
                : "bg-slate-900 hover:bg-emerald-600 active:scale-95",
            )}
          >
            {isLoading ? (
              <span>Đang xử lý {uploadProgress}%...</span> // Hiển thị tiến trình
            ) : (
              <>
                <Send
                  size={20}
                  className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                />
                XÁC NHẬN IMPORT
              </>
            )}
          </button>
        )}
      </div>

      {/* UPLOAD CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => !isLoading && excelInputRef.current?.click()}
          className={cn(
            "group border-2 border-dashed border-slate-200 rounded-[2.5rem] p-8 bg-white transition-all",
            isLoading
              ? "opacity-50 cursor-not-allowed"
              : "hover:border-emerald-500 cursor-pointer",
          )}
        >
          <input
            type="file"
            ref={excelInputRef}
            hidden
            onChange={handleExcelUpload}
            accept=".xlsx"
            disabled={isLoading}
          />
          <div className="flex items-center gap-6">
            <div className="p-5 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <FileSpreadsheet size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800">File Excel</h3>
              <p className="text-slate-400 text-sm font-medium">
                {fileName || "Chọn tệp .xlsx"}
              </p>
            </div>
          </div>
        </div>

        <div
          onClick={() => !isLoading && folderInputRef.current?.click()}
          className={cn(
            "group border-2 border-dashed border-slate-200 rounded-[2.5rem] p-8 bg-white transition-all",
            isLoading
              ? "opacity-50 cursor-not-allowed"
              : "hover:border-blue-500 cursor-pointer",
          )}
        >
          <input
            type="file"
            ref={folderInputRef}
            hidden
            multiple
            {...{ webkitdirectory: "", directory: "" }}
            onChange={handleFolderUpload}
            disabled={isLoading}
          />
          <div className="flex items-center gap-6">
            <div className="p-5 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
              <FolderOpen size={32} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800">Thư mục ảnh</h3>
              <p className="text-slate-400 text-sm font-medium">
                Đã khớp {assetMap.size} ảnh
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* LIST OF QUESTION CARDS */}
      <div className="space-y-8">
        {currentItems.map((q, i) => (
          <div
            key={i}
            className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col group transition-all hover:ring-2 ring-emerald-500/20"
          >
            {/* PHẦN CÂU HỎI */}
            <div className="p-8 md:p-10 border-b border-slate-50 bg-slate-50/30">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center justify-center w-12 h-12 bg-slate-900 text-white rounded-2xl font-black text-xl shadow-lg">
                      {q.stt}
                    </span>
                    <div className="flex gap-2">
                      <span className="px-4 py-1 bg-white border border-slate-200 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {q.chapter}
                      </span>
                      {q.isCritical && (
                        <span className="px-4 py-1 bg-rose-500 text-white rounded-full text-[10px] font-black uppercase animate-pulse">
                          Điểm liệt
                        </span>
                      )}
                    </div>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
                    {q.content}
                  </h2>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {q.licenses.map((l) => (
                      <span
                        key={l}
                        className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-black"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Ảnh câu hỏi */}
                {q.questionImagePreview ? (
                  <div className="relative w-full md:w-[400px] aspect-video rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl bg-white flex-shrink-0">
                    <Image
                      src={q.questionImagePreview}
                      alt={`Question ${q.stt}`}
                      fill
                      unoptimized
                      className="object-contain"
                      priority
                    />
                  </div>
                ) : (
                  q.questionImageName && (
                    <div className="w-full md:w-[400px] h-24 flex items-center justify-center rounded-[2rem] border-2 border-dashed border-rose-200 bg-rose-50 text-rose-500 font-bold text-sm italic gap-2">
                      <XCircle size={18} /> Thiếu ảnh: {q.questionImageName}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* PHẦN ĐÁP ÁN */}
            <div className="p-8 md:p-10 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {q.answers.map((ans, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "relative p-6 rounded-[2rem] border-2 transition-all flex flex-col gap-4",
                      ans.isCorrect
                        ? "bg-emerald-50/50 border-emerald-200 shadow-sm"
                        : "bg-slate-50/30 border-slate-100",
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={cn(
                          "w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-black shadow-sm",
                          ans.isCorrect
                            ? "bg-emerald-500 text-white"
                            : "bg-white text-slate-400 border border-slate-200",
                        )}
                      >
                        {idx + 1}
                      </span>
                      <p
                        className={cn(
                          "text-base font-bold leading-snug",
                          ans.isCorrect ? "text-emerald-900" : "text-slate-600",
                        )}
                      >
                        {ans.content}
                      </p>
                      {ans.isCorrect && (
                        <CheckCircle2
                          className="absolute top-4 right-4 text-emerald-500"
                          size={24}
                        />
                      )}
                    </div>
                    {/* Ảnh đáp án */}
                    {ans.previewUrl && (
                      <div className="relative w-full h-32 rounded-xl overflow-hidden bg-white border border-slate-100">
                        <Image
                          src={ans.previewUrl}
                          alt={`Answer ${idx + 1}`}
                          fill
                          unoptimized
                          priority
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

      {/* PHÂN TRANG */}
      {totalItems > 0 && (
        <div className="flex justify-between items-center bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 sticky bottom-8">
          <p className="text-sm font-bold text-slate-400 ml-4 italic">
            Trang {currentPage} / {totalPages} ({totalItems} câu)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCurrentPage((prev) => Math.max(1, prev - 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={currentPage === 1}
              className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-30"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2 px-2">
              {[...Array(totalPages)].map((_, idx) => {
                const p = idx + 1;
                if (
                  p === 1 ||
                  p === totalPages ||
                  (p >= currentPage - 1 && p <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={p}
                      onClick={() => {
                        setCurrentPage(p);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={cn(
                        "w-10 h-10 rounded-xl text-sm font-black transition-all",
                        currentPage === p
                          ? "bg-emerald-500 text-white shadow-lg scale-110"
                          : "bg-slate-50 text-slate-400",
                      )}
                    >
                      {p}
                    </button>
                  );
                }
                if (p === currentPage - 2 || p === currentPage + 2)
                  return (
                    <span key={p} className="text-slate-300">
                      ...
                    </span>
                  );
                return null;
              })}
            </div>
            <button
              onClick={() => {
                setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
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
