import React from "react";
import {
  FieldValues,
  UseFormReturn,
  useFieldArray,
  Path,
  PathValue,
  FieldArrayPath,
} from "react-hook-form";
import {
  FileText,
  ShieldAlert,
  UploadCloud,
  Plus,
  CheckCircle2,
  Trash2,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { questionFormVariants as v } from "./variants/question-modal.variants";
import { DIFFICULTY_OPTIONS } from "./question.config";
import Image from "next/image";
import { Select } from "@/components/ui/Select/Select";

// Interface for shared props using Generic T
// (Giao diện cho các thuộc tính dùng chung sử dụng Generic T)
export interface QuestionFormFieldsProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  previews: {
    main: string | null;
    answers: Record<number, string>;
  };
  handlers: {
    onMainImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAnswerImageChange: (
      index: number,
      e: React.ChangeEvent<HTMLInputElement>,
    ) => void;
    removeMainImage: () => void;
    removeAnswerImage: (index: number) => void;
  };
  options: {
    chapters: { value: string; label: string }[];
    licenses: { value: string; label: string }[];
  };
}

// Using 'function' keyword to avoid TSX Generic ambiguity
// (Sử dụng từ khóa 'function' để tránh sự nhập nhằng Generic trong TSX)
export function QuestionFormFields<T extends FieldValues>({
  form,
  previews,
  handlers,
  options,
}: QuestionFormFieldsProps<T>) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  // 1. Strict Field Array Handling (Xử lý mảng trường dữ liệu nghiêm ngặt)
  const { fields, append, remove } = useFieldArray({
    control,
    name: "answers" as FieldArrayPath<T>,
  });

  // 2. Strict Watchers (Theo dõi dữ liệu nghiêm ngặt)
  const answersWatcher = (watch("answers" as Path<T>) || []) as Array<{
    isCorrect: boolean;
  }>;
  const licensesWatcher = (watch("licenseCategoryIds" as Path<T>) ||
    []) as string[];
  const isCritical = watch("isCritical" as Path<T>) as boolean;

  const handleToggleLicense = (id: string) => {
    const current = [...licensesWatcher];
    const index = current.indexOf(id);
    if (index > -1) {
      current.splice(index, 1); // Xóa phần tử (Remove element)
    } else {
      current.push(id); // Thêm phần tử (Add element)
    }
    // Using PathValue to ensure type-safe updates
    // (Sử dụng PathValue để đảm bảo cập nhật an toàn về kiểu)
    setValue(
      "licenseCategoryIds" as Path<T>,
      current as PathValue<T, Path<T>>,
      { shouldValidate: true },
    );
  };

  return (
    <div className={v.form}>
      {/* LEFT COLUMN: CONTENT & SETTINGS (Cột trái: Nội dung và Cài đặt) */}
      <div className={v.leftCol}>
        <div className={v.inputGroup}>
          <label className={v.label}>
            <FileText size={14} /> Nội dung câu hỏi chính
          </label>
          <textarea
            {...register("content" as Path<T>)}
            placeholder="Nhập nội dung câu hỏi..."
            className={cn(v.inputField, "h-40 p-6 text-lg resize-none")}
          />
          {errors.content && (
            <p className="text-xs text-rose-500 font-bold mt-1 ml-1">
              {String(errors.content.message)}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={v.inputGroup}>
            <Select
              label="Chủ đề chương (Chapter Topic)"
              {...register("chapterId" as Path<T>)}
              options={options.chapters}
              error={errors.chapterId?.message as string}
              className="shadow-sm"
            />
          </div>

          <div className={v.inputGroup}>
            <label className={v.label}>Độ khó & Trạng thái</label>
            <div className="flex gap-2">
              <select
                {...register("difficultyLevel" as Path<T>, {
                  valueAsNumber: true,
                })}
                className={cn(v.inputField, "h-14 px-4 flex-1")}
              >
                {DIFFICULTY_OPTIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
              <select
                {...register("status" as Path<T>)}
                className={cn(v.inputField, "h-14 px-4 flex-1")}
              >
                <option value="ACTIVE">Hoạt động</option>
                <option value="DRAFT">Bản nháp</option>
              </select>
            </div>
          </div>
        </div>

        <div className={v.inputGroup}>
          <label className={v.label}>Áp dụng cho hạng bằng</label>
          <div className="flex flex-wrap gap-2 p-4 bg-slate-50/50 rounded-[1.5rem] border border-slate-100">
            {options.licenses.map((l) => (
              <div
                key={l.value}
                onClick={() => handleToggleLicense(l.value)}
                className={cn(
                  "px-5 py-2.5 rounded-2xl text-[11px] font-black cursor-pointer transition-all border-2 select-none",
                  licensesWatcher.includes(l.value)
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-200"
                    : "bg-white border-slate-100 text-slate-400 hover:border-emerald-300",
                )}
              >
                {l.label}
              </div>
            ))}
          </div>
        </div>

        <label
          className={cn(
            "flex items-center gap-4 p-6 rounded-[2rem] border-2 cursor-pointer transition-all",
            isCritical
              ? "bg-rose-50 border-rose-200 shadow-inner"
              : "bg-slate-50 border-transparent hover:bg-slate-100",
          )}
        >
          <input
            type="checkbox"
            {...register("isCritical" as Path<T>)}
            className="w-6 h-6 accent-rose-500 shrink-0"
          />
          <div className="flex-1">
            <p
              className={cn(
                "font-black text-sm uppercase",
                isCritical ? "text-rose-600" : "text-slate-700",
              )}
            >
              Đây là câu hỏi điểm liệt
            </p>
          </div>
          <ShieldAlert
            className={isCritical ? "text-rose-500" : "text-slate-300"}
          />
        </label>
      </div>

      {/* RIGHT COLUMN: MEDIA & ANSWERS (Cột phải: Truyền thông và Đáp án) */}
      <div className={v.rightCol}>
        <div className="relative group h-64">
          <div
            className={cn(
              "w-full h-full border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center transition-all overflow-hidden relative",
              previews.main
                ? "border-emerald-500 bg-emerald-50/20"
                : "border-slate-200 hover:border-emerald-400 bg-slate-50 hover:bg-slate-100",
            )}
          >
            {previews.main ? (
              <div className="relative w-full h-full group overflow-hidden rounded-[2.5rem]">
                <Image
                  src={previews.main}
                  alt="Question preview"
                  fill
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                  priority
                />
                <button
                  type="button"
                  onClick={handlers.removeMainImage}
                  className={cn(
                    "absolute top-4 right-4 z-10 p-2.5",
                    "bg-rose-500/90 text-white rounded-full shadow-lg",
                    "hover:bg-rose-600 hover:scale-110 active:scale-90",
                    "transition-all duration-200 backdrop-blur-sm",
                  )}
                  title="Xóa ảnh (Remove image)"
                >
                  <X size={18} strokeWidth={3} />
                </button>
              </div>
            ) : (
              <label
                className={cn(
                  "cursor-pointer flex flex-col items-center justify-center gap-4 w-full h-full",
                  "hover:bg-emerald-50/50 transition-colors duration-300 group",
                )}
              >
                <div className="p-5 rounded-3xl bg-emerald-50 text-emerald-500 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300">
                  <UploadCloud size={42} strokeWidth={1.5} />
                </div>

                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm font-black text-slate-600 uppercase tracking-widest">
                    Tải ảnh minh họa
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    PNG, JPG hoặc WEBP (Tối đa 5MB)
                  </span>
                </div>

                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handlers.onMainImageChange}
                />
              </label>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className={v.label}>Danh sách đáp án</h3>
            <button
              type="button"
              onClick={() =>
                append({
                  content: "",
                  isCorrect: false,
                  imageFile: null,
                } as PathValue<T, FieldArrayPath<T>>)
              }
              className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl hover:bg-emerald-100"
            >
              <Plus size={12} /> THÊM ĐÁP ÁN
            </button>
          </div>

          <div className={v.answerScroll}>
            {fields.map((field, index) => {
              const isCorrect = answersWatcher[index]?.isCorrect;
              return (
                <div
                  key={field.id}
                  className={v.answerCard({
                    status: isCorrect ? "correct" : "normal",
                  })}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = answersWatcher.map((a, i) => ({
                          ...a,
                          isCorrect: i === index,
                        }));
                        setValue(
                          "answers" as Path<T>,
                          updated as PathValue<T, Path<T>>,
                        );
                      }}
                      className={v.checkButton({ isActive: isCorrect })}
                    >
                      {isCorrect ? <CheckCircle2 size={18} /> : index + 1}
                    </button>
                    <input
                      {...register(`answers.${index}.content` as Path<T>)}
                      placeholder={`Nhập đáp án ${index + 1}...`}
                      className="flex-1 bg-transparent border-none outline-none font-bold text-sm text-slate-700"
                    />
                    {fields.length > 2 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-slate-300 hover:text-rose-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  {/* Answer Image Preview (Xem trước ảnh đáp án) */}
                  <div className="flex items-center gap-3 pl-14">
                    <label className="cursor-pointer flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase hover:text-emerald-500">
                      <ImageIcon size={14} />{" "}
                      {previews.answers[index] ? "Thay đổi ảnh" : "Thêm ảnh"}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handlers.onAnswerImageChange(index, e)}
                      />
                    </label>
                    {previews.answers[index] && (
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-emerald-100 group/ans-img shadow-sm">
                        <Image
                          src={previews.answers[index]}
                          alt={`Answer ${index + 1} preview`}
                          fill // Lấp đầy khung 48x48 (Fill the 48x48 container)
                          className="object-cover transition-transform duration-300 group-hover/ans-img:scale-110"
                          unoptimized // Bắt buộc cho blob URLs (Required for blob URLs)
                        />
                        <button
                          type="button"
                          onClick={() => handlers.removeAnswerImage(index)}
                          className={cn(
                            "absolute inset-0 z-10 bg-rose-500/80 text-white",
                            "flex items-center justify-center",
                            "opacity-0 group-hover/ans-img:opacity-100 transition-opacity duration-200",
                            "backdrop-blur-[1px]",
                          )}
                          title="Gỡ ảnh đáp án (Remove answer image)"
                        >
                          <X size={14} strokeWidth={3} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
