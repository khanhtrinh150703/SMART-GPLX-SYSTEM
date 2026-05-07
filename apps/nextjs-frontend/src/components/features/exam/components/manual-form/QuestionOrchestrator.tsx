"use client";

import React, { useCallback, useMemo } from "react";
import {
  DndContext,
  MouseSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  rectIntersection,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence } from "framer-motion";

import { QuestionItem } from "./QuestionItem";
import { orchestratorStyles } from "./question-orchestrator.variants";
import { IExamQuestionSummary } from "@/components/features/question/types/question-summary.types";
import { cn } from "@/lib/utils/utils";

interface DragData {
  type: "pool" | "selected";
  question: IExamQuestionSummary;
}

interface QuestionOrchestratorProps {
  pool: IExamQuestionSummary[];
  selectedIds: string[];
  groupedSelected: Record<string, IExamQuestionSummary[]>;
  onToggle: (question: IExamQuestionSummary, isShift: boolean) => void;
  onReorder: (newIds: string[]) => void;
  stats: { count: number; criticalCount: number };
  config: { total: number; minCritical: number };
}

export const QuestionOrchestrator = React.memo(function QuestionOrchestrator({
  pool,
  selectedIds,
  groupedSelected,
  onToggle,
  onReorder,
  stats,
  config,
}: QuestionOrchestratorProps) {
  // MouseSensor nhạy nhất: Nhích 2px là nhận diện kéo, không delay 1 giây nào
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 2 },
    }),
  );

  // A. Memoize danh sách IDs cho SortableContext (tránh map lại mỗi lần render)
  const poolIds = useMemo(() => pool.map((q) => `pool-${q.id}`), [pool]);

  // B. Chuyển selectedIds sang Set để check .has() nhanh hơn (O(1) thay vì O(n))
  const selectedIdsSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  // C. Memoize groupedSelected entries để tránh chạy Object.entries mỗi lần render
  const groupedEntries = useMemo(
    () => Object.entries(groupedSelected) as [string, IExamQuestionSummary[]][],
    [groupedSelected],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeData = active.data.current as DragData;
      if (!activeData) return;

      if (
        active.id.toString().startsWith("pool-") &&
        over.id === "review-dropzone"
      ) {
        if (!selectedIdsSet.has(activeData.question.id)) {
          // Dùng Set ở đây
          onToggle(activeData.question, false);
        }
        return;
      }

      if (
        active.id.toString().startsWith("selected-") &&
        over.id.toString().startsWith("selected-")
      ) {
        const overData = over.data.current as DragData;
        if (!overData) return;

        const oldIdx = selectedIds.indexOf(activeData.question.id);
        const newIdx = selectedIds.indexOf(overData.question.id);

        if (oldIdx !== -1 && newIdx !== -1 && oldIdx !== newIdx) {
          onReorder(arrayMove(selectedIds, oldIdx, newIdx));
        }
      }
    },
    [onToggle, onReorder, selectedIds, selectedIdsSet],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
    >
      <div className={orchestratorStyles.wrapper}>
        <section className={orchestratorStyles.poolSection}>
          <header className="px-2">
            <h3 className={orchestratorStyles.poolHeader}>
              Kho câu hỏi hệ thống
            </h3>
          </header>
          <div className={orchestratorStyles.tableWrapper}>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-slate-100">
                {/* Dùng poolIds đã memoize */}
                <SortableContext
                  items={poolIds}
                  strategy={verticalListSortingStrategy}
                >
                  {pool.map((q) => (
                    <QuestionItem
                      key={q.id}
                      question={q}
                      isSelected={selectedIdsSet.has(q.id)} // Check cực nhanh bằng Set
                      onToggle={onToggle}
                      variant="pool"
                    />
                  ))}
                </SortableContext>
              </tbody>
            </table>
          </div>
        </section>

        <section
          id="review-dropzone"
          className={cn(
            orchestratorStyles.reviewSection,
            "min-h-[600px] bg-slate-50/50",
          )}
        >
          <div className={orchestratorStyles.validationBar}>
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-black">
                {stats.count} / {config.total}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Tiến độ câu hỏi
              </span>
            </div>
          </div>

          <div className={orchestratorStyles.reviewList}>
            <AnimatePresence mode="popLayout">
              {/* Dùng groupedEntries đã memoize */}
              {groupedEntries.map(([chapter, questions]) => (
                <div key={chapter} className="flex flex-col gap-2 mb-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase px-2">
                    {chapter}
                  </h4>
                  <SortableContext
                    items={questions.map((q) => `selected-${q.id}`)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="flex flex-col gap-1">
                      {questions.map((q) => (
                        <QuestionItem
                          key={q.id}
                          question={q}
                          onToggle={onToggle}
                          variant="selected"
                        />
                      ))}
                    </div>
                  </SortableContext>
                </div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </DndContext>
  );
});
