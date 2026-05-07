"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils/utils";
import { SidebarQuestion } from "../../types/sidebar.types";
import { answerVariants, dotVariants } from "./question-section.variants";
import { ExplanationSection } from "./ExplanationSection";

interface QuestionSectionProps {
  question: SidebarQuestion;
  selectedAnswerId?: number;
  isReviewMode: boolean;
  onSelectAnswer: (position: number) => void;
}

export const QuestionSection = ({
  question,
  selectedAnswerId,
  isReviewMode,
  onSelectAnswer,
}: QuestionSectionProps) => {
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [prevQuestionId, setPrevQuestionId] = useState<
    string | number | undefined
  >(question?.questionId);

  // Reset state mượt mà không dùng useEffect
  if (question?.questionId !== prevQuestionId) {
    setPrevQuestionId(question?.questionId);
    setShowExplanation(false);
  }

  if (!question) return null;

  let correctAnswerId: number | undefined;
  if ("correctAnswer" in question) {
    correctAnswerId = question.correctAnswer as number;
  } else if ("correctOptionId" in question) {
    correctAnswerId = question.correctOptionId as number;
  }

  const hasImage = !!question.imageUrl;

  return (
    <div className="flex-1 overflow-y-auto px-6 md:px-10 lg:px-16 pt-8 lg:pt-12 pb-32 flex flex-col w-full scrollbar-hide relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={question.questionId}
          initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            "w-full mx-auto grid gap-8 md:gap-14 lg:items-start items-center",
            hasImage
              ? "max-w-7xl grid-cols-1 lg:grid-cols-[4.5fr_5.5fr]"
              : "max-w-4xl grid-cols-1",
          )}
        >
          {/* IMAGE SECTION */}
          {hasImage && (
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-soft relative group overflow-hidden w-full h-fit flex flex-col items-center lg:sticky lg:top-4">
              <Image
                src={question.imageUrl!}
                alt="Hình minh họa GPLX"
                width={1000}
                height={1000}
                className="w-full h-auto object-contain relative z-10 drop-shadow-sm p-4 lg:p-6 transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 45vw"
                priority
                unoptimized
              />
            </div>
          )}

          {/* CONTENT SECTION (Thay đổi luồng cấu trúc ở đây) */}
          <div className="w-full flex flex-col gap-6 lg:gap-8">
            {/* --- KHỐI 1: CÂU HỎI & NÚT GỢI Ý (Grouped together) --- */}
            <div
              className={cn(
                "flex flex-col gap-4 w-full",
                !hasImage ? "items-center" : "items-start",
              )}
            >
              <h2
                className={cn(
                  "font-black text-slate-900 leading-[1.4] lg:leading-[1.45] tracking-tight",
                  hasImage
                    ? "text-xl md:text-2xl lg:text-[28px]"
                    : "text-2xl md:text-3xl lg:text-[34px] lg:text-center",
                )}
              >
                {question.content}
              </h2>

              {/* VỊ TRÍ MỚI: Nằm gọn gàng ngay dưới câu hỏi! */}
              {isReviewMode && (
                <ExplanationSection
                  question={question}
                  showExplanation={showExplanation}
                  setShowExplanation={setShowExplanation}
                  correctAnswerId={correctAnswerId}
                  hasImage={hasImage}
                />
              )}
            </div>

            {/* --- KHỐI 2: DANH SÁCH ĐÁP ÁN --- */}
            <div className="grid gap-3 lg:gap-4 w-full">
              {question.answers?.map((answer) => {
                const isUserSelected = selectedAnswerId === answer.position;
                const isCorrect = answer.position === correctAnswerId;

                let status:
                  | "idle"
                  | "selected"
                  | "correct"
                  | "wrong"
                  | "disabled" = "idle";

                if (isReviewMode) {
                  if (isCorrect) status = "correct";
                  else if (isUserSelected && !isCorrect) status = "wrong";
                  else status = "disabled";
                } else {
                  status = isUserSelected ? "selected" : "idle";
                }

                return (
                  <button
                    key={answer.position}
                    disabled={isReviewMode}
                    onClick={() => onSelectAnswer(answer.position)}
                    className={cn(answerVariants({ status }))}
                  >
                    <span className="relative z-10 pr-6 text-[15px] lg:text-[17px] leading-relaxed">
                      {answer.content}
                    </span>

                    <div className={cn(dotVariants({ status }))}>
                      {isReviewMode && isCorrect && (
                        <CheckCircle2 size={14} strokeWidth={3} />
                      )}
                      {isReviewMode && isUserSelected && !isCorrect && (
                        <XCircle size={14} strokeWidth={3} />
                      )}
                      {!isReviewMode && isUserSelected && (
                        <div className="w-2 h-2 bg-white rounded-full shadow-sm animate-pulse" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
