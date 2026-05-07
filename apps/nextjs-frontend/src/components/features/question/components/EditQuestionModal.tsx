"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit3 } from "lucide-react";
import axios from "axios";

import { BaseModal } from "@/components/common/Modals/BaseModal";
import Button from "@/components/ui/Button/Button";

import {
  editQuestionFormSchema,
  EditQuestionFormValues,
} from "../schema/question.schema";

import { Question } from "../types/question.types";
import { IEditAnswerPayload } from "../types/question.types";
import { QuestionFormFields } from "./QuestionFormFields";

interface EditQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: Question | null;
  onSave: (id: string, data: FormData) => Promise<unknown>;
  isLoading?: boolean;
  chapters: { value: string; label: string }[];
  licenses: { value: string; label: string }[];
}

export function EditQuestionModal({
  isOpen,
  onClose,
  initialData,
  onSave,
  isLoading = false,
  chapters,
  licenses,
}: EditQuestionModalProps) {
  // 1. Quản lý trạng thái (Đổi type -> intent cho chuẩn)
  const [message, setMessage] = useState<{
    intent: "success" | "error" | "warning";
    text: string;
  } | null>(null);

  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [answerPreviews, setAnswerPreviews] = useState<Record<number, string>>(
    {},
  );

  const form = useForm<EditQuestionFormValues>({
    resolver: zodResolver(editQuestionFormSchema),
  });

  // 2. Bơm dữ liệu (Giữ nguyên logic của bạn)
  useEffect(() => {
    if (isOpen && initialData) {
      form.reset({
        id: initialData.id,
        content: initialData.content,
        chapterId: initialData.chapterId,
        licenseCategoryIds: initialData.licenseCategoryIds,
        difficultyLevel: initialData.difficulty.level,
        isCritical: initialData.isCritical,
        indexNumber: initialData.indexNumber,
        status: (initialData.status.toLocaleLowerCase() === "active" ? "ACTIVE" : "DRAFT") as
          | "ACTIVE"
          | "DRAFT",
        existingImageUrl: initialData.imageUrl,
        imageFile: null,
        answers: initialData.answers.map((ans) => ({
          id: ans.id,
          content: ans.content,
          isCorrect: ans.isCorrect,
          existingImageUrl: ans.imageUrl,
          imageFile: null,
        })),
      });

      setMainImagePreview(initialData.imageUrl);

      const mappedPreviews: Record<number, string> = {};
      initialData.answers.forEach((ans, idx) => {
        if (ans.imageUrl) mappedPreviews[idx] = ans.imageUrl;
      });
      setAnswerPreviews(mappedPreviews);
    }
  }, [isOpen, initialData, form]);

  useEffect(() => {
    if (!isOpen) {
      setMainImagePreview(null);
      setAnswerPreviews({});
      setMessage(null);
      form.reset();
    }
  }, [isOpen, form]);

  useEffect(() => {
    return () => {
      if (mainImagePreview?.startsWith("blob:"))
        URL.revokeObjectURL(mainImagePreview);
      Object.values(answerPreviews).forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [mainImagePreview, answerPreviews]);

  // 4. Xử lý ảnh (Giữ nguyên)
  const handlers = {
    onMainImageChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        form.setValue("imageFile", file, { shouldValidate: true });
        form.setValue("existingImageUrl", null);
        setMainImagePreview(URL.createObjectURL(file));
      }
    },
    removeMainImage: () => {
      form.setValue("imageFile", null);
      form.setValue("existingImageUrl", null);
      setMainImagePreview(null);
    },
    onAnswerImageChange: (
      index: number,
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const file = e.target.files?.[0];
      if (file) {
        form.setValue(`answers.${index}.imageFile`, file, {
          shouldValidate: true,
        });
        form.setValue(`answers.${index}.existingImageUrl`, null);
        setAnswerPreviews((prev) => ({
          ...prev,
          [index]: URL.createObjectURL(file),
        }));
      }
    },
    removeAnswerImage: (index: number) => {
      form.setValue(`answers.${index}.imageFile`, null);
      form.setValue(`answers.${index}.existingImageUrl`, null);
      setAnswerPreviews((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    },
  };

  // 5. Submit Logic
  const onSubmit: SubmitHandler<EditQuestionFormValues> = async (values) => {
    try {
      setMessage(null);
      const formData = new FormData();

      formData.append("content", values.content.trim());
      formData.append("chapterId", values.chapterId);
      formData.append("difficultyLevel", String(values.difficultyLevel));
      formData.append("isCritical", String(values.isCritical));
      formData.append("status", values.status.toLowerCase());
      formData.append("indexNumber", String(values.indexNumber));
      values.licenseCategoryIds.forEach((id) =>
        formData.append("licenseCategoryIds[]", id),
      );

      if (values.imageFile instanceof File) {
        formData.append("imageFile", values.imageFile);
      } else if (!values.existingImageUrl) {
        formData.append("isMainImageDeleted", "true");
      }

      const answersPayload: IEditAnswerPayload[] = [];
      let imageCounter = 0;

      values.answers.forEach((ans) => {
        const payload: IEditAnswerPayload = {
          content: ans.content.trim(),
          isCorrect: ans.isCorrect,
        };

        if (ans.id) payload.id = ans.id;

        if (ans.imageFile instanceof File) {
          payload.imageIndex = imageCounter;
          formData.append("answerImages", ans.imageFile);
          imageCounter++;
        } else if (ans.id && !ans.existingImageUrl) {
          payload.isImageDeleted = true;
        }

        answersPayload.push(payload);
      });

      formData.append("answers", JSON.stringify(answersPayload));

      if (initialData?.id) {
        await onSave(initialData.id, formData);

        // Chỉ chạy dòng này nếu onSave thành công (không ném ra lỗi)
        setMessage({ intent: "success", text: "Cập nhật câu hỏi thành công!" });
        setTimeout(() => onClose(), 1200);
      }
    } catch (error: unknown) {
      // Đã bắt được lỗi nhờ thằng Cha ném qua!
      if (axios.isAxiosError(error)) {
        setMessage({
          intent: "error", // Đổi type thành intent
          text: error.response?.data?.message || "Lỗi Server",
        });
      } else if (error instanceof Error) {
        setMessage({ intent: "error", text: error.message });
      }
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Chỉnh sửa câu hỏi"
      description="Cập nhật nội dung, độ khó và đáp án"
      icon={Edit3}
      maxWidth="7xl"
      message={message}
      onMessageClose={() => setMessage(null)}
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-full relative"
      >
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 custom-scrollbar min-h-[50vh] max-h-[75vh] transform-gpu will-change-scroll contain-content">
          {/* Đã xóa thẻ <Alert> thủ công ở đây vì BaseModal sẽ lo việc đó */}

          <QuestionFormFields<EditQuestionFormValues>
            form={form}
            previews={{ main: mainImagePreview, answers: answerPreviews }}
            handlers={handlers}
            options={{ chapters, licenses }}
          />
        </div>

        <div className="flex justify-end items-center gap-4 pt-5 mt-4 border-t border-slate-100 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-8 font-bold text-slate-400 hover:text-slate-600 transition-all"
            disabled={isLoading}
          >
            Hủy bỏ
          </button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="px-12 h-14 rounded-2xl shadow-xl shadow-emerald-500/20 font-black tracking-wide"
            text="LƯU THAY ĐỔI"
          />
        </div>
      </form>
    </BaseModal>
  );
}
