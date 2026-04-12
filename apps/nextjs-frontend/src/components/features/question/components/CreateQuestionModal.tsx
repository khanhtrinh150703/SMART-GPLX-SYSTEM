"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HelpCircle } from "lucide-react";
import axios from "axios";

import { BaseModal } from "@/components/common/Modals/BaseModal";
import Button from "@/components/ui/Button/Button";
import { Alert } from "@/components/ui/Alert";

import {
  questionFormSchema,
  QuestionFormValues,
} from "../schema/question.schema";
import { IAnswerPayload } from "../types/question.types";
import { QuestionFormFields } from "./QuestionFormFields";

// Props interface remains the same (Giao diện props giữ nguyên)
interface CreateQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData) => Promise<unknown>;
  isLoading?: boolean;
  chapters: { value: string; label: string }[];
  licenses: { value: string; label: string }[];
}

export function CreateQuestionModal({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
  chapters,
  licenses,
}: CreateQuestionModalProps) {
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [answerPreviews, setAnswerPreviews] = useState<Record<number, string>>(
    {},
  );

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      content: "",
      chapterId: "",
      licenseCategoryIds: [],
      difficultyLevel: 2,
      isCritical: false,
      status: "ACTIVE",
      imageFile: null,
      answers: [
        { content: "", isCorrect: true, imageFile: null },
        { content: "", isCorrect: false, imageFile: null },
      ],
    },
  });

  // Cleanup on close (Dọn dẹp khi đóng)
  // 1. Dọn dẹp ảnh chính khi nó thay đổi (Cleanup main image when it changes)
  useEffect(() => {
    return () => {
      if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);
    };
  }, [mainImagePreview]);

  // 2. Logic reset form khi đóng modal (Reset logic when modal closes)
  useEffect(() => {
    if (!isOpen) {
      setMainImagePreview(null);
      setAnswerPreviews({});
      setMessage(null);
      form.reset();
    }
  }, [isOpen, form]);

  // --- Handlers passed to Shared Component (Các hàm truyền xuống component dùng chung) ---
  const handlers = {
    onMainImageChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        form.setValue("imageFile", file, { shouldValidate: true });
        setMainImagePreview(URL.createObjectURL(file));
      }
    },
    removeMainImage: () => {
      form.setValue("imageFile", null);
      if (mainImagePreview) URL.revokeObjectURL(mainImagePreview);
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
        setAnswerPreviews((prev) => ({
          ...prev,
          [index]: URL.createObjectURL(file),
        }));
      }
    },
    removeAnswerImage: (index: number) => {
      form.setValue(`answers.${index}.imageFile`, null);
      if (answerPreviews[index]) URL.revokeObjectURL(answerPreviews[index]);
      setAnswerPreviews((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
    },
  };

  // --- Submit Logic (Logic nộp biểu mẫu giữ nguyên) ---
  const onSubmit: SubmitHandler<QuestionFormValues> = async (values) => {
    try {
      setMessage(null);
      const formData = new FormData();
      formData.append("content", values.content.trim());
      formData.append("chapterId", values.chapterId);
      formData.append("difficultyLevel", String(values.difficultyLevel));
      formData.append("isCritical", String(values.isCritical));
      formData.append("status", values.status);
      values.licenseCategoryIds.forEach((id) =>
        formData.append("licenseCategoryIds[]", id),
      );

      if (values.imageFile instanceof File)
        formData.append("imageFile", values.imageFile);

      const answersPayload: IAnswerPayload[] = [];
      let imageCounter = 0;

      values.answers.forEach((ans) => {
        const payload: IAnswerPayload = {
          content: ans.content.trim(),
          isCorrect: ans.isCorrect,
        };
        if (ans.imageFile instanceof File) {
          payload.imageIndex = imageCounter;
          formData.append("answerImages", ans.imageFile);
          imageCounter++;
        }
        answersPayload.push(payload);
      });

      formData.append("answers", JSON.stringify(answersPayload));

      await onSave(formData);
      setMessage({ type: "success", text: "Tạo câu hỏi thành công!" });
      setTimeout(() => onClose(), 1200);
    } catch (error: unknown) {
      if (axios.isAxiosError(error))
        setMessage({
          type: "error",
          text: error.response?.data?.message || "Lỗi Server",
        });
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Khởi tạo Câu hỏi mới"
      description="Quản lý câu hỏi linh hoạt với đáp án đính kèm hình ảnh"
      icon={HelpCircle}
      maxWidth="7xl"
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col h-full relative"
      >
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 custom-scrollbar min-h-[50vh] max-h-[75vh] transform-gpu will-change-scroll contain-content">
          {message && (
            <div className="mb-6">
              <Alert
                intent={message.type}
                message={message.text}
                onClose={() => setMessage(null)}
              />
            </div>
          )}

          {/* SỬ DỤNG COMPONENT DÙNG CHUNG Ở ĐÂY */}
          <QuestionFormFields
            form={form}
            previews={{ main: mainImagePreview, answers: answerPreviews }}
            handlers={handlers}
            options={{ chapters, licenses }}
          />
        </div>

        {/* FOOTER */}
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
            text="XÁC NHẬN LƯU CÂU HỎI"
          />
        </div>
      </form>
    </BaseModal>
  );
}
